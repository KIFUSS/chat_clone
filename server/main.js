import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

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

app.post("/api/auth/verify-code", (req, res) => {
    const {phone, code} = req.body;

    if (!phone || !code) {
        return res.status(400).json({error: 'Телефон и код обязательны'});
    }

    const validCode = smsStorage[phone];


    if (!validCode || validCode !== code) {
        return res.status(400).json({error: 'Неверный СМС - код'});
    }

    delete smsStorage[phone];

    console.log(`[backend] Код для ${phone} успешно подтверждён!`);

    return res.status(200).json({
        success: true,
        isNewUser: true
    });
})

app.listen(PORT, () => {
    console.log(`Сервер клона телеграма запущен на http://localhost:${PORT}`);
});