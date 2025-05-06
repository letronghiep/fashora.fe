import { io } from 'socket.io-client';
const url = import.meta.env.NODE_ENV === 'pro' ? undefined : import.meta.env.VITE_SOCKET_URL
export const socket = io(import.meta.env.VITE_SOCKET_URL, {
    transports: ['websocket', 'polling'],
    secure: true
});