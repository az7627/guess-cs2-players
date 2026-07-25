const Round = require('./Round');
const { loadPlayersByTeams, loadTeams } = require('../dataLoader');

const GAME_STATES = {
  LOBBY: 'lobby',
  PLAYING: 'playing',
  GAME_OVER: 'game_over',
};

class Game {
  constructor(settings, players, spectators) {
    this.settings = settings;
    this.players = players;   // { socketId: { name, colorIndex } }
    this.spectators = spectators || {};
    this.state = GAME_STATES.LOBBY;
    this.scores = {};
    this.rounds = [];
    this.currentRound = null;
    this.eligiblePlayers = [];
    this.eligibleTeams = [];
    this.roundNumber = 0;
    this.usedPlayerIds = new Set();
    this.usedTeamIds = new Set();

    Object.keys(players).forEach(pid => {
      this.scores[pid] = 0;
    });

    this._loadEligiblePlayers();
    this._loadEligibleTeams();
  }

  _loadEligiblePlayers() {
    this.eligiblePlayers = loadPlayersByTeams(this.settings.teams);
  }

  _loadEligibleTeams() {
    const allTeams = loadTeams();
    this.eligibleTeams = allTeams.filter(t => this.settings.teams.includes(t.id));
  }

  getAvailableTargets() {
    return this.eligiblePlayers.filter(p => !this.usedPlayerIds.has(p.id));
  }

  startNextRound(io, roomCode) {
    if (this.state === GAME_STATES.GAME_OVER) return false;

    const mode = this.settings.mode || 'player';

    if (mode === 'team') {
      const available = this.eligibleTeams.filter(t => !this.usedTeamIds.has(t.id));
      if (available.length === 0) {
        this.usedTeamIds.clear();
        return this.startNextRound(io, roomCode);
      }

      const target = available[Math.floor(Math.random() * available.length)];
      this.usedTeamIds.add(target.id);
      this.roundNumber++;

      const round = new Round(target, this.players, 'team');
      round.setMaxGuesses(this.settings.maxGuesses);
      this.currentRound = round;
      this.state = GAME_STATES.PLAYING;

      round.start(io, roomCode, (result) => {
        this._onRoundComplete(io, roomCode, result);
      });
    } else {
      const available = this.getAvailableTargets();
      if (available.length === 0) {
        this.usedPlayerIds.clear();
        return this.startNextRound(io, roomCode);
      }

      const target = available[Math.floor(Math.random() * available.length)];
      this.usedPlayerIds.add(target.id);
      this.roundNumber++;

      const round = new Round(target, this.players);
      round.setMaxGuesses(this.settings.maxGuesses);
      this.currentRound = round;
      this.state = GAME_STATES.PLAYING;

      round.start(io, roomCode, (result) => {
        this._onRoundComplete(io, roomCode, result);
      });
    }

    io.to(roomCode).emit('game-state', this.getState());
    return true;
  }

  _onRoundComplete(io, roomCode, result) {
    this.rounds.push(result);

    Object.keys(result.scores).forEach(pid => {
      this.scores[pid] = (this.scores[pid] || 0) + (result.scores[pid] || 0);
    });

    const winner = this._checkWinner(roomCode);
    if (winner) {
      this.state = GAME_STATES.GAME_OVER;
      io.to(roomCode).emit('game-over', {
        finalScores: this.scores,
        winner,
        mode: this.settings.mode || 'player',
        rounds: this.rounds.map(r => ({
          target: r.targetPlayerName || r.targetTeamName || 'Unknown',
          team: r.targetTeam || r.targetTeamId || '',
          scores: r.scores,
        })),
      });
      io.to(roomCode).emit('game-state', this.getState());
    } else {
      this.state = GAME_STATES.LOBBY;
      io.to(roomCode).emit('game-state', this.getState());
      setTimeout(() => {
        this.startNextRound(io, roomCode);
      }, 5000);
    }
  }

  _checkWinner() {
    const target = this.settings.winRounds;
    for (const [pid, score] of Object.entries(this.scores)) {
      if (score >= target) {
        return pid;
      }
    }
    return null;
  }

  submitGuess(io, roomCode, playerId, guessedPlayerId) {
    if (!this.currentRound) return null;
    return this.currentRound.submitGuess(io, roomCode, playerId, guessedPlayerId);
  }

  markPlayerDisconnected(playerId) {
    if (this.currentRound) {
      this.currentRound.markPlayerDisconnected(playerId);
    }
  }

  getState() {
    return {
      state: this.state,
      scores: this.scores,
      roundNumber: this.roundNumber,
      winRounds: this.settings.winRounds,
      mode: this.settings.mode || 'player',
      roundActive: this.currentRound ? this.currentRound.isActive : false,
      remaining: this.currentRound ? this.currentRound.getRemaining() : 0,
      hints: this.currentRound
        ? {
            current: this.currentRound.currentHintIndex,
            total: Math.min(this.currentRound.hints.length, 10),
            list: this.currentRound.hints.slice(0, this.currentRound.currentHintIndex),
          }
        : null,
      guesses: this.currentRound ? this.currentRound.guesses : null,
    };
  }
}

module.exports = { Game, GAME_STATES };
