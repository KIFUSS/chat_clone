import { useState, useEffect, useRef, useMemo } from 'react';
import { jwtDecode } from 'jwt-decode'; // Наш импортированный декодер токенов
import { type BackendMessage, type ChatData, type MessageData, type ResponseFetchMessage, type JwtPayload} from '../types';
import {io, Socket} from 'socket.io-client'
import { useAuth } from '@/context/AuthContext';
import { updateLastMessageForChat } from '../utils/chatHelper';


export const useChat = () => {
  const [activeChatId, setActiveChatId] = useState<string>('');
  const [inputText, setInputText] = useState<string>('');
  const [chats, setChats] = useState<ChatData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);
  
  // get token for context
  const {token} = useAuth();  

  const currentChat = chats.find((c) => c.id === activeChatId) || chats[0];

  useEffect(() => {
    socketRef.current = io("http://localhost:5000", {
      withCredentials: true,
      auth: {
        token: token
      }
    })
    

    const loadUsersChats = async () => {

      if (!socketRef.current || !socketRef.current.connected) return;

      try {
        const response = await socketRef.current.timeout(5000).emitWithAck('get_user_chats');

        console.log(response)

        if (response && !response.success) {
          console.log(`[frontend] Ошибка при запросе чатов: ${response.error}`)
        }

        if (response && response.success) {
          const formatterChats: ChatData[] = response.chats.map((chat: any) => {
            const partner = chat.participants.find((p: any) => p._id !== response.myUserId);

            return {
              id: chat._id,
              name: partner?.name || 'Удаленный аккаунт',
              avatarText: partner?.avatar || '',
              lastMessage: chat.lastMessage?.text || 'Нет сообщений',
              time: '14:15',
              isOnline: partner.isOnline,
              participants: chat.participants,
            };
          })

          setChats(formatterChats)

          if (formatterChats.length > 0 && !activeChatId) {
            setActiveChatId(formatterChats[0].id);
          }


        }        
      } catch (err) {
        console.error("Не удалось загрузить чаты по сокету:", err);
      }
    }

    socketRef.current.on('connect', () => {
      loadUsersChats();
    })

    socketRef.current.on('connect_error', (err) => {
        console.error('❌ Ошибка подключения к сокету:', err.message);
    });

    socketRef.current.on("receive_message", (newMessage: MessageData) => {
        setMessages((prev) => [...prev, newMessage]);
    })

    socketRef.current.on('user_status_changed', (data) => {
      setChats((prev) => {
        return prev.map((chat) => {
          const hasParticipant = chat.participants.some(p => p._id === data.userId);

          if (hasParticipant) {
            console.log('меняем')
            return {  
              ...chat,
              isOnline: data.isOnline,
            };
          }
              
          return chat;
        });
      });



      console.log(`Пользователь ${data.userId} теперь ${data.isOnline ? 'в сети' : 'не в сети'}`);
    })

    

    return () => {
      socketRef.current?.disconnect();
    }
  }, [])

  // получение сообщений
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
            isMe: msg.sender._id === response.myId, 
            senderId: msg.sender._id,
          }));
          setMessages(formattedMessages);

          
        }
      } catch (err) {
        console.log("Произошла ошибка получения сообщений с сервера: " + err);
      }
    }

    
    fetchMessage()

  }, [activeChatId]);

  // отправка сообщений
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    if (!activeChatId || !socketRef.current) return;

    try {
      const response = await socketRef.current.timeout(5000).emitWithAck('send_message', {
        message: inputText.trim(), chatId: activeChatId
      })

      if (response && (response.status === 200 || response.success)) {
        const clientMessage: MessageData = {
          id: response.message._id,
          text: response.message.text,
          time: response.message.time,
          isMe: true,
          senderId: response.message.senderId,
        };

        setMessages((prev) => [...prev, clientMessage]);
        // Обновляем поле последнего сообщения у чата
        setChats((prevChats) => updateLastMessageForChat(prevChats, activeChatId, response.message.text));
        setInputText('')
      }
    } catch (err) {
      console.error('Ошибка при отправке сообщения', err);
    }
  };

  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
  };



  return {
    chats: chats,
    activeChatId,
    currentChat,
    currentMessages: messages, // Передаем наш чистый массив сообщений из базы данных
    inputText,
    setInputText,
    searchQuery,
    setSearchQuery,
    handleSendMessage,
    handleSelectChat,
    // handleCreateChat,
    socket: socketRef.current,
  };
};