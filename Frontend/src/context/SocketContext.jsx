import React, { createContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

const SocketProvider = ({ children }) => {
    // Create the socket once inside the component lifecycle.
    // Using useRef ensures:
    //   1. Only one socket instance even across HMR reloads (no duplicate connections)
    //   2. The socket is synchronously available (never null) to any consumer
    const socketRef = useRef(null);
    if (!socketRef.current) {
        socketRef.current = io(`${import.meta.env.VITE_BASE_URL}`, {
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
        });
    }
    const socket = socketRef.current;

    useEffect(() => {
        const onConnect = () => console.log('Connected to server');
        const onDisconnect = () => console.log('Disconnected from server');

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
        };
    }, [ socket ]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;
