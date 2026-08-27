import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true,
        index: true,
    },
    text: {
        type: String,
        required: true,
        trim: true,
    }
}, {
    timestamps: true
})

const Message = mongoose.model('Message', messageSchema);
export default Message;