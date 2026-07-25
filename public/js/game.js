// ===== GAME SCREEN =====

let searchPlayers = [];
let gameMode = 'player';        // 'player' or 'team'
let myGuessesLeft = 0;
let myMaxGuesses = 10;
let roundActive = false;
let currentPlayerGuesses = {};
let lastTimerValue = 0;
let searchHighlightIndex = -1;

// ===== SCREEN SWITCHING =====
socket.on('room-state', (state) => {
  currentRoomState = state;

  if (state.gameState && state.gameState.state === 'playing') {
    if (document.getElementById('game-screen').classList.contains('hidden')) {
      showScreen('game');
      loadSearchPlayers(state.code);
    }
    updateGameUI(state);
  } else if (state.gameState && state.gameState.state === 'game_over') {
    // handled by game-over event
  }
});

socket.on('game-state', (gameState) => {
  if (!currentRoomState) return;
  currentRoomState.gameState = gameState;

  if (gameState.state === 'playing') {
    if (document.getElementById('game-screen').classList.contains('hidden')) {
      showScreen('game');
      loadSearchPlayers(currentRoomState.code);
    }
  }
});

// ===== ROUND START =====
socket.on('round-start', (data) => {
  roundActive = true;
  myGuessesLeft = myMaxGuesses;
  currentPlayerGuesses = {};
  searchHighlightIndex = -1;

  document.getElementById('game-round-info').textContent = `Round ${currentRoomState?.gameState?.roundNumber || 1}`;
  document.getElementById('game-win-target').textContent = currentRoomState?.gameState?.winRounds || 7;
  document.getElementById('game-timer').textContent = formatTime(data.duration);
  document.getElementById('game-timer').classList.remove('urgent');
  document.getElementById('hints-list').innerHTML = '';
  document.getElementById('guesses-area').innerHTML = '';
  document.getElementById('correct-notification').classList.add('hidden');
  document.getElementById('round-end-overlay').classList.add('hidden');
  document.getElementById('game-over-overlay').classList.add('hidden');

  updateGuessCount();

  const searchInput = document.getElementById('search-input');
  searchInput.disabled = false;
  searchInput.value = '';
  document.getElementById('search-dropdown').classList.add('hidden');

  if (isSpectator) {
    document.getElementById('game-bottom').classList.add('hidden');
    document.getElementById('spectator-notice').classList.remove('hidden');
  }
});

// ===== TIMER UPDATE =====
socket.on('timer-update', (data) => {
  lastTimerValue = data.remaining;
  const timerEl = document.getElementById('game-timer');
  timerEl.textContent = formatTime(data.remaining);
  if (data.remaining <= 30) {
    timerEl.classList.add('urgent');
  } else {
    timerEl.classList.remove('urgent');
  }
});

// ===== NEW HINT =====
socket.on('new-hint', (hint) => {
  const hintsList = document.getElementById('hints-list');
  const hintEl = document.createElement('div');
  hintEl.className = 'hint-item new-hint';
  hintEl.textContent = hint.text;
  hintsList.appendChild(hintEl);

  setTimeout(() => {
    hintEl.classList.remove('new-hint');
  }, 600);
});

// ===== GUESS RESULT =====
socket.on('guess-result', (result) => {
  if (result.playerId === socket.id) {
    myGuessesLeft = Math.max(0, (myMaxGuesses - result.wrongGuesses.length));
    updateGuessCount();
  }
});

// ===== CORRECT GUESS =====
socket.on('correct-guess', (data) => {
  const notif = document.getElementById('correct-notification');
  const text = document.getElementById('correct-notification-text');
  const playerColor = getPlayerColorForId(data.playerId);
  text.innerHTML = `<span style="color:${playerColor};font-weight:700">${data.playerName}</span>`;
  notif.classList.remove('hidden');

  setTimeout(() => {
    notif.classList.add('hidden');
  }, 3000);
});

function getPlayerColorForId(playerId) {
  const players = currentRoomState?.players || [];
  const p = players.find(pl => pl.id === playerId);
  if (p && p.color) return p.color.hex;
  return '#fff';
}

// ===== ROUND END =====
socket.on('round-end', (data) => {
  roundActive = false;
  document.getElementById('search-input').disabled = true;
  document.getElementById('search-dropdown').classList.add('hidden');

  const overlay = document.getElementById('round-end-overlay');
  document.getElementById('round-end-title').textContent = '回合结束';
  if (data.isTeamMode) {
    document.getElementById('round-end-answer').innerHTML = `
      答案是: <strong>${data.targetTeamName}</strong>
    `;
  } else {
    document.getElementById('round-end-answer').innerHTML = `
      答案是: <strong>${data.targetPlayerName}</strong> (${data.targetPlayerFullName})
      <br><span style="color:var(--text-muted)">${data.targetTeam}</span>
    `;
  }
  document.getElementById('round-end-timer').textContent = '下一回合即将开始...';
  overlay.classList.remove('hidden');
});

// ===== GAME OVER =====
socket.on('game-over', (data) => {
  roundActive = false;
  document.getElementById('game-timer').textContent = '--:--';
  document.getElementById('search-input').disabled = true;
  document.getElementById('search-dropdown').classList.add('hidden');
  document.getElementById('round-end-overlay').classList.add('hidden');

  const overlay = document.getElementById('game-over-overlay');
  const winnerPlayer = currentRoomState?.players?.find(p => p.id === data.winner);
  document.getElementById('game-over-winner').textContent =
    `🎉 ${winnerPlayer ? winnerPlayer.name : 'Unknown'} 获胜！`;

  const scoresEl = document.getElementById('game-over-scores');
  scoresEl.innerHTML = Object.entries(data.finalScores)
    .sort((a, b) => b[1] - a[1])
    .map(([pid, score]) => {
      const p = currentRoomState?.players?.find(pl => pl.id === pid);
      const name = p ? p.name : 'Unknown';
      const color = p ? getColorHex(p.colorIndex) : '#fff';
      return `
        <div class="game-over-score-row">
          <span style="width:10px;height:10px;border-radius:50%;background:${color}"></span>
          <span>${name}</span>
          <span style="margin-left:auto;font-family:var(--font-mono)">${score} 分</span>
        </div>
      `;
    }).join('');

  overlay.classList.remove('hidden');
});

document.getElementById('back-to-lobby-btn').addEventListener('click', () => {
  document.getElementById('game-over-overlay').classList.add('hidden');
  document.getElementById('game-screen').classList.add('hidden');
  showScreen('lobby');
});

// ===== UPDATE GAME UI FROM STATE =====
function updateGameUI(state) {
  if (!state.gameState) return;

  myMaxGuesses = state.settings?.maxGuesses || 10;
  const gs = state.gameState;

  if (gs.mode) gameMode = gs.mode;
  roundActive = gs.roundActive || false;

  if (searchPlayers.length === 0 && currentRoomState) {
    loadSearchPlayers(currentRoomState.code);
  }

  document.getElementById('game-round-info').textContent = `Round ${gs.roundNumber || 1}`;
  document.getElementById('game-win-target').textContent = gs.winRounds || 7;

  const searchInput = document.getElementById('search-input');
  searchInput.disabled = !roundActive || isSpectator;

  if (gs.guesses && gs.guesses[socket.id]) {
    const myGs = gs.guesses[socket.id];
    myGuessesLeft = Math.max(0, myMaxGuesses - myGs.guesses.filter(g => !g.correct).length);
  }
  updateGuessCount();

  renderScores(gs.scores, state.players);

  if (gs.hints && gs.hints.list && gs.hints.list.length > 0) {
    const hintsList = document.getElementById('hints-list');
    const currentHintCount = hintsList.children.length;
    for (let i = currentHintCount; i < gs.hints.list.length; i++) {
      const hintEl = document.createElement('div');
      hintEl.className = 'hint-item';
      hintEl.textContent = gs.hints.list[i];
      hintsList.appendChild(hintEl);
    }
  }

  if (gs.guesses) {
    currentPlayerGuesses = gs.guesses;
    renderGuessesFromState();
  }

  if (gs.remaining > 0) {
    const timerEl = document.getElementById('game-timer');
    timerEl.textContent = formatTime(gs.remaining);
    if (gs.remaining <= 30) timerEl.classList.add('urgent');
  }
}

function renderScores(scores, players) {
  const container = document.getElementById('game-scores');
  if (!scores || !players) return;

  container.innerHTML = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(([pid, score]) => {
      const p = players.find(pl => pl.id === pid);
      if (!p) return '';
      return `
        <div class="score-badge" style="border: 1px solid ${p.color.hex}; opacity: 0.8">
          <span style="color: ${p.color.hex}">${p.name}</span>
          <span class="score-dot" style="background: ${p.color.hex}"></span>
          <span>${score}</span>
        </div>
      `;
    }).join('');
}

function renderGuessesFromState() {
  const container = document.getElementById('guesses-area');
  const players = currentRoomState?.players || [];

  container.innerHTML = players.map(p => {
    const gs = currentPlayerGuesses[p.id];
    if (!gs) return '';

    const color = p.color;
    const hasCorrect = gs.correct;

    const tags = gs.guesses.map(g => {
      const playerMatch = searchPlayers.find(sp => sp.id === g.id);
      const display = playerMatch ? playerMatch.nickname : g.id;
      const tagClass = g.correct ? 'guess-tag blurred-tag' : 'guess-tag';
      return `<span class="${tagClass}">${display}</span>`;
    }).join('');

    return `
      <div class="guess-player-row">
        <div class="guess-player-header">
          <span class="guess-player-dot" style="background: ${color.hex}"></span>
          <span class="guess-player-name" style="color: ${color.hex}">${p.name}</span>
          ${hasCorrect ? '<span style="color:var(--success);font-size:12px;margin-left:auto">✅ 已猜中</span>' : ''}
        </div>
        ${tags ? `<div class="guess-tags">${tags}</div>` : ''}
      </div>
    `;
  }).join('');
}

function updateGuessCount() {
  document.getElementById('guess-count').textContent = `剩余: ${myGuessesLeft}/${myMaxGuesses}`;
}

// ===== SEARCH =====
async function loadSearchPlayers(roomCode) {
  try {
    if (gameMode === 'team') {
      const res = await fetch('/api/teams');
      const teams = await res.json();
      searchPlayers = teams.filter(t => {
        if (!currentRoomState) return true;
        return currentRoomState.settings?.teams?.includes(t.id);
      }).map(t => ({
        id: t.id,
        nickname: t.name,
        fullName: t.name,
        teamName: t.name,
        country: t.country,
      }));
    } else {
      const res = await fetch(`/api/player-search?roomCode=${roomCode}`);
      searchPlayers = await res.json();
    }
  } catch (e) {
    searchPlayers = [];
  }
}

const searchInput = document.getElementById('search-input');
const searchDropdown = document.getElementById('search-dropdown');

function doSearch() {
  const query = searchInput.value.trim().toLowerCase();
  if (!query || !roundActive || isSpectator) {
    searchDropdown.classList.add('hidden');
    searchHighlightIndex = -1;
    return;
  }

  const myGuessedIds = new Set();
  if (currentPlayerGuesses && currentPlayerGuesses[socket.id]) {
    currentPlayerGuesses[socket.id].guesses.forEach(g => myGuessedIds.add(g.id));
  }

  const results = searchPlayers
    .filter(p =>
      !myGuessedIds.has(p.id) &&
      (p.nickname.toLowerCase().includes(query) ||
       (p.fullName && p.fullName.toLowerCase().includes(query)) ||
       (p.teamName && p.teamName.toLowerCase().includes(query)))
    )
    .slice(0, 10);

  if (results.length === 0) {
    searchDropdown.classList.add('hidden');
    searchHighlightIndex = -1;
    return;
  }

  const isTeamMode = gameMode === 'team';
  searchDropdown.innerHTML = results.map((p, i) => `
    <div class="search-result-item ${i === searchHighlightIndex ? 'highlighted' : ''}" data-player-id="${p.id}" data-index="${i}">
      <span>${p.nickname}${!isTeamMode && p.fullName ? ` <span style="color:var(--text-muted);font-size:12px">${p.fullName}</span>` : ''}</span>
      ${!isTeamMode ? `<span class="player-team">${p.teamName||''}</span>` : ''}
    </div>
  `).join('');
  searchDropdown.classList.remove('hidden');
}

searchInput.addEventListener('input', () => {
  searchHighlightIndex = -1;
  doSearch();
});

searchInput.addEventListener('focus', () => {
  if (searchInput.value.trim() && roundActive && !isSpectator) {
    doSearch();
  }
});

searchInput.addEventListener('keydown', (e) => {
  const items = searchDropdown.querySelectorAll('.search-result-item');

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (items.length === 0) return;
    searchHighlightIndex = Math.min(searchHighlightIndex + 1, items.length - 1);
    if (searchDropdown.classList.contains('hidden')) searchDropdown.classList.remove('hidden');
    updateHighlight(items);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (items.length === 0) return;
    searchHighlightIndex = Math.max(searchHighlightIndex - 1, 0);
    if (searchDropdown.classList.contains('hidden')) searchDropdown.classList.remove('hidden');
    updateHighlight(items);
  } else if (e.key === 'Enter') {
    e.preventDefault();
    const highlighted = searchDropdown.querySelector('.search-result-item.highlighted');
    if (highlighted) {
      selectPlayer(highlighted.dataset.playerId);
    } else if (items.length > 0) {
      selectPlayer(items[0].dataset.playerId);
    }
  } else if (e.key === 'Tab') {
    const highlighted = searchDropdown.querySelector('.search-result-item.highlighted');
    if (highlighted) {
      e.preventDefault();
      selectPlayer(highlighted.dataset.playerId);
    }
  }
});

function updateHighlight(items) {
  items.forEach((item, i) => {
    if (i === searchHighlightIndex) {
      item.classList.add('highlighted');
      item.scrollIntoView({ block: 'nearest' });
    } else {
      item.classList.remove('highlighted');
    }
  });
}

function selectPlayer(playerId) {
  if (playerId && roundActive && !isSpectator) {
    socket.emit('submit-guess', { guessedPlayerId: playerId });
    searchInput.value = '';
    searchDropdown.classList.add('hidden');
    searchHighlightIndex = -1;
  }
}

document.addEventListener('click', (e) => {
  if (!searchDropdown.contains(e.target) && e.target !== searchInput) {
    searchDropdown.classList.add('hidden');
    searchHighlightIndex = -1;
  }
});

searchDropdown.addEventListener('click', (e) => {
  const item = e.target.closest('.search-result-item');
  if (!item) return;
  selectPlayer(item.dataset.playerId);
});
