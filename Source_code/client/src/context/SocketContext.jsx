// src/context/SocketContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { toast } from 'react-hot-toast';

const SocketContext = createContext(null);
const BASE_URL = 'https://money-mentor-1f1e.onrender.com';
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const newSocket = io(BASE_URL, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
  
    newSocket.on('connect', () => {
      console.log('🔵 Socket Connected');
      console.log('Socket ID:', newSocket.id);
    });
  
    // Catch-all event listener for debugging
    newSocket.onAny((eventName, ...args) => {
      console.log(`🔔 Socket Event: ${eventName}`, args);
    });
  
    newSocket.on('connect_error', (error) => {
      console.error('🔴 Socket Connection Error:', error);
    });
  
    setSocket(newSocket);
  
    return () => newSocket.disconnect();
  }, []);
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};