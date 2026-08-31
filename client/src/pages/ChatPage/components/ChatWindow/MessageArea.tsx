import React, { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import type { MessageData } from "../../types";

interface MessageAreaProps {
    messages: MessageData[];
}

export const MessageArea: React.FC<MessageAreaProps> = ({messages}) => {
    const messagesEndRef = useRef<HTMLDivElement | null>(null);


    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [messages])

    return (
        <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[radial-gradient(#1f1f23_1px,transparent_1px)] [background-size:16px_16px]">
                {messages.map((msg) => (
                    <MessageBubble 
                        key={msg.id}
                        id={msg.id}
                        text={msg.text}
                        time={msg.time}
                        isMe={msg.isMe}
                    />
                ))}
            
            <div ref={messagesEndRef} />
            </div>
        </>
    )
}