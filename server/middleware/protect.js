import jwt from 'jsonwebtoken'


export const protect = async (req, res, next) => {
    try {
        console.log("[backend] Начала проверку токена в куки")
        if (!req.cookies.token) {
            console.log('Не авторизован')
            return res.status(401).json({message: 'Не авторизован, токен отсутствует'});
        }
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;

        next();
    } catch (err) {
        return res.status(401).json({message: 'Неверный или просроченый токен'});
    }
}