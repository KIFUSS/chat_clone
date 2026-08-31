import User from "../models/User.js";
import jwt from 'jsonwebtoken'

const smsStorage = {};


const sendCookieToken = (token, res, statusCode, data) => {
    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 30 * 24 * 60 * 60 * 1000
    })

    return res.status(statusCode).json(data);
}

const createToken = (userId) => {
    if (!userId) return;

    return jwt.sign(
        { userId: userId},
        process.env.JWT_SECRET,
        {expiresIn: '30d'}
    )
}

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
    } else {
        delete smsStorage[phone];

        try {
            console.log("[backend] Код верный проверяем существование юзера")
            const existingUser = await User.findOne({phone});

            if (!existingUser) {
                return res.status(200).json({success: true, isNewUser: true, token: ''});
            }
            
            const isNewUser = !existingUser;
            const token = createToken(existingUser._id);

            console.log(`[backend] Создали token: ${token}`)

            console.log(`[backend] Пользователь ${phone} провер. Новый? ${isNewUser}`)

            return sendCookieToken(token, res, 200, {
                success: true,
                isNewUser: isNewUser,
                token: token,
            })

        } catch(err) {
            return res.status(500).json({error: `Ошибка при поиске пользователя в бд: ${err}`});
        }
    }

   
}

export const register = async (req, res) => {
    const {phone, name, login} = req.body;
    
    if (!phone || !name || !login) {
        return res.status(400).json({error: 'Некорректные данные для авторизации'});
    }

    try {
        const existingUser = await User.findOne({phone});

        if (existingUser) {
            return res.status(400).json({error: 'Этот номер уже зарегистрирован'});
        }

        const newUser = new User({
            phone,
            name: name.trim(),
            login: login.trim(),
        })

        await newUser.save();

        const token = createToken(newUser._id);

        return sendCookieToken(token, res, 200, {
            success: true,
            message: 'Пользователь успешно зарегистрирован',
            user: newUser,
            token: token,
        })
    } catch(err) {
        return res.status(500).json({error: 'Не удалось сохранить пользователя в базу данныз'})
    }
}


export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({message: 'Пользователь не найден'});
        }

        return res.status(200).json({
            success: true,
            user: user,
            token: req.cookies.token,
        });
    } catch(err) {
        console.log("Ошибка в роуте /me");
        return res.status(500).json({message: 'Ошибка веривикации юзера на сервере'});
    }
}