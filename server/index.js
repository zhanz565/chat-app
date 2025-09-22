// server/index.js
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const PORT = process.env.PORT || 8080;

// allow comma-separated origins, e.g.
// CLIENT_ORIGIN=http://localhost:5173,https://your-app.vercel.app
const parseOrigins = (s) =>
  (s || '')
    .split(',')
    .map(v => v.trim())
    .filter(Boolean);

const ALLOWED_ORIGINS = parseOrigins(process.env.CLIENT_ORIGIN);
const FALLBACK_ORIGIN = 'http://localhost:5173';

const app = express();
app.use(cors({ origin: ALLOWED_ORIGINS.length ? ALLOWED_ORIGINS : FALLBACK_ORIGIN }));
app.get('/health', (_, res) => res.json({ ok: true }));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: ALLOWED_ORIGINS.length ? ALLOWED_ORIGINS : FALLBACK_ORIGIN, methods: ['GET','POST'] }
});

// in-memory presence (demo only)
const rooms = new Map(); // roomName -> { users: Map(socketId, user) }

function getRoomUsers(room) {
  const r = rooms.get(room);
  if (!r) return [];
  return Array.from(r.users.values()).map(({ id, name }) => ({ id, name }));
}

io.on('connection', (socket) => {
  console.log('socket connected', socket.id);

  socket.on('join', ({ name, room }) => {
    if (!name || !room) return;
    socket.join(room);

    if (!rooms.has(room)) rooms.set(room, { users: new Map() });
    const user = { id: socket.id, name, room, joinedAt: Date.now() };
    rooms.get(room).users.set(socket.id, user);

    socket.to(room).emit('system', { id: uuidv4(), type: 'join', text: `${name} joined`, at: Date.now() });
    io.to(room).emit('presence', getRoomUsers(room));
  });

  socket.on('message', ({ room, text }) => {
    if (!room || !text) return;
    const msg = { id: uuidv4(), text, from: socket.id, at: Date.now() };
    io.to(room).emit('message', msg);
  });

  socket.on('typing', ({ room, isTyping }) => {
    if (!room) return;
    socket.to(room).emit('typing', { userId: socket.id, isTyping: !!isTyping });
  });

  socket.on('disconnecting', () => {
    for (const room of socket.rooms) {
      if (room === socket.id) continue;
      const r = rooms.get(room);
      if (r) {
        r.users.delete(socket.id);
        io.to(room).emit('presence', getRoomUsers(room));
        socket.to(room).emit('system', { id: uuidv4(), type: 'leave', text: `A user left`, at: Date.now() });
        if (r.users.size === 0) rooms.delete(room);
      }
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`server listening on :${PORT}`);
});
