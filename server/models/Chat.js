import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }
    ],
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        required: false
    },
    timespamps: true
})

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;