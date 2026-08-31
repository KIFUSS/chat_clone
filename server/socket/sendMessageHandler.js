import { saveMessage, updateLastMessageForChat, forrmatedMessageForFrontend } from "../service/chatService.js";

export const registerSendMessageHandler = (io, socket) => {
    socket.on('send_message', async (data, callback) => {
        const {message, chatId} = data;

        if (!socket.user) {
            return callback({
                    status: 500,
                    success: false,
                    error: 'Сервер не нашел ваш айди в запросе',
            })
        }

        if (!message || !chatId) {
            return callback({
                    status: 500,
                    success: false,
                    error: 'Получены некоректные данные'
            })
        }

        try {
            const savedMessage = await saveMessage(socket.user, chatId, message);
            updateLastMessageForChat(savedMessage._id, chatId);

            const formattedMessage = forrmatedMessageForFrontend(savedMessage);
            socket.to(chatId).emit("receive_message", formattedMessage);

            console.log(formattedMessage)

            if (typeof callback === 'function') {
                callback({status: 200, success: true, message: formattedMessage})
            }
            
        } catch (err) {
            if (typeof callback === 'function') {
                callback({
                    status: 500,
                    success: false,
                    error: `Не удалось сохранить сообщение: ${err}`
                })
            }
        }
    })
}