import { registerCreateChatHandler } from "./createChatHandler.js";
import { registerJoinChatHandler } from "./joinChatHandler.js";
import { registerSearchHandler } from "./searchHandler.js";
import { registerSendMessageHandler } from "./sendMessageHandler.js";
import { registerGetUserChatsHandler } from "./getUserChatsHandler.js";
import jwt from 'jsonwebtoken'
import User from "../models/User.js";
import UserStatus from "../models/userStatus.js";

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

    // Таймеры удаления
    const disconnectTimers = new Map();

    io.on('connection', async (socket) => {
        const userId = socket.user;

        if (disconnectTimers.has(userId)) {
            clearTimeout(disconnectTimers.get(userId))
            disconnectTimers.delete(userId)
        } else {
            await UserStatus.findOneAndUpdate({userId: userId}, {$set: {isOnline: true}});
            console.log('[backend] обновили статус ты онлайн)')
            socket.broadcast.emit('user_status_changed', {userId, isOnline: true});
        }




        registerGetUserChatsHandler(io, socket);
        registerSearchHandler(io, socket);
        registerCreateChatHandler(io, socket);
        registerJoinChatHandler(io, socket);       
        registerSendMessageHandler(io, socket); 

        socket.on('disconnect', () => {
            console.log(`Client disconnect: ${socket}`);
            
            const timer = setTimeout(async () => {
                await UserStatus.findOneAndUpdate({userId: userId}, {$set: {isOnline: false}});
                console.log('ой теперь ты не онлайн(')
                io.emit('user_status_changed', {userId, isOnline: false});
                disconnectTimers.delete(userId);
            }, 10000)

            disconnectTimers.set(userId, timer);
        })
    })
}