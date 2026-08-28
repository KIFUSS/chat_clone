import Chat from "../models/Chat";

export const registerCreateChatHandler = (io, socket) => {
    socket.on('create_chat', async ({ myUserId, partnerId }, callback) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(myUserId) || !mongoose.Types.ObjectId.isValid(partnerId)) {
                return callback({ success: false, error: 'Некорректные ID участников' });
            }

            // Проверяем, нет ли уже чата между этими двумя пользователями
            let chat = await Chat.findOne({
                participants: { $all: [myUserId, partnerId] }
            }).populate('participants', 'name').populate('lastMessage');

            // Если чат уже есть, просто возвращаем его фронтенду
            if (chat) {
                return callback({ success: true, chat });
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