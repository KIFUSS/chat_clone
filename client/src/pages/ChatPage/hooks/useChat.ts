import {useState, useEffect} from 'react'
import {jwtDecode} from 'jwt-decode'
import type { ChatData, MessageData, MessageRepository } from "../types"
import { MOCK_CHATS } from '../mockData';

interface JwtPayload {
    userId: string;
}


export const useChat = () => {
    const [activeChatId, setActiveChatId] = useState<string | null>('1');
    const [inputText, setInputText] = useState<string>('');
    const [chats] = useState<ChatData[]>(MOCK_CHATS)
    const [searchQuery, setSearchQuery] = useState<string>('');
    
    // const [messageRepository, setMessageRepository] = useState<MessageRepository>(MOCK_MESSAGES_REPOSITORY)
    const [messages, setMessages] = useState<MessageData[]>([]);

    const token = localStorage.getItem('token') || '';
    let myUserId = '';

    if (token) {
        try {
            const decoded = jwtDecode<JwtPayload>(token);
            myUserId = decoded.userId
        } catch (e) {
            console.log('Ошибка декодирования JWT токена');
        }
    }

    const currentChat = chats.find((c) => c.id === activeChatId) || chats[0];

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/messages/${activeChatId}`)
                const data = await response.json();

                if (response.ok) {
                    const formatterMessages: MessageData[] = data.messages.map((msg: any) => ({
                        id: msg._id,
                        text: msg.text,
                        time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        isMe: msg.sender._id === myUserId  
                    }))
                    setMessages(formatterMessages)
                }
            } catch (err) {
                console.log("Не удалось загрузить сообщения")
            }
        }
    }, [activeChatId, myUserId])

    const handleSendMessage = async () => {
        if (!inputText.trim() || !myUserId) return;

        try {
            const response = await fetch('http://localhost:5000/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    senderId: myUserId,
                    chatId: activeChatId,
                    text: inputText.trim(),
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Сервер вернул успешно сохраненное сообщение — пушим его в массив на экране
                const clientMessage: MessageData = {
                    id: data.message._id,
                    text: data.message.text,
                    time: new Date(data.message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isMe: true,
                };

                setMessages((prev) => [...prev, clientMessage]);
                setInputText('');
            }
        } catch (err) {
            console.error('Ошибка при отправке сообщения', err);
        }
    };


    const filteredChats = chats.filter((chat) => chat.name.toLowerCase().includes(searchQuery.toLocaleLowerCase()));

    const handleSelectChat = (id: string) => {
        setActiveChatId(id)
    }

    

    return {
        chats: filteredChats,
        activeChatId,
        currentChat,
        currentMessages: messages,
        inputText,
        setInputText,
        searchQuery,
        setSearchQuery,
        handleSendMessage,
        handleSelectChat
    }
}