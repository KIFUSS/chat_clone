import React from "react";
import { MessageBubble } from "./MessageBubble";

interface MessageData {
    id: string;
    text: string;
    time: string;
    isMe: boolean;
}

export const MessageArea: React.FC = () => {
    const mockMessages: MessageData[] = [
        {
            id: '1',
            text: 'Слушай, а база данных MongoDB реально быстро поднялась после перезагрузки!',
            time: '14:15',
            isMe: false,
        },
        {
            id: '2',
            text: 'Да, у winget стабильная LTS-версия ставится без проблем. Теперь пишем фронтенд чатов!',
            time: '14:16',
            isMe: true,
        },
        {
            id: '3',
            text: 'Отлично получается. Разметка по папкам выглядит очень профессионально.',
            time: '14:17',
            isMe: false,
        }
    ]

    return (
        <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[radial-gradient(#1f1f23_1px,transparent_1px)] [background-size:16px_16px]">
                {mockMessages.map((msg) => (
                    <MessageBubble 
                        key={msg.id}
                        text={msg.text}
                        time={msg.time}
                        isMe={msg.isMe}
                    />
                ))}
            </div>
        </>
    )
}