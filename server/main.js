import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import User from './models/User.js'


dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGO_URI


mongoose.connect(mongoUri)
    .then(() => console.log('Успешно подключились к локальной базе данных MOngodb'))
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

        console.log(`[backend] Код для ${phone} успешно подтверждён!`);

        return res.status(200).json({
            success: true,
            isNewUser: isNewUser
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

        return res.status(201).json({
            success: true,
            message: 'ПОльзователь успешно зарегистрирован'
        });
    } catch(err) {
        return res.status(500).json({error: 'Не удалось сохранить пользователя в базу данныз'})
    }
})

app.listen(PORT, () => {
    console.log(`Сервер клона телеграма запущен на http://localhost:${PORT}`);
});