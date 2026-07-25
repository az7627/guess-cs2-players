const express = require('express');
const http = require('http');
const https = require('https');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');

const Room = require('./game/Room');
const { loadTeams, loadAllPlayers } = require('./dataLoader');
const { PLAYER_COLORS } = require('./colors');

const app = express();

const configPath = path.join(__dirname, '..', 'config.json');
const config = fs.existsSync(configPath)
  ? JSON.parse(fs.readFileSync(configPath, 'utf-8'))
  : {};

const PORT = process.env.PORT || config.port || 3000;
const USE_HTTPS = process.env.HTTPS === 'true' || config.https === true;
const SSL_KEY_PATH = process.env.SSL_KEY_PATH || config.sslKeyPath || '';
const SSL_CERT_PATH = process.env.SSL_CERT_PATH || config.sslCertPath || '';

let server;
if (USE_HTTPS && SSL_KEY_PATH && SSL_CERT_PATH) {
  try {
    const sslOptions = {
      key: fs.readFileSync(SSL_KEY_PATH),
      cert: fs.readFileSync(SSL_CERT_PATH),
    };
    server = https.createServer(sslOptions, app);
    console.log('HTTPS enabled');
  } catch (e) {
    console.warn('Failed to load SSL certificates, falling back to HTTP:', e.message);
    server = http.createServer(app);
  }
} else {
  server = http.createServer(app);
}

const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000,
});

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/teams', (req, res) => {
  res.json(loadTeams());
});

app.get('/api/player-search', (req, res) => {
  const { roomCode } = req.query;
  if (!roomCode || !rooms[roomCode.toUpperCase()]) {
    return res.json([]);
  }
  const room = rooms[roomCode.toUpperCase()];
  const teamIds = room.settings.teams;
  if (!teamIds || teamIds.length === 0) {
    return res.json([]);
  }
  const allPlayers = loadAllPlayers();
  const players = allPlayers
    .filter(p => teamIds.includes(p.team))
    .map(p => ({
      id: p.id,
      nickname: p.nickname,
      fullName: p.fullName,
      team: p.team,
      teamName: p.teamName,
      country: p.country,
    }));
  res.json(players);
});

const rooms = {};

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code;
  do {
    code = '';
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
  } while (rooms[code]);
  return code;
}

function cleanupRoom(roomCode) {
  const room = rooms[roomCode];
  if (room && room.isEmpty()) {
    delete rooms[roomCode];
  }
}

// Track session tokens for reconnection
const playerSessions = {}; // sessionToken -> { roomCode, socketId, isSpectator, isHost }

function generateSessionToken() {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

// Delayed cleanup: don't remove player immediately on disconnect
const disconnectTimers = {}; // socketId -> timeout

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  let currentRoom = null;
  let isSpectator = false;

  socket.on('create-room', ({ playerName, sessionToken }) => {
    if (!playerName || !playerName.trim()) return;

    const code = generateRoomCode();
    const room = new Room(code, socket.id, playerName.trim());
    rooms[code] = room;

    socket.join(code);
    currentRoom = code;
    isSpectator = false;

    const token = sessionToken || generateSessionToken();
    playerSessions[token] = { roomCode: code, socketId: socket.id, isSpectator: false, isHost: true };

    socket.emit('room-joined', { ...room.getState(), sessionToken: token });
    io.to(code).emit('room-state', room.getState());
  });

  socket.on('join-room', ({ roomCode, playerName, sessionToken }) => {
    if (!playerName || !playerName.trim() || !roomCode) return;

    const code = roomCode.toUpperCase().trim();
    const room = rooms[code];

    if (!room) {
      socket.emit('error', { message: '房间不存在' });
      return;
    }

    if (Object.keys(room.players).length >= 10) {
      socket.emit('error', { message: '房间已满（最多10人）' });
      return;
    }

    const player = room.addPlayer(socket.id, playerName.trim());
    if (!player) {
      socket.emit('error', { message: '无法加入房间' });
      return;
    }

    socket.join(code);
    currentRoom = code;
    isSpectator = false;

    const token = sessionToken || generateSessionToken();
    playerSessions[token] = { roomCode: code, socketId: socket.id, isSpectator: false, isHost: false };

    socket.emit('room-joined', { ...room.getState(), sessionToken: token });
    io.to(code).emit('room-state', room.getState());
  });

  socket.on('spectate-room', ({ roomCode, playerName, sessionToken }) => {
    if (!playerName || !playerName.trim() || !roomCode) return;

    const code = roomCode.toUpperCase().trim();
    const room = rooms[code];

    if (!room) {
      socket.emit('error', { message: '房间不存在' });
      return;
    }

    room.addSpectator(socket.id, playerName.trim());
    socket.join(code);
    currentRoom = code;
    isSpectator = true;

    const token = sessionToken || generateSessionToken();
    playerSessions[token] = { roomCode: code, socketId: socket.id, isSpectator: true, isHost: false };

    socket.emit('room-joined', { ...room.getState(), sessionToken: token });
    socket.emit('spectator-mode');
  });

  socket.on('reconnect-player', ({ sessionToken }) => {
    if (!sessionToken) return;
    const session = playerSessions[sessionToken];
    if (!session) return;

    const room = rooms[session.roomCode];
    if (!room) return;

    // Cancel pending disconnect
    if (disconnectTimers[session.socketId]) {
      clearTimeout(disconnectTimers[session.socketId]);
      delete disconnectTimers[session.socketId];
    }

    // Check if old socket is still around
    const oldPlayer = room.players[session.socketId];
    const oldSpec = room.spectators ? room.spectators[session.socketId] : null;

    if (oldPlayer) {
      // Migrate player to new socket
      room.players[socket.id] = { ...oldPlayer, id: socket.id };
      delete room.players[session.socketId];
      if (room.hostId === session.socketId) {
        room.hostId = socket.id;
      }
      if (room.game && room.game.players) {
        room.game.players[socket.id] = room.game.players[session.socketId];
        delete room.game.players[session.socketId];
        if (room.game.scores && room.game.scores[session.socketId] !== undefined) {
          room.game.scores[socket.id] = room.game.scores[session.socketId];
          delete room.game.scores[session.socketId];
        }
        if (room.game.currentRound && room.game.currentRound.guesses) {
          room.game.currentRound.guesses[socket.id] = room.game.currentRound.guesses[session.socketId];
          delete room.game.currentRound.guesses[session.socketId];
          if (room.game.currentRound.scores[session.socketId] !== undefined) {
            room.game.currentRound.scores[socket.id] = room.game.currentRound.scores[session.socketId];
            delete room.game.currentRound.scores[session.socketId];
          }
        }
      }
      session.socketId = socket.id;
      isSpectator = false;
    } else if (oldSpec) {
      room.spectators[socket.id] = { ...oldSpec, id: socket.id };
      delete room.spectators[session.socketId];
      session.socketId = socket.id;
      isSpectator = true;
    } else {
      // Player was already fully removed
      const player = session.isHost
        ? (room.addPlayer ? room.addPlayer(socket.id, 'Reconnected') : null)
        : null;
      if (!player) {
        socket.emit('error', { message: '无法重连，房间已移除你' });
        return;
      }
      session.socketId = socket.id;
      isSpectator = false;
    }

    socket.join(session.roomCode);
    currentRoom = session.roomCode;

    socket.emit('room-joined', { ...room.getState(), sessionToken });
    if (isSpectator) socket.emit('spectator-mode');
    io.to(session.roomCode).emit('room-state', room.getState());
  });

  socket.on('leave-room', () => {
    if (!currentRoom) return;
    // Clear session
    for (const [token, session] of Object.entries(playerSessions)) {
      if (session.roomCode === currentRoom && session.socketId === socket.id) {
        delete playerSessions[token];
        break;
      }
    }
    const room = rooms[currentRoom];
    if (room) {
      room.removePlayer(socket.id);
      socket.leave(currentRoom);
      io.to(currentRoom).emit('room-state', room.getState());
      cleanupRoom(currentRoom);
    }
    currentRoom = null;
    isSpectator = false;
  });

  socket.on('update-settings', (settings) => {
    if (!currentRoom) return;
    const room = rooms[currentRoom];
    if (!room) return;
    if (socket.id !== room.hostId) return;

    room.updateSettings(settings);
    io.to(currentRoom).emit('room-state', room.getState());
  });

  socket.on('start-game', () => {
    if (!currentRoom) return;
    const room = rooms[currentRoom];
    if (!room) return;
    if (socket.id !== room.hostId) return;

    const started = room.startGame();
    if (!started) {
      socket.emit('error', { message: '请至少选择一支队伍' });
      return;
    }

    room.game.startNextRound(io, currentRoom);
    io.to(currentRoom).emit('room-state', room.getState());
  });

  socket.on('submit-guess', ({ guessedPlayerId }) => {
    if (!currentRoom) return;
    if (isSpectator) return;
    const room = rooms[currentRoom];
    if (!room || !room.game) return;

    const result = room.game.submitGuess(io, currentRoom, socket.id, guessedPlayerId);
    if (!result) return;
    if (result === 'duplicate') return;

    io.to(currentRoom).emit('guess-result', result);
    io.to(currentRoom).emit('room-state', room.getState());
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
    if (!currentRoom) return;

    // Delay removal to allow reconnection
    disconnectTimers[socket.id] = setTimeout(() => {
      const room = rooms[currentRoom];
      if (room) {
        if (room.players[socket.id] || (room.spectators && room.spectators[socket.id])) {
          if (room.game) {
            room.game.markPlayerDisconnected(socket.id);
          }
          room.removePlayer(socket.id);
          io.to(currentRoom).emit('room-state', room.getState());
          cleanupRoom(currentRoom);
        }
      }
      delete disconnectTimers[socket.id];
    }, 30000);
  });
});

const proto = USE_HTTPS ? 'https' : 'http';
server.listen(PORT, () => {
  console.log(`Server running on ${proto}://localhost:${PORT}`);
  console.log(`IPv4: ${proto}://0.0.0.0:${PORT}`);
  console.log(`IPv6: ${proto}://[::]:${PORT}`);
});
