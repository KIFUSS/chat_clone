import Chat from "../models/Chat.js";
import mongoose from "mongoose";
import UserStatus from "../models/userStatus.js";

export const registerGetUserChatsHandler = (io, socket) => {
    socket.on('get_user_chats', async (callback) => {
        try {
            if (!socket.user) {
                return callback({success: false, error: "Ошибка на сервере, отсутствует переданный токен"});
            }

            const userId = socket.user;

            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return callback({ success: false, error: 'Некорректный userId' });
            }

            const userChats = await Chat.find({ participants: userId })
                .populate('participants', 'name')
                .populate('lastMessage')     
                .sort({ updatedAt: -1 });     

            // const idsUsersInChat = userChats.map(chat => chat.participants);
            // const statusUsers = await UserStatus.find({_id: {$in: idsUsersInChat}}).select('isOnline');
            // console.log(idsUsersInChat)
                

            return callback({ success: true, chats: userChats, myUserId: userId });
        } catch (err) {
            console.error(err);
            return callback({ success: false, error: err.message });
        }
    });
}