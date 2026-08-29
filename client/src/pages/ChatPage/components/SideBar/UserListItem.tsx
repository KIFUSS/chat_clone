import React from 'react';
import type { createChatHandler, UserDataBackend } from '../../types';
import { getMyUserId } from '@/utils';


interface UserListItemProps {
    name: string;
    startChat: createChatHandler;
    userData: UserDataBackend;
}


export const UserListItem: React.FC<UserListItemProps> = ({name, startChat, userData}) => {

    const handlerStartChat = () => {
        const myUserId = getMyUserId();
        const partnerId = userData._id;
        
        if (!myUserId) {
            console.log('Ошибка с айди текущего юзера');
        }

        if (!myUserId || !partnerId) {
            console.log('Ошибка, некорректные ID пользователей, не возможно создать чат');
            return
        }

        startChat(myUserId, partnerId)
        
    }

    return (
        <div 
            onClick={() => handlerStartChat()}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors group select-none`}        
        >
            <div className="w-11 h-11 bg-sky-500 rounded-full flex items-center justify-center font-bold text-white shrink-0">
                {name.charAt(0)}
            </div>
            {/* Текстовый блок карточки */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                    <h3 className="text-sm font-semibold text-zinc-200 truncate">{name}</h3>
                    {/* <time className="text-xs text-zinc-500 font-light">{chat.time}</time> */}
                </div>
                {/* truncate красиво поставит три точки, если текст сообщения не влезает */}
                {/* <p className="text-xs text-zinc-400 truncate group-hover:text-zinc-300 transition-colors">
                    {chat.lastMessage}
                </p> */}
            </div>
        </div>
    )
}