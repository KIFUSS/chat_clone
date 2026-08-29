import { registerCreateChatHandler } from "./createChatHandler.js";
import { registerJoinChatHandler } from "./joinChatHandler.js";
import { registerSearchHandler } from "./searchHandler.js";
import { registerSendMessageHandler } from "./sendMessageHandler.js";
import { registerGetUserChatsHandler } from "./getUserChatsHandler.js";

export const initSocketManager = (io) => {
    io.on('connection', (socket) => {
        console.log(`[backend] Client connected: ${socket}`);

        registerSearchHandler(io, socket);
        registerGetUserChatsHandler(io, socket);
        registerCreateChatHandler(io, socket);
        registerJoinChatHandler(io, socket);       
        registerSendMessageHandler(io, socket); 

        socket.on('disconnect', () => {
            console.log(`Client disconnect: ${socket}`);
        })
    })
}