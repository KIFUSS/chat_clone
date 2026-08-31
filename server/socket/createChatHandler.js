import Chat from "../models/Chat.js";
import mongoose from "mongoose";

export const registerCreateChatHandler = (io, socket) => {
    socket.on('create_chat', async ({partnerId}, callback) => {
        try {
            const myUserId = socket.user;

            if (!mongoose.Types.ObjectId.isValid(myUserId) || !mongoose.Types.ObjectId.isValid(partnerId)) {
                return callback({ success: false, error: 'Некорректные ID участников' });
            }

            let chat = await Chat.findOne({
                participants: { $all: [myUserId, partnerId] }
            }).populate('participants', 'name').populate('lastMessage');

            if (chat) {
                return callback({ success: false, error: 'Чат между ними уже существует' });
            }

            const newChat = new Chat({
                participants: [myUserId, partnerId],
            });

            await newChat.save();

            chat = await Chat.findById(newChat._id).populate('participants', 'name');

            return callback({ success: true, chat });
        } catch (err) {
            console.error(err);
            return callback({ success: false, error: err.message });
        }
    });
}