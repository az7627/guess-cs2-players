const Timer = require('./Timer');
const { getPlayerHints, getTeamHints } = require('../dataLoader');

const ROUND_DURATION = 120;
const HINT_INTERVAL = 12;
const TIME_PENALTY = 12;
const MAX_HINTS = 10;

class Round {
  constructor(target, players, mode = 'player') {
    this.mode = mode;
    if (mode === 'team') {
      this.targetTeam = target;
      this.hints = getTeamHints(target.id);
    } else {
      this.targetPlayer = target;
      this.hints = getPlayerHints(target);
    }
    this.currentHintIndex = 0;
    this.guesses = {};
    this.scores = {};
    this.isActive = false;
    this.timerInstance = null;
    this.hintInterval = null;
    this.players = players;
    this.correctGuessCount = 0;
    this.maxGuesses = 10;
    this.onRoundEnd = null;

    Object.keys(players).forEach(pid => {
      this.guesses[pid] = { guesses: [], correct: false };
      this.scores[pid] = 0;
    });
  }

  setMaxGuesses(n) {
    this.maxGuesses = n;
  }

  markPlayerDisconnected(playerId) {
    if (this.guesses[playerId]) {
      this.guesses[playerId].disconnected = true;
    }
  }

  start(io, roomCode, onEndCallback) {
    this.isActive = true;
    this.onRoundEnd = onEndCallback;

    io.to(roomCode).emit('round-start', {
      hintsRevealed: this.currentHintIndex,
      totalHints: Math.min(this.hints.length, MAX_HINTS),
      duration: ROUND_DURATION,
      mode: this.mode,
    });

    this.timerInstance = new Timer(
      ROUND_DURATION,
      (remaining) => {
        io.to(roomCode).emit('timer-update', { remaining });
      },
      () => {
        this._finish(io, roomCode);
      }
    );
    this.timerInstance.start();

    this._revealHint(io, roomCode);

    this.hintInterval = setInterval(() => {
      this._revealHint(io, roomCode);
    }, HINT_INTERVAL * 1000);
  }

  _revealHint(io, roomCode) {
    if (!this.isActive) return;
    if (this.currentHintIndex >= this.hints.length || this.currentHintIndex >= MAX_HINTS) return;

    io.to(roomCode).emit('new-hint', {
      index: this.currentHintIndex,
      text: this.hints[this.currentHintIndex],
      total: Math.min(this.hints.length, MAX_HINTS),
    });
    this.currentHintIndex++;
  }

  submitGuess(io, roomCode, playerId, guessedId) {
    if (!this.isActive) return null;

    const gs = this.guesses[playerId];
    if (!gs || gs.correct) return null;
    if (gs.guesses.length >= this.maxGuesses) return null;
    if (gs.guesses.some(g => g.id === guessedId)) return 'duplicate';

    const isCorrect = this.mode === 'team'
      ? guessedId === this.targetTeam.id
      : guessedId === this.targetPlayer.id;

    if (isCorrect) {
      gs.correct = true;
      gs.guesses.push({ id: guessedId, correct: true });
      this.scores[playerId] = 1;
      this.correctGuessCount++;

      this.timerInstance.reduce(TIME_PENALTY);

      const playerName = this.players[playerId] ? this.players[playerId].name : 'Unknown';
      io.to(roomCode).emit('correct-guess', { playerId, playerName });

      const allGotCorrect = Object.values(this.guesses).every(g => g.correct || g.disconnected);
      if (allGotCorrect) {
        clearInterval(this.hintInterval);
        setTimeout(() => {
          this._finish(io, roomCode);
        }, 1500);
      }
    } else {
      gs.guesses.push({ id: guessedId, correct: false });
    }

    return {
      playerId,
      guessedPlayerId: guessedId,
      correct: isCorrect,
      wrongGuesses: gs.guesses.filter(g => !g.correct).map(g => g.id),
      correctGuess: gs.correct,
    };
  }

  _finish(io, roomCode) {
    if (!this.isActive) return;
    this.isActive = false;

    if (this.timerInstance) this.timerInstance.stop();
    if (this.hintInterval) clearInterval(this.hintInterval);

    const result = this.mode === 'team' ? {
      targetTeamId: this.targetTeam.id,
      targetTeamName: this.targetTeam.name,
      isTeamMode: true,
      scores: this.scores,
      guesses: this.guesses,
      hintsUsed: this.currentHintIndex,
    } : {
      targetPlayerId: this.targetPlayer.id,
      targetPlayerName: this.targetPlayer.nickname,
      targetPlayerFullName: this.targetPlayer.fullName,
      targetTeam: this.targetPlayer.teamName || this.targetPlayer.team,
      scores: this.scores,
      guesses: this.guesses,
      hintsUsed: this.currentHintIndex,
    };

    io.to(roomCode).emit('round-end', result);

    if (this.onRoundEnd) {
      setTimeout(() => this.onRoundEnd(result), 2000);
    }
  }

  getRemaining() {
    return this.timerInstance ? this.timerInstance.remaining : 0;
  }
}

module.exports = Round;
