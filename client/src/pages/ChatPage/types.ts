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


export type ResponseFetchMessage = 
      | {status: number; success: true; messages: BackendMessage[]}
      | {status: number; success: false; error: string}

export interface BackendMessage {
    _id: string;
    sender: {_id: string, name: string};
    chatId: string,
    text: string,
    createdAt: Date,
}


export interface JwtPayload {
  userId: string;
}