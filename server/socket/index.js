import { registerCreateChatHandler } from "./createChatHandler.js";
import { registerJoinChatHandler } from "./joinChatHandler.js";
import { registerSearchHandler } from "./searchHandler.js";
import { registerSendMessageHandler } from "./sendMessageHandler.js";
import { registerGetUserChatsHandler } from "./getUserChatsHandler.js";
import jwt from 'jsonwebtoken'

export const initSocketManager = (io) => {
    io.use((socket, next) => {
        try {
            const token = socket?.handshake?.auth?.token

            if (!token) {
                return next(new Error('Authentication error: Token not found'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded.userId;

            next();
        } catch (err) {
            return next(new Error(`Authentication error: Invalid Token: ${err}`));
        }
    })

    io.on('connection', (socket) => {
        registerGetUserChatsHandler(io, socket);
        registerSearchHandler(io, socket);
        registerCreateChatHandler(io, socket);
        registerJoinChatHandler(io, socket);       
        registerSendMessageHandler(io, socket); 

        socket.on('disconnect', () => {
            console.log(`Client disconnect: ${socket}`);
        })
    })
}