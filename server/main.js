import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import User from './models/User.js'
import Message from './models/Message.js'
import jwt from 'jsonwebtoken'


dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGO_URI


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

        console.log(`[backend] Сообщение сохранено в бд для чата ${chatId}`);

        return res.status(200).json({success: true, message: newMessage});

    } catch (err) {
        res.status(500).json({error: "Ошибка отправки сообщения"});
    }
})

app.listen(PORT, () => {
    console.log(`Сервер клона телеграма запущен на http://localhost:${PORT}`);
});