# Chat App — Real-Time Messaging (React + Vite + Socket.IO + Express)

[![CI](https://github.com/zhanz565/chat-app/actions/workflows/ci.yml/badge.svg)](https://github.com/zhanz565/chat-app/actions/workflows/ci.yml)

A clean, interview-ready real-time chat application.  
Client: **Vite + React**. Server: **Express + Socket.IO**.

---

## ✨ Features
- Real-time messaging via WebSockets (Socket.IO)
- Simple role styling (`me` / `other` / `system`)
- Timestamps on messages
- Minimal, readable React component structure
- Environment-based configuration for local vs. prod

---

## 🧱 Tech Stack
- **Client:** React, Vite
- **Server:** Node.js, Express, Socket.IO
- **Tooling:** npm, (optional) Vitest, GitHub Actions

---

## 🗺️ Architecture
client (Vite/React) <——— HTTP (build assets) ——> server (Express)
    └────────────── WebSocket (Socket.IO) ──────────┘


## 🔧 Prerequisites
- **Node.js 20.x** (recommended)  
- **npm** (bundled with Node)

Check versions:
```bash
node -v
npm -v
