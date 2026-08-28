import {createServer} from 'http';
import {Server} from 'socket.io';
import dotenv from 'dotenv'
import { connectDB } from './config/db';
import { initSocketManager } from './socket';
import app from './app.js';

dotenv.config();

const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        method: ['GET', 'POST']
    }
})

connectDB();
initSocketManager();

httpServer.listen(PORT, () => {
    console.log(`Сервер клона телеграма запущен на http://localhost:${PORT}`);
});


