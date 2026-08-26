import { useState, useEffect, useRef } from 'react';
import { jwtDecode } from 'jwt-decode'; // Наш импортированный декодер токенов
import { type ChatData, type MessageData } from '../types';
import { MOCK_CHATS } from '../mockData';

import {io, Socket} from 'socket.io-client'

interface JwtPayload {
  userId: string;
}

export const useChat = () => {
  const [activeChatId, setActiveChatId] = useState<string>('1');
  const [inputText, setInputText] = useState<string>('');
  const [chats] = useState<ChatData[]>(MOCK_CHATS);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // socket
  const socketRef = useRef<Socket | null>(null);

  // 1. ТЕПЕРЬ СООБЩЕНИЯ ХРАНЯТСЯ В ЧИСТОМ ДИНАМИЧЕСКОМ МАССИВЕ ДЛЯ ТЕКУЩЕГО ЧАТА
  const [messages, setMessages] = useState<MessageData[]>([]);

  // 2. ДОСТАЕМ И ДЕКОДИРУЕМ JWT-ТОКЕН
  const token = localStorage.getItem('token') || '';
  let myUserId = '';

  if (token) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      myUserId = decoded.userId; // Достали твой реальный ID пользователя из MongoDB
    } catch (e) {
      console.error('Ошибка декодирования JWT токена', e);
    }
  }


  const currentChat = chats.find((c) => c.id === activeChatId) || chats[0];

  // Иниацилизация сокета
  useEffect(() => {
    socketRef.current = io("http://localhost:5000")

    socketRef.current.on("receive_message", (newMessage: any) => {
      if (newMessage.isMe === null) {
        newMessage.isMe = myUserId === newMessage.sender;
        delete newMessage.sender;
        setMessages((prev) => [...prev, newMessage]);
      }
    })

    return () => {
      socketRef.current?.disconnect();
    }
  }, [])

  // 3. ЭФФЕКТ: КАЖДЫЙ РАЗ ПРИ СМЕНЕ ЧАТА КАЧАЕМ ПЕРЕПИСКУ ИЗ ЛОКАЛЬНОЙ БАЗЫ ДАННЫХ
  useEffect(() => {
    // Логика на сокетах 

    if (!activeChatId && !socketRef.current) return;

    const fetchMessage = async () => {
      try {
        socketRef.current?.emit('join_chat', activeChatId);

        const response = await fetch(`http://localhost:5000/api/messages/${activeChatId}`);
        const data = await response.json();
        
        if (response.ok) {
          // Переводим сообщения из структуры MongoDB под структуру нашего фронтенда
          const formattedMessages: MessageData[] = data.messages.map((msg: any) => ({
            id: msg._id,
            text: msg.text,
            time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            // На сервере метод .populate() вернул нам объект автора, сверяем его ID со своим
            isMe: msg.sender._id === myUserId, 
          }));
          setMessages(formattedMessages);
        }

      } catch (err) {
        console.log(err + "Erorrrrrr");
      }
    }

    
    fetchMessage()

  }, [activeChatId, myUserId]);

  // 4. ФУНКЦИЯ ОТПРАВКИ: СОХРАНЯЕМ ТЕКСТ НАМЕРТВО В MONGODB ЧЕРЕЗ EXPRESS API
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
        // // Добавляем успешно сохраненное сообщение прямо в текущий экран
        // const clientMessage: MessageData = {
        //   id: data.message._id,
        //   text: data.message.text,
        //   time: new Date(data.message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        //   isMe: true,
        // };

        // setMessages((prev) => [...prev, clientMessage]);
        setInputText('');
      }
    } catch (err) {
      console.error('Ошибка при отправке сообщения', err);
    }
  };

  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
  };

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    chats: filteredChats,
    activeChatId,
    currentChat,
    currentMessages: messages, // Передаем наш чистый массив сообщений из базы данных
    inputText,
    setInputText,
    searchQuery,
    setSearchQuery,
    handleSendMessage,
    handleSelectChat,
  };
};