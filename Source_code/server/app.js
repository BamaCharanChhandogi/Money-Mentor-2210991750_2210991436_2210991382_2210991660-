import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dbConnection from './dbConfig/index.js';
import routes from './routes/index.js';
import { socketMiddleware } from './middleware/socketMiddleware.js';
import jwt from 'jsonwebtoken'; // Make sure to install jsonwebtoken

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [
      process.env.CLIENT_URL,
      'http://localhost:5173',
      'https://money-mentor-wheat.vercel.app'
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

const port = process.env.PORT;

dbConnection();
app.use(express.json());
app.use(cors({
  origin: [
    process.env.CLIENT_URL, 
    'http://localhost:5173',  // Keep local development option
    'https://money-mentor-wheat.vercel.app'
  ],
  credentials: true
}));

// Enhanced Socket.IO connection handling with authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    console.error('No authentication token');
    return next(new Error('Authentication error'));
  }

  try {
    // Verify the token (replace with your actual JWT secret)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (error) {
    console.error('Socket Authentication Error:', error);
    return next(new Error('Authentication error'));
  }
});

// Apply socket middleware BEFORE routes
app.use(socketMiddleware(io));

// Detailed Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New socket connection:', {
    id: socket.id,
    userId: socket.user.userId
  });

  // Log all incoming events
  socket.onAny((eventName, ...args) => {
    console.log(`Socket Event Received: ${eventName}`, args);
  });

  socket.on('create_shared_expense', (data) => {
    console.log('Create Shared Expense Event:', data);
    try {
      io.to(`family_${data.familyGroupId}`).emit('shared_expense_created', data);
    } catch (error) {
      console.error('Error in create_shared_expense:', error);
    }
  });

  socket.on('invite_member', (data) => {
    console.log('Invite Member Event:', data);
    try {
      io.to(`family_${data.familyGroupId}`).emit('member_invited', data);
    } catch (error) {
      console.error('Error in invite_member:', error);
    }
  });

  socket.on('join_family_group', (groupId) => {
    console.log(`User joining family group: ${groupId}`);
    socket.join(`family_${groupId}`);
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', {
      id: socket.id,
      reason: reason
    });
  });
});


app.use(routes);

// Change app.listen to httpServer.listen
httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});