import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {io} from 'socket.io-client';

const apiurl= import.meta.env.VITE_API_URL;
const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [userData, setUserData] = useState(() => {
    const savedUserData = localStorage.getItem('userData');
    return savedUserData ? JSON.parse(savedUserData) : null;
  });

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

      const handleRecievedMessage= (message)=>{
        
      }
      socket.current.on("recievedMessage", handleRecievedMessage)

      return ()=>{
        socket.current.disconnect();
      } 
    }
  }, [userData]);

  return (
    <SocketContext.Provider value={{ userData, setUserData, socket: socket.current }}>
      {children}
    </SocketContext.Provider>
  );
};

const useSocket = () => {
  return useContext(SocketContext);
};

export default useSocket;
