import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {io} from 'socket.io-client';

const apiurl= import.meta.env.VITE_API_URL;
const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [userData, setUserData] = useState(() => {
    const savedUserData = localStorage.getItem('userData');
    return savedUserData ? JSON.parse(savedUserData) : null;
  });

  const [messages, setMessages] = useState([]);
  const [channelMessages, setChannelMessages] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [typingUsers, setTypingUsers] = useState({});

  useEffect(() => {
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
    }
  }, []);

  const socket= useRef();

  useEffect(()=>{
    if(userData){
      socket.current= io(apiurl, {
        withCredentials: true,
        query: {userId: userData.id}
      });
      socket.current.on("connect", ()=>{
        console.log("Connected to the server(client side)")
      })

      const handleReceivedMessage= (message)=>{
        console.log("Received message:", message);
        setMessages(prev => [...prev, message]);
      }

      const handleChannelMessage = (data) => {
        console.log("Received channel message:", data);
        setChannelMessages(prev => ({
          ...prev,
          [data.channelId]: [...(prev[data.channelId] || []), data.message]
        }));
      }

      const handleUserOnline = (userId) => {
        setOnlineUsers(prev => new Set([...prev, userId]));
      }

      const handleUserOffline = (userId) => {
        setOnlineUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
      }

      const handleUserTyping = ({ userId, isTyping }) => {
        setTypingUsers(prev => ({
          ...prev,
          [userId]: isTyping
        }));
      }

      socket.current.on("receiveMessage", handleReceivedMessage)
      socket.current.on("receiveChannelMessage", handleChannelMessage)
      socket.current.on("userOnline", handleUserOnline)
      socket.current.on("userOffline", handleUserOffline)
      socket.current.on("userTyping", handleUserTyping)

      return ()=>{
        socket.current.disconnect();
      }
    }
  }, [userData]);

  return (
    <SocketContext.Provider value={{
      userData,
      setUserData,
      socket: socket.current,
      messages,
      setMessages,
      channelMessages,
      setChannelMessages,
      selectedUser,
      setSelectedUser,
      onlineUsers,
      typingUsers
    }}>
      {children}
    </SocketContext.Provider>
  );
};

const useSocket = () => {
  return useContext(SocketContext);
};

export default useSocket;
