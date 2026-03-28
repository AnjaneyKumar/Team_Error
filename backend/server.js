import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import routeRoutes from './routes/routeRoutes.js';
import stopRoutes from './routes/stopRoutes.js';
import busRoutes from './routes/busRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import { startBusSimulation } from './utils/busSimulation.js';

// Load environment variables
dotenv.config();

// Initialize Express App
const app = express();
const server = createServer(app);

// Socket.IO Configuration
const io = new SocketServer(server, {
  cors: {
    origin: "*",
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({
  origin: "*"
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get('/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

// API Routes
app.use('/api/routes', routeRoutes);
app.use('/api/stops', stopRoutes);
app.use('/api/buses', busRoutes(io));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error Handling Middleware
app.use(errorHandler);

// Socket.IO Connection Handler
io.on('connection', (socket) => {
  console.log('New WebSocket connection:', socket.id);

  socket.on('disconnect', () => {
    console.log('WebSocket disconnected:', socket.id);
  });

  socket.on('subscribe_route', (routeId) => {
    socket.join(`route_${routeId}`);
    console.log(`Client subscribed to route ${routeId}`);
  });

  socket.on('unsubscribe_route', (routeId) => {
    socket.leave(`route_${routeId}`);
    console.log(`Client unsubscribed from route ${routeId}`);
  });
});

// Startup sequence: DB first, then server, then simulation
const startApp = async () => {
  try {
    // Step 1: Connect to Database
    await connectDB();
    console.log('✓ Database connected');

    // Step 2: Start Server
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV}`);
    });

    // Step 3: Start Bus Simulation (AFTER DB and server)
    startBusSimulation(io);
    console.log('✓ Bus simulation started');

  } catch (error) {
    console.error('✗ Startup error:', error.message);
    process.exit(1);
  }
};

// Start the application
startApp();

export { io };
