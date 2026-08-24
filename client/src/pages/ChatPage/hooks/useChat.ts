import {useState} from 'react'
import type { ChatData, MessageData, MessageRepository } from "../types"
import { MOCK_CHATS, MOCK_MESSAGES_REPOSITORY } from '../mockData';


export const useChat = () => {
    const [activeChatId, setActiveChatId] = useState<string | null>('1');

    const [inputText, setInputText] = useState<string>('');

    const [chats] = useState<ChatData[]>(MOCK_CHATS)

    const [messageRepository, setMessageRepository] = useState<MessageRepository>(MOCK_MESSAGES_REPOSITORY)

    const currentChat = chats.find((c) => c.id === activeChatId) || chats[0];

    const currentMessages = messageRepository[activeChatId] || [];

    const handleSelectChat = (id: string) => {
        setActiveChatId(id)
    }

    const handleSendMessage = () => {
        if (!inputText.trim()) return;

        const newMessage: MessageData = {
            id: `m_$${Date.now()}`,
            text: inputText.trim(),
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
            isMe: true
        }

        setMessageRepository((prev) => ({
            ...prev,
            [activeChatId]: [...(prev[activeChatId] || []), newMessage],
        }))

        setInputText('');
    }

    return {
        chats,
        activeChatId,
        currentChat,
        currentMessages,
        inputText,
        setInputText,
        handleSendMessage,
        handleSelectChat
    }
}