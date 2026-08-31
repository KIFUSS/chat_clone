import Chat from "../models/Chat.js";
import mongoose from "mongoose";

export const registerGetUserChatsHandler = (io, socket) => {
    socket.on('get_user_chats', async (callback) => {
        console.log('салам')
        try {
            console.log('[backend] Начинаем код для отправки чатов юзера')
            if (!socket.user) {
                return callback({success: false, error: "Ошибка на сервере, отсутствует переданный токен"});
            }

            const userId = socket.user;

            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return callback({ success: false, error: 'Некорректный userId' });
            }

            // Находим все чаты, где пользователь является участником
            const userChats = await Chat.find({ participants: userId })
                .populate('participants', 'name') // Достаем из коллекции User имя и аватар
                .populate('lastMessage')                // Достаем текст последнего сообщения
                .sort({ updatedAt: -1 });               // Свежие чаты перемещаем наверх

            return callback({ success: true, chats: userChats, myUserId: userId });
        } catch (err) {
            console.error(err);
            return callback({ success: false, error: err.message });
        }
    });
}