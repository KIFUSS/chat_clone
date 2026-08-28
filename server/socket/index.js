import { registerCreateChatHandler } from "./createChatHandler";
import { registerJoinChatHandler } from "./joinChatHandler";
import { registerSearchHandler } from "./searchHandler";
import { registerSendMessageHandler } from "./sendMessageHandler";

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