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
}

export type MessageRepository = Record<string, MessageData[]>