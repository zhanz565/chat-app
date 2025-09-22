import { io } from 'socket.io-client';


// point to your server
export const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:8080', {
autoConnect: false
});