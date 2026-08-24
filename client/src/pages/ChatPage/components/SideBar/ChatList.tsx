import React from "react";

import { ChatListItem } from "./ChatListItem";
import type {ChatData} from '../../types'


interface ChatListProps {
    chats: ChatData[];
    activeChatId: string | null;
    onSelectChat: (id: string) => void;
}

export const ChatList: React.FC<ChatListProps> = ({chats, activeChatId, onSelectChat}) => {

    return (
        <div className="overflow-y-auto flex-1 p-2 space-y-1">
            {chats.map((chat) => (
                <ChatListItem 
                    key={chat.id}
                    chat={chat}
                    isActive={chat.id === activeChatId}
                    onClick={() => onSelectChat(chat.id)}
                />
            ))}

        </div>
    )
}