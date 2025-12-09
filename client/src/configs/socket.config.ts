// src/config/socket.config.ts
let socketBaseUrl: string;

if (process.env.NODE_ENV === 'production') {
  // in production (Vercel), use the deployed backend
  socketBaseUrl =
    process.env.NEXT_PUBLIC_SOCKET_URL || 'wss://rvtm-aims-server.onrender.com';
} else {
  // in local dev, connect directly to your local NestJS WS server
  socketBaseUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'ws://localhost:3005';
}

export const SOCKET_BASE_URL = socketBaseUrl;
