import mongoose from "mongoose";
import Chat from "../models/Chat.js";
import User from '../models/User.js'

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
            .then(async () => {
                //  const allUsers = await Chat.find({});
                //     console.log('=== СПИСОК ПОЛЬЗОВАТЕЛЕЙ В БД ===');
                //     console.log(allUsers);
                //     console.log('=================================');
            })
       
        console.log('MongoDB connect successfully');
    } catch (err) {
        console.log('MongoDB connection failed: ', err);
    }
}