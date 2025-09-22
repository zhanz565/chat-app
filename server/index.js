// server/index.js
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const PORT = process.env.PORT || 8080;

/* -------- CORS: allow localhost and any *.vercel.app -------- */
const allowedHosts = ['http://localhost:5173'];
const corsOrigin = (origin, cb) => {
  if (!origin) return cb(null, true);                              // health checks/curl
  const isLocal = allowedHosts.includes(origin);
  const isVercel = /^https:\/\/.*\.vercel\.app$/.test(origin);     // any vercel preview/prod
  return (isLocal || isVercel) ? cb(null, true)
                               : cb(new Error(`CORS blocked origin: ${origin}`));
};

/* ------------------------- Express -------------------------- */
const app = express();
app.use(cors({ origin: corsOrigin, credentials: true }));
app.get('/health', (_, res) => res.json({ ok: true }));
app.get('/',   (_, res) => res.send('Chat server running. See /health.'));

/* ------------------------ Socket.IO ------------------------- */
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: corsOrigin, credentials: true, methods: ['GET','POST'] }
});

/* ------------------- Demo in-memory presence ---------------- */
const rooms = new Map(); // roomName -> { users: Map(socketId, user) }
const getRoomUsers = (room) =>
  Array.from((rooms.get(room)?.users || new Map()).values())
       .map(({ id, name }) => ({ id, name }));

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
      if (!r) continue;
      r.users.delete(socket.id);
      io.to(room).emit('presence', getRoomUsers(room));
      socket.to(room).emit('system', { id: uuidv4(), type: 'leave', text: `A user left`, at: Date.now() });
      if (r.users.size === 0) rooms.delete(room);
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`server listening on :${PORT}`);
});
