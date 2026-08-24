import {useState} from 'react'
import type { ChatData } from '../components/SideBar/ChatListItem'

export const useChat = () => {
    const [activeChatId, setActiveChatId] = useState<string | null>(null);

    const [chats] = useState<ChatData[]>([
        {
        id: '1',
        name: 'Алексей Программист',
        avatarText: 'АП',
        lastMessage: 'Слушай, а база данных MongoDB реально быстро поднялась!',
        time: '14:15',
        },
        {
        id: '2',
        name: 'Дизайн Студия',
        avatarText: 'ДС',
        lastMessage: 'Макет авторизации клона Telegram утвержден, переходим к чатам.',
        time: '12:40',
        },
        {
        id: '3',
        name: 'Мама',
        avatarText: 'ММ',
        lastMessage: 'Ты покушал? Код свой весь день пишешь сидишь.',
        time: 'Вчера',
        },
        {
        id: '4',
        name: 'Тестовый чат',
        avatarText: 'ТЧ',
        lastMessage: 'Проверка длинного превью сообщения для тестирования класса truncate...',
        time: '20.08',
        }
    ])

    const handleSelectChat = (id: string) => {
        setActiveChatId(id)
    }

    return {
        chats,
        activeChatId,
        handleSelectChat
    }
}