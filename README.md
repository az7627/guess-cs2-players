# CS2 Guess the Pro Player

简体中文（中国大陆） / [English (US)](README_en_US.md)

一个实时多人 CS2 职业选手/战队竞猜游戏。玩家根据逐条揭示的提示猜测选手或战队身份，比拼谁能最快猜出答案。以 **IEM Cologne Major 2026** 为主题。

## 游戏流程

- **登录界面**: 输入昵称，选择创建房间、加入房间（6 位房间码）或观战
- **大厅界面**: 房主选择题库队伍、设置获胜轮数和每轮最大猜测次数、选择「猜选手」或「猜战队」模式。最多 10 名玩家 + 无限观战
- **游戏界面**: 每轮 120 秒，每 12 秒揭示一条新提示（最多 10 条）。玩家在搜索框中输入选手名进行猜测。猜中后倒计时减少 12 秒。先达到 `winRounds` 阈值者获胜

## 特性

- Socket.IO 实时多人对战
- 6 位字母数字房间码
- Session Token 断线重连（30 秒容忍）
- 观战模式
- 两种游戏模式：猜选手 / 猜战队
- 加权提示系统（提示有难度分级，影响揭示顺序）
- 32 支队伍、~160 名选手数据库

## 环境要求

- Node.js 18+
- npm

## 快速开始

```bash
npm install
npm start
```

服务器默认在端口 3000 上启动 HTTP。可通过 `config.json` 配置端口和 HTTPS。

## 配置文件

复制 `config.example.json` 为 `config.json`：

```json
{
  "port": 3000,
  "https": false
}
```

启用 HTTPS：

```json
{
  "port": 443,
  "https": true,
  "sslKeyPath": "/path/to/key.pem",
  "sslCertPath": "/path/to/cert.pem"
}
```

## 文件结构

```
guess-cs2-players/
├── server/
│   ├── index.js             # Express + Socket.IO 服务器入口
│   ├── dataLoader.js        # 队伍/选手数据加载
│   ├── colors.js            # 玩家颜色调色板
│   └── game/
│       ├── Game.js          # 游戏状态机
│       ├── Room.js          # 房间管理
│       ├── Round.js         # 单轮逻辑
│       └── Timer.js         # 倒计时器
├── public/
│   ├── index.html           # SPA（登录/大厅/游戏）
│   ├── css/style.css        # 深色主题
│   └── js/
│       ├── socket.js        # Socket.IO 客户端
│       ├── lobby.js         # 大厅逻辑
│       └── game.js          # 游戏逻辑
├── data/
│   ├── teams.json           # 32 支战队
│   └── players/             # 每队选手名单
├── config.example.json      # 配置模板
└── package.json
```

## 许可

MIT License
