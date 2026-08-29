import User from "../models/User.js";
import jwt from 'jsonwebtoken'

const smsStorage = {};

export const sendCode = async (req, res) => {
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
}

export const verifyCode = async (req, res) => {
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
}

export const register = async (req, res) => {
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
}