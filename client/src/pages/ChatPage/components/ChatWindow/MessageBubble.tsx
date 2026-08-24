import React from "react";

interface MessageBubbleProps {
    text: string;
    time: string;
    isMe: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({text, time, isMe}) => {
    return (
        <>
            <div className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div 
                    className={`max-w-md p-3 shadow-md flex flex-col gap-1 text-sm leading-relaxed
                    ${isMe 
                        ? 'bg-sky-600 text-white rounded-2xl rounded-tr-none' 
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-2xl rounded-tl-none'
                    }
                    `}
                >
                    <p className="font-normal whitespace-pre-wrap break-words">{text}</p>
                    <time 
                    className={`text-[10px] text-right font-light select-none
                        ${isMe ? 'text-sky-200' : 'text-zinc-500'}
                    `}
                    >
                        {time}
                    </time>
                </div>
            </div>
        </>
    )
}