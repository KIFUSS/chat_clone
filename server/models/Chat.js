import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    // ПЕРВЫЙ ОБЪЕКТ: Только поля документа
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
    }
  }, // <--- ОБРАТИТЕ ВНИМАНИЕ: Здесь закрывается первый объект и ставится запятая!
  { 
    // ВТОРОЙ ОБЪЕКТ: Только настройки схемы
    timestamps: true 
  }
);

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;