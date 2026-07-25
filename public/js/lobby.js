// ===== LOBBY SCREEN =====

let isHost = false;
let currentRoomState = null;
let isSpectator = false;
let allTeams = [];

// Try reconnection on connect if we had a prior session
socket.on('connect', () => {
  if (sessionToken && !currentRoomState) {
    socket.emit('reconnect-player', { sessionToken });
  }
});

function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  const screen = document.getElementById(name + '-screen');
  if (screen) screen.classList.remove('hidden');
}

function showError(el, msg) {
  el.textContent = msg;
  el.style.display = msg ? 'block' : 'none';
}

// ===== LOGIN =====
document.getElementById('create-room-btn').addEventListener('click', () => {
  const name = document.getElementById('name-input').value.trim();
  if (!name) {
    showError(document.getElementById('login-error'), '请输入昵称');
    return;
  }
  socket.emit('create-room', { playerName: name, sessionToken: getSessionToken() });
});

document.getElementById('join-room-btn').addEventListener('click', () => {
  const name = document.getElementById('name-input').value.trim();
  const code = document.getElementById('room-code-input').value.trim();
  if (!name) {
    showError(document.getElementById('login-error'), '请输入昵称');
    return;
  }
  if (!code) {
    showError(document.getElementById('login-error'), '请输入房间号');
    return;
  }
  socket.emit('join-room', { roomCode: code, playerName: name, sessionToken: getSessionToken() });
});

document.getElementById('spectate-btn').addEventListener('click', () => {
  const name = document.getElementById('name-input').value.trim();
  const code = document.getElementById('spectate-code-input').value.trim();
  if (!name) {
    showError(document.getElementById('login-error'), '请输入昵称');
    return;
  }
  if (!code) {
    showError(document.getElementById('login-error'), '请输入房间号');
    return;
  }
  socket.emit('spectate-room', { roomCode: code, playerName: name, sessionToken: getSessionToken() });
});

// ===== ROOM JOINED =====
socket.on('room-joined', (state) => {
  currentRoomState = state;
  isHost = state.hostId === socket.id;

  if (state.gameState && state.gameState.state === 'playing') {
    showScreen('game');
  } else {
    showScreen('lobby');
    updateLobbyUI(state);
    syncTeamCheckboxes(state.settings.teams || []);
  }
});

socket.on('spectator-mode', () => {
  isSpectator = true;
});

socket.on('error', (data) => {
  showError(document.getElementById('login-error'), data.message);
  showError(document.getElementById('lobby-error'), data.message);
});

// ===== LOBBY UPDATE =====
socket.on('room-state', (state) => {
  currentRoomState = state;
  isHost = state.hostId === socket.id;

  if (state.gameState && state.gameState.state === 'playing') return;

  if (document.getElementById('lobby-screen').classList.contains('hidden')) return;

  updateLobbyUI(state);
  syncTeamCheckboxes(state.settings.teams || []);
});

function updateLobbyUI(state) {
  document.getElementById('lobby-room-code').textContent = state.code;

  // Players
  const playerList = document.getElementById('player-list');
  playerList.innerHTML = state.players.map(p => `
    <div class="player-item">
      <span class="player-dot" style="background: ${p.color.hex}"></span>
      <span style="${getColorStyle(p.colorIndex)}">${p.name}</span>
      ${p.isHost ? '<span class="host-badge">房主</span>' : ''}
    </div>
  `).join('');

  // Spectators
  const specList = document.getElementById('spectator-list');
  if (state.spectators && state.spectators.length > 0) {
    specList.innerHTML = state.spectators.map(s =>
      `<div class="spectator-item">${s.name}</div>`
    ).join('');
  } else {
    specList.innerHTML = '';
  }

  // Settings
  updateSettingsUI(state.settings);

  // Host: enable start button, enable settings
  refreshHostControls();
}

function refreshHostControls() {
  const btn = document.getElementById('start-game-btn');
  const settings = document.getElementById('lobby-settings');
  if (isHost) {
    btn.removeAttribute('disabled');
    settings.style.opacity = '1';
    settings.style.pointerEvents = 'auto';
  } else {
    btn.setAttribute('disabled', '');
    settings.style.opacity = '0.5';
    settings.style.pointerEvents = 'none';
  }
}

function updateSettingsUI(settings) {
  const winRoundsInput = document.getElementById('win-rounds-input');
  const maxGuessesInput = document.getElementById('max-guesses-input');
  const modeSelect = document.getElementById('mode-select');

  if (document.activeElement !== winRoundsInput) {
    winRoundsInput.value = settings.winRounds;
  }
  if (document.activeElement !== maxGuessesInput) {
    maxGuessesInput.value = settings.maxGuesses;
  }
  if (settings.mode && modeSelect.value !== settings.mode) {
    modeSelect.value = settings.mode;
  }
}

function syncTeamCheckboxes(teamIds) {
  if (!allTeams.length) return;
  const checkboxes = document.querySelectorAll('#team-checkboxes .team-checkbox');
  checkboxes.forEach(label => {
    const cb = label.querySelector('input');
    const teamId = cb.value;
    if (teamIds.includes(teamId)) {
      cb.checked = true;
      label.classList.add('selected');
    } else {
      cb.checked = false;
      label.classList.remove('selected');
    }
  });
}

// ===== LOBBY SETTINGS =====
document.getElementById('leave-lobby-btn').addEventListener('click', () => {
  socket.emit('leave-room');
  showScreen('login');
  isHost = false;
  currentRoomState = null;
});

document.getElementById('win-rounds-input').addEventListener('input', function () {
  const val = parseInt(this.value);
  if (isNaN(val) || val < 1) { this.value = 1; }
  else if (val > 99) { this.value = 99; }
  socket.emit('update-settings', { winRounds: Number(this.value) });
});

document.getElementById('max-guesses-input').addEventListener('input', function () {
  const val = parseInt(this.value);
  if (isNaN(val) || val < 1) { this.value = 1; }
  else if (val > 99) { this.value = 99; }
  socket.emit('update-settings', { maxGuesses: Number(this.value) });
});

document.getElementById('mode-select').addEventListener('change', function () {
  socket.emit('update-settings', { mode: this.value });
});

document.getElementById('start-game-btn').addEventListener('click', () => {
  if (!isHost) return;
  socket.emit('start-game');
});

// ===== LOAD TEAMS =====
fetch('/api/teams')
  .then(r => r.json())
  .then(teams => {
    allTeams = teams;
    renderTeamCheckboxes(teams);
  })
  .catch(() => {});

function renderTeamCheckboxes(teams) {
  const container = document.getElementById('team-checkboxes');
  container.innerHTML = teams.map(t => `
    <label class="team-checkbox" data-team-id="${t.id}">
      <input type="checkbox" value="${t.id}">
      ${t.name}
    </label>
  `).join('');

  container.addEventListener('click', (e) => {
    if (!isHost) return;
    const label = e.target.closest('.team-checkbox');
    if (!label) return;
    const checkbox = label.querySelector('input');
    checkbox.checked = !checkbox.checked;
    if (checkbox.checked) {
      label.classList.add('selected');
    } else {
      label.classList.remove('selected');
    }
    emitTeamSelection();
  });
}

document.getElementById('select-all-teams').addEventListener('click', () => {
  if (!isHost) return;
  const checkboxes = document.querySelectorAll('#team-checkboxes .team-checkbox');
  checkboxes.forEach(label => {
    label.classList.add('selected');
    label.querySelector('input').checked = true;
  });
  emitTeamSelection();
});

document.getElementById('deselect-all-teams').addEventListener('click', () => {
  if (!isHost) return;
  const checkboxes = document.querySelectorAll('#team-checkboxes .team-checkbox');
  checkboxes.forEach(label => {
    label.classList.remove('selected');
    label.querySelector('input').checked = false;
  });
  emitTeamSelection();
});

function emitTeamSelection() {
  const selected = [];
  document.querySelectorAll('#team-checkboxes input:checked').forEach(input => {
    selected.push(input.value);
  });
  socket.emit('update-settings', { teams: selected });
}
