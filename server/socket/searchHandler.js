import User from "../models/User.js";
import { checkIsPhone } from "../utils.js";

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

            const searchResult = await User.findOne({phone})

            if (!searchResult) {
                return callback({status: 404, success: true, error: 'Пользователя с таким номером не найдено'});
            }

            return callback({status: 200, success: true, user: searchResult});
        } catch (err) {
            return callback({status: 500, success: false, error: `Ошибка глобального поиска: ${err}` })
        }
    })

    socket.on("global_search_user_by_login", async (login, callback) => {
        try {
            if (login.trim() === "") {
                return callback({
                    status: 500,
                    success: false,
                    error: `Неккоректное значение поиска`
                })
            }

            const searchResult = await User.findOne({login});

            if (!searchResult) {
                return callback({status: 404, success: true, error: 'Пользователя с таким логином не найдено'});
            }

            return callback({status: 200, success: true, user: searchResult})

        } catch (err) {
            return callback({status: 500, success: false, error: `Ошибка глобального поиска: ${err}`})
        }
    })
}