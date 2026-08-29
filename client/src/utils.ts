import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "./pages/ChatPage/types";

// Регулярка проверяет корректные ли переданные айди.
export const isValidObjectBDId = (id: string): boolean => {
    return /^[0-9a-fA-F]{24}$/.test(id);
}

export const checkIsPhone = (phone: string) => {
    if (phone.trim() === '') return false;
    const cleanedPhone = phone.replace("/\D/g", '');
    return cleanedPhone.length === 11 && (cleanedPhone.startsWith('7') || cleanedPhone.startsWith('8'));
}


export const getMyUserId = () => {
    const token = localStorage.getItem('token') || '';

    if (!token) return false;

    try {
        const decoded = jwtDecode<JwtPayload>(token);
        return decoded.userId; 
    } catch (e) {
        console.error('Ошибка декодирования JWT токена', e);
        return '';
    }
}