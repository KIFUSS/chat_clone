import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import User from './models/User.js'
import Message from './models/Message.js'
import Chat from './models/Chat.js'
import jwt from 'jsonwebtoken'
import {createServer} from 'http'
import {Server} from 'socket.io'



dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGO_URI

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        method: ['GET', 'POST']
    }
})


mongoose.connect(mongoUri)
    .then(async () => {
        const allUsers = await User.find({});
        console.log('=== СПИСОК ПОЛЬЗОВАТЕЛЕЙ В БД ===');
        console.log(allUsers);
        console.log('=================================');

        
        
        console.log('Успешно подключились к локальной базе данных MOngodb')
    })
    .catch((err) => console.error('Ошибка подключения к бд', err))

const smsStorage = {};

app.post('/api/auth/send-code', (req, res) => {
    const {phone} = req.body;

    console.log(phone)

    if (!phone) {
        return res.status(400).json({error: 'Номер телефона обязателен'});
    }

    const generateCode = Math.floor(10000 + Math.random() * 90000).toString();
    smsStorage[phone] = generateCode;

    console.log(`[Backend] Sms-code for phone ${phone}: ${generateCode}`);

    return res.status(200).json({
        success: true,
        message: 'Код успешно сгенерирован'
    });
});

app.post("/api/auth/verify-code", async (req, res) => {
    const {phone, code} = req.body;

    if (!phone || !code) {
        return res.status(400).json({error: 'Телефон и код обязательны'});
    }

    const validCode = smsStorage[phone];
    if (!validCode || validCode !== code) {
        return res.status(400).json({error: 'Неверный СМС - код'});
    }

    delete smsStorage[phone];

    try {
        const existingUser = await User.findOne({phone});
        const isNewUser = !existingUser;

        console.log(`[backend] Пользователь ${phone} провер. Новый? ${isNewUser}`)

        let token = null;
        if (existingUser) {
            token = jwt.sign(
                { userId: existingUser._id},
                process.env.JWT_SECRET,
                {expiresIn: '30d'}
            );
        }

        return res.status(200).json({
            success: true,
            isNewUser: isNewUser,
            token: token,
        });

    } catch(err) {
        return res.status(500).json({error: 'Ошибка при поиске пользователя в бд'});
    }

    
})

app.post('/api/auth/register', async (req, res) => {
    const {phone, name} = req.body;

    if (!phone || !name.trim()) {
        return res.status(400).json({error: 'Телефон и имя обязательны для регистрации'});
    }

    try {
        const existingUser = await User.findOne({phone});

        if (existingUser) {
            res.status(400).json({error: 'Этот номер уже зарегистрирован'});
        }

        const newUser = new User({
            phone,
            name: name.trim()
        })

        await newUser.save();

        console.log(`[backend] always save new user in bd ${name}, ${phone}`);

        const token = jwt.sign(
            { userId: newUser._id},
            process.env.JWT_SECRET,
            {expiresIn: '30d'}
        );

        return res.status(201).json({
            success: true,
            message: 'Пользователь успешно зарегистрирован',
            token: token,
        });
    } catch(err) {
        return res.status(500).json({error: 'Не удалось сохранить пользователя в базу данныз'})
    }
})


app.get('/api/messages/:chatId', async (req, res) => {
    const { chatId } = req.params;

    try {
        const messages = await Message.find({ chatId })
            
        if (!messages || messages.length === 0) {
            return res.status(200).json({success: true, messages: []})
        }

        const populatedMessages = await Message.find({chatId})
            .populate('sender', 'name')
            .sort({createdAt: 1});

        return res.status(200).json({success: true, messages: populatedMessages})
    } catch (err) {
        console.error('Ошибка внутри Message.find:', err); // Выводим реальную ошибку в консоль сервера!
        return res.status(500).json({ error: "Ошибка получения сообщений для этого чата" });
    }
})

app.post('/api/messages', async (req, res) => {
    
})


const checkIsPhone = (phone) => {
    if (phone.trim() === '') return false;
    const cleanedPhone = phone.replace("/\D/g", '');
    return cleanedPhone.length === 11 && (cleanedPhone.startsWith('7') || cleanedPhone.startsWith('8'));
} 


io.on("connection", (socket) => {
    console.log(`Пользователь подключился к сокету ${socket.id}`);


    socket.on("global_search_user_by_phone", async (phone, callback) => {
        try {
            if (phone.trim() === '' || !checkIsPhone(phone)) {
                return callback({
                    status: 500,
                    success: false,
                    error: 'Некоректное значение поиска',
                })
            }

            phone = "+" + phone;

            const users = await User.find({phone})

            return callback({status: 200, success: true, globalSearchResult: users});
        } catch (err) {
            return callback({status: 500, success: false, error: 'Ошибка глобального поиска'})
        }
    })

        // 1. ПОЛУЧЕНИЕ ВСЕХ ЧАТОВ ПОЛЬЗОВАТЕЛЯ
    socket.on('get_user_chats', async (userId, callback) => {
        try {
            if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
                return callback({ success: false, error: 'Некорректный userId' });
            }

            // Находим все чаты, где пользователь является участником
            const userChats = await Chat.find({ participants: userId })
                .populate('participants', 'name') // Достаем из коллекции User имя и аватар
                .populate('lastMessage')                // Достаем текст последнего сообщения
                .sort({ updatedAt: -1 });               // Свежие чаты перемещаем наверх


            return callback({ success: true, chats: userChats });
        } catch (err) {
            console.error(err);
            return callback({ success: false, error: err.message });
        }
    });

    // 2. СОЗДАНИЕ НОВОГО ЧАТА (ИЛИ ВОЗВРАТ СУЩЕСТВУЮЩЕГО)
    socket.on('create_chat', async ({ myUserId, partnerId }, callback) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(myUserId) || !mongoose.Types.ObjectId.isValid(partnerId)) {
                return callback({ success: false, error: 'Некорректные ID участников' });
            }

            // Проверяем, нет ли уже чата между этими двумя пользователями
            let chat = await Chat.findOne({
                participants: { $all: [myUserId, partnerId] }
            }).populate('participants', 'name').populate('lastMessage');

            // Если чат уже есть, просто возвращаем его фронтенду
            if (chat) {
                return callback({ success: true, chat });
            }

            // Если чата нет — создаем в базе данных новый документ
            const newChat = new Chat({
                participants: [myUserId, partnerId]
            });
            await newChat.save();

            // Делаем populate для только что созданного чата перед отправкой
            chat = await Chat.findById(newChat._id).populate('participants', 'name');

            // (Опционально) Оповещаем второго пользователя через сокеты, если он в сети
            // socket.to(partnerId).emit('chat_created', chat);

            return callback({ success: true, chat });
        } catch (err) {
            console.error(err);
            return callback({ success: false, error: err.message });
        }
    });


    socket.on('join_chat', async (chatId, callback) => {
        if (!chatId || !mongoose.Types.ObjectId.isValid(chatId)) {
            // Обязательно пишем return, чтобы функция СРАЗУ завершилась и код не шёл ниже
            return callback({
                status: 400,
                success: false,
                error: "Некорректный формат идентификатора чата (chatId)"
            });
        }

        socket.join(chatId);

        try {
            // Делаем ОДИН запрос сразу со связями и сортировкой
            // Передаем в populate просто строку 'sender', чтобы получить объект пользователя целиком (включая _id)
            const populatedMessages = await Message.find({ chatId })
                .populate('sender') 
                .sort({ createdAt: 1 });

            //console.log(populatedMessages); // для отладки

            // Отправляем ОДИН ответ, независимо от того, пустой массив или нет
            return callback({
                status: 200,
                success: true,
                messages: populatedMessages,
            });

        } catch (err) {
            console.error(err);
            return callback({
                status: 500,
                success: false,
                error: `Произошла ошибка при получении сообщений выбранного чата: ${err.message}`
            });
        }

        console.log(`Сокет ${socket.id} вошел в комнату ${chatId}`)
    })

    socket.on('send_message', async (data, callback) => {
        const {message, chatId, sender} = data;

        if (!message || !chatId || !sender) {
            callback({
                    status: 500,
                    success: false,
                    error: 'Получены некоректные данные'
            })
        }

        try {
            const newMessage = new Message({
                sender: sender,
                chatId: chatId,
                text: message
            })

            await newMessage.save();
            await newMessage.populate('sender', 'name');


            const formattedMessage = {
                id: newMessage._id,
                text: newMessage.text,
                time: new Date(newMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isMe: null,
                senderId: newMessage.sender._id,
            }

            // Отправляет новое сообщение в сокет комнату по айди чата
            socket.to(chatId).emit("receive_message", formattedMessage);

            console.log(`[backend] Сообщение сохранено в бд для чата ${chatId}`);

            if (typeof callback === 'function') {
                callback({status: 200, success: true, message: formattedMessage})
            }
            
        } catch (err) {
            console.log(err)

            if (typeof callback === 'function') {
                callback({
                    status: 500,
                    success: false,
                    error: 'Не удалось сохранить сообщение'
                })
            }
        }
    })

    socket.on("disconnect", () => {
        console.log("Пользователь отключился от сокета");
    })
})

httpServer.listen(PORT, () => {
    console.log(`Сервер клона телеграма запущен на http://localhost:${PORT}`);
});