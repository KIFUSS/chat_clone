import React from 'react';
import type { ChatData } from '../../types';


interface ChatListItemProps {
    chat: ChatData;
    isActive: boolean;
    onClick: () => void;
}


export const ChatListItem: React.FC<ChatListItemProps> = ({chat, isActive, onClick}) => {

    return (
        <div 
            onClick={onClick}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors group select-none
                    ${isActive ? 'bg-zinc-800' : 'bg-transparent hover:bg-zinc-800/50'}
            `}        
        >
            <div className="w-11 h-11 bg-sky-500 rounded-full flex items-center justify-center font-bold text-white shrink-0">
                {chat.avatarText}
            </div>
            {/* Текстовый блок карточки */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                    <h3 className="text-sm font-semibold text-zinc-200 truncate">{chat.name}</h3>
                    <time className="text-xs text-zinc-500 font-light">{chat.time}</time>
                </div>
                {/* truncate красиво поставит три точки, если текст сообщения не влезает */}
                <p className="text-xs text-zinc-400 truncate group-hover:text-zinc-300 transition-colors">
                    {chat.lastMessage}
                </p>
            </div>
        </div>
    )
}