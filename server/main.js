import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import User from './models/User.js'
import Message from './models/Message.js'
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
        // const allUsers = await User.find({});
        // console.log('=== СПИСОК ПОЛЬЗОВАТЕЛЕЙ В БД ===');
        // console.log(allUsers);
        // console.log('=================================');
        
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
    const { senderId, chatId, text } = req.body;

    if (!senderId || !chatId || !text.trim()) {
        res.status(400).json({error: "Все поля обязательны для отправки сообщения "});
    }

    try {
        const newMessage = new Message({
            sender: senderId,
            chatId,
            text: text.trim()
        })

        await newMessage.save();
        await newMessage.populate('sender', 'name');

        console.log(newMessage)


        // Отправляет новое сообщение в сокет комнату по айди чата
        io.to(chatId).emit("receive_message", {
            id: newMessage._id,
            text: newMessage.text,
            time: new Date(newMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: null,
            senderId: newMessage.sender._id,
        })

        console.log(`[backend] Сообщение сохранено в бд для чата ${chatId}`);

        return res.status(200).json({success: true, message: newMessage});

    } catch (err) {
        res.status(500).json({error: "Ошибка отправки сообщения"});
    }
})


io.on("connection", (socket) => {
    console.log(`Пользователь подключился к сокету ${socket.id}`);

    socket.on('join_chat', (chatId) => {
        socket.join(chatId);
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