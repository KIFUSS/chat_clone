import jwt from 'jsonwebtoken'


export const protect = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        

        if (!token) {
            return res.status(401).json({message: 'Не авторизован, токен отсутствует'});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.userId;

        next();
    } catch (err) {
        return res.status(401).json({message: 'Неверный или просроченый токен'});
    }
}