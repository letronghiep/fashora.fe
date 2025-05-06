import { io } from 'socket.io-client';
const url = import.meta.env.NODE_ENV === 'pro' ? undefined : import.meta.env.VITE_SOCKET_URL
export const socket = io(url, { autoConnect: false });