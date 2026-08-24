import { type ChatData, type MessageRepository } from './types';

export const MOCK_CHATS: ChatData[] = [
  { id: '1', name: 'Алексей Программист', avatarText: 'АП', lastMessage: 'Слушай, а база данных MongoDB реально быстро поднялась!', time: '14:15' },
  { id: '2', name: 'Дизайн Студия', avatarText: 'ДС', lastMessage: 'Макет авторизации клона Telegram утвержден, переходим к чатам.', time: '12:40' },
  { id: '3', name: 'Мама', avatarText: 'ММ', lastMessage: 'Ты покушал? Код свой весь день пишешь сидишь.', time: 'Вчера' },
];

export const MOCK_MESSAGES_REPOSITORY: MessageRepository = {
  '1': [
    { id: 'm1', text: 'Слушай, а база данных MongoDB реально быстро поднялась после перезагрузки!', time: '14:15', isMe: false },
    { id: 'm2', text: 'Да, у winget стабильная LTS-версия ставится без проблем. Теперь пишем фронтенд чатов!', time: '14:16', isMe: true },
  ],
  '2': [
    { id: 'm3', text: 'Привет! Мы закончили редизайн главного экрана чатов. Как тебе фиолетовые акценты?', time: '12:35', isMe: false },
    { id: 'm4', text: 'Не, давайте придерживаться оригинальной темной темы Telegram, цинк и скай-блу.', time: '12:40', isMe: true },
  ],
  '3': [
    { id: 'm5', text: 'Ты покушал? Код свой весь день пишешь сидишь.', time: '11:00', isMe: false },
  ],
};