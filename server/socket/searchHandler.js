import User from "../models/User";

export const registerSearchHandler = (io, socket) => {
    socket.on("global_search_user_by_phone", async (phone, callback) => {
        try {
            if (phone.trim() === '' || !checkIsPhone(phone)) {
                return callback({
                    status: 500,
                    success: false,
                    error: 'Некоректное значение поиска',
                })
            }

            phone = "+" + phone;

            const users = await User.find({phone})

            return callback({status: 200, success: true, globalSearchResult: users});
        } catch (err) {
            return callback({status: 500, success: false, error: 'Ошибка глобального поиска'})
        }
    })
}