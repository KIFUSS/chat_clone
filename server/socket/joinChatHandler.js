import Message from "../models/Message.js";
import mongoose from "mongoose";

export const registerJoinChatHandler = (io, socket) => {
    socket.on('join_chat', async (chatId, callback) => {
        if (!chatId || !mongoose.Types.ObjectId.isValid(chatId)) {
            return callback({
                status: 400,
                success: false,
                error: "Некорректный формат идентификатора чата (chatId)"
            });
        }

        socket.join(chatId);

        try {
            const populatedMessages = await Message.find({ chatId })
                .populate('sender') 
                .sort({ createdAt: 1 });

            return callback({
                status: 200,
                success: true,
                messages: populatedMessages,
                myId: socket.user,
            });

        } catch (err) {
            return callback({
                status: 500,
                success: false,
                error: `Произошла ошибка при получении сообщений выбранного чата: ${err.message}`
            });
        }


    })
}