import Message from "../models/Message.js";
import Chat from "../models/Chat.js";
import mongoose from "mongoose";


export const updateLastMessageForChat = async (lastMessageId, chatId) => {
    console.log(lastMessageId)
    if (!mongoose.Types.ObjectId.isValid(lastMessageId)) {
        throw new Error('ID сообщение пуст');
    }

    const resultUpdate = await Chat.findByIdAndUpdate(
        chatId,
        {$set: {lastMessage: lastMessageId}},
        {
            returnDocument: 'after',
            runValidators: true
        }
    )

    if (!resultUpdate) {
        throw new Error('Ошибка обновления чата, такого чата не существует');
    }
}


export const saveMessage = async (sender, chatId, textMessage) => {
    if (!textMessage.trim()) {
        throw new Error('Текст сообщения не может быть пустым!');
    }

    const newMessage = new Message({
        sender: sender,
        chatId: chatId,
        text: textMessage
    })

    await newMessage.save();
    await newMessage.populate('sender', 'name');

    console.log(newMessage._id);

    return newMessage;
}


export const forrmatedMessageForFrontend = (message) => {
    if (!message) {
        throw new Error('Передано неккоретное сообщение');
    }

    return {
        id: message._id,
        text: message.text,
        time: new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: false,
        senderId: message.sender._id,
    }
}