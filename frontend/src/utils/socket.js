import { io } from 'socket.io-client';

// ✅ Use VITE_API_URL for both REST API and Socket.IO
// This is the same base URL for both services
const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

console.log(`🔧 Socket.IO Configuration:`);
console.log(`   URL: ${SOCKET_URL}`);
console.log(`   Environment: ${import.meta.env.MODE}`);
console.log(`   Using VITE_API_URL: ${import.meta.env.VITE_API_URL || 'not set (using localhost)'}`);

let socket = null;
let socketStatus = 'disconnected'; // Track socket status

export const connectSocket = () => {
  if (socket) {
    console.log('ℹ️ Socket.IO already connected, reusing existing connection');
    return socket;
  }

  console.log(`🔗 Connecting to Socket.IO at ${SOCKET_URL}`);
  
  socket = io(SOCKET_URL, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    transports: ['websocket', 'polling'],
    withCredentials: true,  // ✅ IMPORTANT: Enable credentials for CORS
  });

  socket.on('connect', () => {
    socketStatus = 'connected';
    console.log('✅ Socket.IO connected successfully');
    console.log(`   Server: ${SOCKET_URL}`);
  });

  socket.on('disconnect', (reason) => {
    socketStatus = 'disconnected';
    console.log(`⚠️ Socket.IO disconnected: ${reason}`);
  });

  socket.on('connect_error', (error) => {
    socketStatus = 'error';
    console.error('❌ Socket.IO connection error:', error.message);
  });

  socket.on('error', (error) => {
    console.error('❌ Socket.IO error:', error);
  });

  return socket;
};

export const getSocket = () => socket;

export const getSocketStatus = () => socketStatus;

export const subscribeToRoute = (routeId) => {
  if (socket && socket.connected) {
    socket.emit('subscribe_route', routeId);
    console.log(`📍 Subscribed to route ${routeId}`);
  } else {
    console.warn(`⚠️ Cannot subscribe to route ${routeId}: socket not connected`);
  }
};

export const unsubscribeFromRoute = (routeId) => {
  if (socket && socket.connected) {
    socket.emit('unsubscribe_route', routeId);
    console.log(`📍 Unsubscribed from route ${routeId}`);
  } else {
    console.warn(`⚠️ Cannot unsubscribe from route ${routeId}: socket not connected`);
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    socketStatus = 'disconnected';
    console.log('🔌 Socket.IO disconnected');
  }
};
