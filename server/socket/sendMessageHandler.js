import Message from "../models/Message.js";

export const registerSendMessageHandler = (io, socket) => {
    socket.on('send_message', async (data, callback) => {
        const {message, chatId} = data;

        if (!socket.user) {
            callback({
                    status: 500,
                    success: false,
                    error: 'Сервер не нашел ваш айди в запросе',
            })
        }

        if (!message || !chatId) {
            callback({
                    status: 500,
                    success: false,
                    error: 'Получены некоректные данные'
            })
        }

        try {
            const newMessage = new Message({
                sender: socket.user,
                chatId: chatId,
                text: message
            })

            await newMessage.save();
            await newMessage.populate('sender', 'name');


            const formattedMessage = {
                id: newMessage._id,
                text: newMessage.text,
                time: new Date(newMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isMe: false,
                senderId: newMessage.sender._id,
            }

            // Отправляет новое сообщение в сокет комнату по айди чата
            socket.to(chatId).emit("receive_message", formattedMessage);

            console.log(`[backend] Сообщение сохранено в бд для чата ${chatId}`);

            if (typeof callback === 'function') {
                callback({status: 200, success: true, message: formattedMessage})
            }
            
        } catch (err) {
            console.log(err)

            if (typeof callback === 'function') {
                callback({
                    status: 500,
                    success: false,
                    error: 'Не удалось сохранить сообщение'
                })
            }
        }
    })
}