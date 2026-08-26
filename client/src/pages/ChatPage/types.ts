export interface ChatData {
    id: string;
    name: string;
    avatarText: string;
    lastMessage: string;
    time: string;
}

export interface MessageData {
    id: string;
    text: string;
    time: string;
    isMe: boolean;
    senderId: string;
}

export type MessageRepository = Record<string, MessageData[]>