const { Game, GAME_STATES } = require('./Game');
const { PLAYER_COLORS } = require('../colors');

class Room {
  constructor(code, hostId, hostName) {
    this.code = code;
    this.hostId = hostId;
    this.players = {};
    this.spectators = {};
    this.usedColors = new Set();
    this.game = null;
    this.settings = {
      teams: [],
      winRounds: 7,
      maxGuesses: 10,
      mode: 'player',
    };

    this._addPlayer(hostId, hostName);
  }

  _generateColorIndex() {
    for (let i = 0; i < PLAYER_COLORS.length; i++) {
      if (!this.usedColors.has(i)) {
        this.usedColors.add(i);
        return i;
      }
    }
    return -1;
  }

  _addPlayer(socketId, name, isSpectator = false) {
    const colorIndex = this._generateColorIndex();
    const player = { id: socketId, name, colorIndex };
    if (isSpectator) {
      this.spectators[socketId] = player;
    } else {
      this.players[socketId] = player;
    }
    return player;
  }

  addPlayer(socketId, name) {
    if (Object.keys(this.players).length >= 10) return null;
    return this._addPlayer(socketId, name);
  }

  addSpectator(socketId, name) {
    return this._addPlayer(socketId, name, true);
  }

  removePlayer(socketId) {
    if (this.players[socketId]) {
      this.usedColors.delete(this.players[socketId].colorIndex);
      delete this.players[socketId];
      if (this.game && this.game.scores) {
        delete this.game.scores[socketId];
      }
      if (socketId === this.hostId) {
        const remaining = Object.keys(this.players);
        this.hostId = remaining.length > 0 ? remaining[0] : null;
      }
      return 'player';
    }
    if (this.spectators[socketId]) {
      delete this.spectators[socketId];
      return 'spectator';
    }
    return null;
  }

  updateSettings(settings) {
    if (settings.winRounds !== undefined) {
      this.settings.winRounds = Math.max(1, Math.min(99, Number(settings.winRounds) || 7));
    }
    if (settings.maxGuesses !== undefined) {
      this.settings.maxGuesses = Math.max(1, Math.min(99, Number(settings.maxGuesses) || 10));
    }
    if (settings.teams !== undefined) {
      this.settings.teams = settings.teams;
    }
    if (settings.mode !== undefined) {
      this.settings.mode = settings.mode;
    }
  }

  startGame() {
    if (Object.keys(this.players).length < 1) return false;
    if (!this.settings.teams || this.settings.teams.length === 0) return false;

    this.game = new Game(this.settings, this.players, this.spectators);
    return true;
  }

  getState() {
    const playerList = Object.entries(this.players).map(([id, p]) => ({
      id,
      name: p.name,
      colorIndex: p.colorIndex,
      color: PLAYER_COLORS[p.colorIndex] || PLAYER_COLORS[0],
      isHost: id === this.hostId,
    }));

    const spectatorList = Object.entries(this.spectators).map(([id, s]) => ({
      id,
      name: s.name,
    }));

    return {
      code: this.code,
      hostId: this.hostId,
      players: playerList,
      spectators: spectatorList,
      settings: this.settings,
      gameState: this.game ? this.game.getState() : null,
      hasGame: !!this.game,
    };
  }

  isEmpty() {
    return Object.keys(this.players).length === 0;
  }
}

module.exports = Room;
