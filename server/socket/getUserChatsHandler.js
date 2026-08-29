import Chat from "../models/Chat.js";
import mongoose from "mongoose";

export const registerGetUserChatsHandler = (io, socket) => {
    socket.on('get_user_chats', async (userId, callback) => {
        try {
            if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
                return callback({ success: false, error: 'Некорректный userId' });
            }

            // Находим все чаты, где пользователь является участником
            const userChats = await Chat.find({ participants: userId })
                .populate('participants', 'name') // Достаем из коллекции User имя и аватар
                .populate('lastMessage')                // Достаем текст последнего сообщения
                .sort({ updatedAt: -1 });               // Свежие чаты перемещаем наверх

            return callback({ success: true, chats: userChats });
        } catch (err) {
            console.error(err);
            return callback({ success: false, error: err.message });
        }
    });
}