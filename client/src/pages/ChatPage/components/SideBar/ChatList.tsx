import React from "react";

import { ChatListItem } from "./ChatListItem";
import type {ChatData} from '../../types'
import { useSearch } from "../../hooks/useSearch";
import type { Socket } from "socket.io-client";
import { UserListItem } from "./UserListItem";
import { useCreateChat } from "../../hooks/useCreateChat";


interface ChatListProps {
    chats: ChatData[];
    activeChatId: string | null;
    onSelectChat: (id: string) => void;
    searchQuery: string;
    socket: Socket | null;
}

export const ChatList: React.FC<ChatListProps> = ({chats, activeChatId, onSelectChat, searchQuery, socket}) => {

    const {filteredChats, globalSearchResult} = useSearch({inputSearchVal: searchQuery, chats, socket});
    const {createChatHandler, isLoading, error} = useCreateChat({socket})


    return (
        <div className="overflow-y-auto flex-1 p-2 space-y-1">
            {filteredChats.length === 0 ? 
                globalSearchResult.map((user) => (
                    <UserListItem 
                        key={user._id}
                        name={user.name}
                        startChat={createChatHandler}
                        userData={user}
                    />
                ))
            : 
                filteredChats.map((chat) => (
                    <ChatListItem 
                        key={chat.id}
                        chat={chat}
                        isActive={chat.id === activeChatId}
                        onClick={() => onSelectChat(chat.id)}
                    />
                ))
            }

        </div>
    )
}