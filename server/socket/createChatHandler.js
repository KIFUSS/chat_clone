import Chat from "../models/Chat.js";
import mongoose from "mongoose";

export const registerCreateChatHandler = (io, socket) => {
    socket.on('create_chat', async ({partnerId}, callback) => {
        try {
            const myUserId = socket.user;

            console.log(socket.user);
            console.log(partnerId)

            if (!mongoose.Types.ObjectId.isValid(myUserId) || !mongoose.Types.ObjectId.isValid(partnerId)) {
                return callback({ success: false, error: 'Некорректные ID участников' });
            }

            // Проверяем, нет ли уже чата между этими двумя пользователями
            let chat = await Chat.findOne({
                participants: { $all: [myUserId, partnerId] }
            }).populate('participants', 'name').populate('lastMessage');

            // Если чат уже есть, просто возвращаем его фронтенду
            if (chat) {
                console.log('BACKEND ЧАТ УЖЕ ЕСТЬ МЕЖДУ НИКИ')
                return callback({ success: false, error: 'Чат между ними уже существует' });
            }


            // Если чата нет — создаем в базе данных новый документ
            const newChat = new Chat({
                participants: [myUserId, partnerId]
            });
            await newChat.save();

            // Делаем populate для только что созданного чата перед отправкой
            chat = await Chat.findById(newChat._id).populate('participants', 'name');

            // (Опционально) Оповещаем второго пользователя через сокеты, если он в сети
            // socket.to(partnerId).emit('chat_created', chat);

            return callback({ success: true, chat });
        } catch (err) {
            console.error(err);
            return callback({ success: false, error: err.message });
        }
    });
}