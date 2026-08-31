import type { Socket } from "socket.io-client";


export const globalSearchByPhone = async (socket: Socket, phone: string) => {
    return await socket.timeout(5000).emitWithAck('global_search_user_by_phone', phone);
}

export const globalSearchByLogin = async (socket: Socket, login: string) => {
    const cleanedLogin = login.startsWith("@") ? login.slice(1) : login;
    return await socket.timeout(5000).emitWithAck('global_search_user_by_login', cleanedLogin);
}