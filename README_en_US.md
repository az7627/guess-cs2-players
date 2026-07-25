# CS2 Guess the Pro Player

[简体中文（中国大陆）](README.md) / English (US)

A real-time multiplayer CS2 pro player/team guessing game. Players guess professional CS2 players or teams based on progressively revealed hints, competing to be the fastest. Themed around **IEM Cologne Major 2026**.

## Gameplay

- **Login**: Enter a nickname, then Create a Room, Join a Room (6-character code), or Spectate
- **Lobby**: The host selects which teams' rosters to draw from, sets the number of winning rounds and max guesses per round, and chooses between "Guess Player" or "Guess Team" mode. Up to 10 players + unlimited spectators
- **Game**: Rounds last 120 seconds. Every 12 seconds, a new hint is revealed (max 10). Players type guesses in a search box with autocomplete. Correct guesses reduce the timer by 12 seconds. First to reach the `winRounds` threshold wins

## Features

- Real-time multiplayer via Socket.IO
- 6-character alphanumeric room codes
- Session token reconnection (30-second tolerance)
- Spectator mode
- Two game modes: Guess Player / Guess Team
- Weighted hint system (difficulty levels affect reveal order)
- 32 teams, ~160 players database

## Prerequisites

- Node.js 18+
- npm

## Quick Start

```bash
npm install
npm start
```

The server starts on port 3000 (HTTP) by default. Configure port and HTTPS via `config.json`.

## Configuration

Copy `config.example.json` to `config.json`:

```json
{
  "port": 3000,
  "https": false
}
```

For HTTPS:

```json
{
  "port": 443,
  "https": true,
  "sslKeyPath": "/path/to/key.pem",
  "sslCertPath": "/path/to/cert.pem"
}
```

## File Structure

```
guess-cs2-players/
├── server/
│   ├── index.js             # Express + Socket.IO entry point
│   ├── dataLoader.js        # Team/player data loading
│   ├── colors.js            # Player color palette
│   └── game/
│       ├── Game.js          # Game state machine
│       ├── Room.js          # Room management
│       ├── Round.js         # Single round logic
│       └── Timer.js         # Countdown timer
├── public/
│   ├── index.html           # SPA (login/lobby/game)
│   ├── css/style.css        # Dark theme
│   └── js/
│       ├── socket.js        # Socket.IO client
│       ├── lobby.js         # Lobby screen logic
│       └── game.js          # Game screen logic
├── data/
│   ├── teams.json           # 32 teams
│   └── players/             # Per-team rosters
├── config.example.json      # Configuration template
└── package.json
```

## License

MIT License
