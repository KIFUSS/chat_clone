import mongoose, { Schema } from "mongoose";

const userStatusShema = new Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true},
    isOnline: Boolean,
    lastActivity: Date,
})

const UserStatus = mongoose.model('UserStatus', userStatusShema);
export default UserStatus;