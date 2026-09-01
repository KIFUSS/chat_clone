import type { ChatData } from "../types";

type updateLastMessageForChatType = (chats: ChatData[], idChat: string, message: string) => ChatData[];

export const updateLastMessageForChat: updateLastMessageForChatType = (chats, idChat, message) => {
    return chats.map((chat: ChatData) => chat.id === idChat ? {...chat, lastMessage: message} : chat);
}