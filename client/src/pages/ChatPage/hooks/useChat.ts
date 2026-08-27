import { useState, useEffect, useRef, useMemo } from 'react';
import { jwtDecode } from 'jwt-decode'; // Наш импортированный декодер токенов
import { type BackendMessage, type ChatData, type MessageData, type ResponseFetchMessage, type JwtPayload} from '../types';
import { MOCK_CHATS } from '../mockData';
import {io, Socket} from 'socket.io-client'


export const useChat = () => {
  const [activeChatId, setActiveChatId] = useState<string>('1');
  const [inputText, setInputText] = useState<string>('');
  const [chats] = useState<ChatData[]>(MOCK_CHATS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);

  const myUserId = useMemo(() => {
    const token = localStorage.getItem('token') || '';

    if (!token) return ''

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.userId; 
    } catch (e) {
      console.error('Ошибка декодирования JWT токена', e);
      return '';
    }
  }, [])

  

  const currentChat = chats.find((c) => c.id === activeChatId) || chats[0];

  useEffect(() => {
    socketRef.current = io("http://localhost:5000")

    socketRef.current.on("receive_message", (newMessage: MessageData) => {
      if (newMessage.isMe === null) {
        newMessage.isMe = myUserId === newMessage.senderId;
        setMessages((prev) => [...prev, newMessage]);
      }
    })

    return () => {
      socketRef.current?.disconnect();
    }
  }, [myUserId])

  useEffect(() => {
    if (!activeChatId || !socketRef.current) return;

    const fetchMessage = async () => {
      try {
        const response: ResponseFetchMessage = await socketRef.current?.timeout(5000).emitWithAck('join_chat', activeChatId);

        if (response && (response.status === 200 && response.success)) {
          const formattedMessages: MessageData[] = response.messages.map((msg: BackendMessage) => ({
            id: msg._id,
            text: msg.text,
            time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: msg.sender._id === myUserId, 
            senderId: msg.sender._id,
          }));
          setMessages(formattedMessages);
        }
      } catch (err) {
        console.log("Произошла ошибка получения сообщений с сервера: " + err);
      }
    }

    
    fetchMessage()

  }, [activeChatId, myUserId]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !myUserId) return;
    if (!activeChatId || !socketRef.current) return;

    try {
      const response = await socketRef.current.timeout(5000).emitWithAck('send_message', {
        message: inputText.trim(), chatId: activeChatId, sender: myUserId
      })

      if (response && (response.status === 200 || response.success)) {
        console.log("[front] Сообщение успешно доставлено через сокет", response.message)

        const clientMessage: MessageData = {
          id: response.message._id,
          text: response.message.text,
          time: response.message.time,
          isMe: true,
          senderId: response.message.senderId,
        };

        setMessages((prev) => [...prev, clientMessage]);

        setInputText('')
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