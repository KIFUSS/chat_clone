import { registerCreateChatHandler } from "./createChatHandler.js";
import { registerJoinChatHandler } from "./joinChatHandler.js";
import { registerSearchHandler } from "./searchHandler.js";
import { registerSendMessageHandler } from "./sendMessageHandler.js";
import { registerGetUserChatsHandler } from "./getUserChatsHandler.js";
import jwt from 'jsonwebtoken'
import cookie from 'cookie';

export const initSocketManager = (io) => {
    io.use((socket, next) => {
        try {
            console.log(123)
            console.log(socket.handsnake)
            const cookiesHeader = socket?.handsnake?.headers?.cookie;


            

            if (!cookiesHeader) {
                return next(new Error('Authentication error: No cookies found'));
            }

            const parsedCookies = cookie.parse(cookiesHeader);
            const token = parsedCookies.token;

            if (!token) {
                return next(new Error('Authentication error: Token missing'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded;

            next();

        } catch (err) {
            return next(new Error("Authentication error: Invalid Token"));
        }
    })

    io.on('connection', (socket) => {
        console.log(`[backend] Client connected: ${socket.user.id}`);
        console.log('[backend] Переданый токен с фронта который в сокете:');
        console.log(socket.user);

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