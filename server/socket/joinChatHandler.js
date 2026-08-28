import Message from "../models/Message";

export const registerJoinChatHandler = (io, socket) => {
    socket.on('join_chat', async (chatId, callback) => {
        if (!chatId || !mongoose.Types.ObjectId.isValid(chatId)) {
            // Обязательно пишем return, чтобы функция СРАЗУ завершилась и код не шёл ниже
            return callback({
                status: 400,
                success: false,
                error: "Некорректный формат идентификатора чата (chatId)"
            });
        }

        socket.join(chatId);

        try {
            // Делаем ОДИН запрос сразу со связями и сортировкой
            // Передаем в populate просто строку 'sender', чтобы получить объект пользователя целиком (включая _id)
            const populatedMessages = await Message.find({ chatId })
                .populate('sender') 
                .sort({ createdAt: 1 });

            //console.log(populatedMessages); // для отладки

            // Отправляем ОДИН ответ, независимо от того, пустой массив или нет
            return callback({
                status: 200,
                success: true,
                messages: populatedMessages,
            });

        } catch (err) {
            console.error(err);
            return callback({
                status: 500,
                success: false,
                error: `Произошла ошибка при получении сообщений выбранного чата: ${err.message}`
            });
        }

        console.log(`Сокет ${socket.id} вошел в комнату ${chatId}`)
    })
}