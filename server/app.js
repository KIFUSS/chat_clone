import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js'
import cookieParser from 'cookie-parser';


const app = express();

// Глобальные мидлвары
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);

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


// Экспортируем только настроенный объект app (без запуска!)
export default app;