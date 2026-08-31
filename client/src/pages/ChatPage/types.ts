import { Socket } from "socket.io-client";


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

export interface UserDataBackend {
    _id: string;
    phone: string;
    name: string;
    createdAt: string;
    __v: number;
}

export type MessageRepository = Record<string, MessageData[]>


export type ResponseFetchMessage = 
      | {status: number; success: true; messages: BackendMessage[]; myId: string}
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


export interface useCreateChatProps {
    socket: Socket | null;
}

export interface useCreateChatReturn {
    createChatHandler: createChatHandler;
    isLoading: boolean;
    error: string | null;
}


export type createChatHandler = (partnerId: string) => void;



export interface useSearchProps {
    inputSearchVal: string;
    chats: ChatData[];
    socket: Socket | null;
}

export interface useSearchReturn {
    filteredChats: ChatData[];
    globalSearchResult: UserDataBackend[];
}