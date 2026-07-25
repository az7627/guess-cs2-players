const socket = io({
  reconnection: true,
  reconnectionAttempts: 20,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});

const PLAYER_COLORS = [
  { name: 'red', hex: '#E74C3C', bg: '#E74C3C', text: '#fff' },
  { name: 'blue', hex: '#3498DB', bg: '#3498DB', text: '#fff' },
  { name: 'green', hex: '#27AE60', bg: '#27AE60', text: '#fff' },
  { name: 'orange', hex: '#F39C12', bg: '#F39C12', text: '#fff' },
  { name: 'purple', hex: '#8E44AD', bg: '#8E44AD', text: '#fff' },
  { name: 'teal', hex: '#1ABC9C', bg: '#1ABC9C', text: '#fff' },
  { name: 'pink', hex: '#E91E63', bg: '#E91E63', text: '#fff' },
  { name: 'cyan', hex: '#00BCD4', bg: '#00BCD4', text: '#111' },
  { name: 'amber', hex: '#FF9800', bg: '#FF9800', text: '#111' },
  { name: 'indigo', hex: '#3F51B5', bg: '#3F51B5', text: '#fff' },
];

function getColorStyle(index) {
  const c = PLAYER_COLORS[index] || PLAYER_COLORS[0];
  return `color: ${c.hex}`;
}

function getColorBg(index) {
  const c = PLAYER_COLORS[index] || PLAYER_COLORS[0];
  return `background: ${c.bg}; color: ${c.text}`;
}

function getColorHex(index) {
  return (PLAYER_COLORS[index] || PLAYER_COLORS[0]).hex;
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

let sessionToken = localStorage.getItem('cs2game_session');
if (!sessionToken) {
  sessionToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
  localStorage.setItem('cs2game_session', sessionToken);
}

function getSessionToken() {
  return sessionToken;
}
