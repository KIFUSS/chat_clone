import mongoose from 'mongoose';
import User from './models/User.js'; // Убедитесь в правильности пути к модели User
import Chat from './models/Chat.js';
import dotenv from 'dotenv';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Подключено к MongoDB для сидинга...');

    // 1. Очищаем старые чаты и сообщения, чтобы не было битых ID
    await Chat.deleteMany({});
    console.log('Старые чаты удалены.');

    // 2. Находим реальных пользователей из вашей коллекции User
    // Убедитесь, что вы предварительно зарегистрировали хотя бы 2-3 аккаунта через ваш Auth Flow!
    const users = await User.find().limit(3);

    if (users.length < 2) {
      console.log('❌ Ошибка: Для создания чата нужно зарегистрировать хотя бы 2 пользователей в приложении!');
      process.exit(1);
    }

    // 3. Создаем тестовый чат между первым и вторым пользователем
    const testChat = new Chat({
      participants: [users[0]._id, users[1]._id]
    });

    await testChat.save();
    console.log(`✅ Успешно создан тестовый чат между ${users[0].name} и ${users[1].name}!`);

    process.exit(0);
  } catch (err) {
    console.error('Ошибка сидинга:', err);
    process.exit(1);
  }
};

seedDatabase();