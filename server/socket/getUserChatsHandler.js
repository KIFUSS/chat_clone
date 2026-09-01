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
                .sort({ updatedAt: -1 })
                .lean()

            console.log(userId)
            const idsUsersInChat = userChats.map(chat => chat.participants.find(partner => !partner._id.equals(userId))._id);
            const statusUsers = await UserStatus.find({userId: {$in: idsUsersInChat}}).select('isOnline userId');

            const statusMap = statusUsers.reduce((acc, curr) => {
                acc[curr.userId.toString()] = curr.isOnline;
                return acc;
            }, {})
            
            const finalChats = userChats.map(chat => {
                return {
                    ...chat, 
                    participants: chat.participants.map(partner => {
                        const isOnline = statusMap[partner._id.toString()] || false;
                        return {
                            ...partner,
                            isOnline
                        }
                    })
                }
            })

            return callback({ success: true, chats: finalChats, myUserId: userId });
        } catch (err) {
            console.error(err);
            return callback({ success: false, error: err.message });
        }
    });
}