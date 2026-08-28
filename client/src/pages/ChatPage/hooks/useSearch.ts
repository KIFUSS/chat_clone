import { useEffect, useState } from "react";
import type { ChatData, UserDataBackend } from "../types";
import type { Socket } from "socket.io-client";

interface useSearchProps {
    inputSearchVal: string;
    chats: ChatData[];
    socket: Socket | null;
}

interface useSearchReturn {
    filteredChats: ChatData[];
    globalSearchResult: UserDataBackend[];
}


const checkIsPhone = (phone: string) => {
    if (phone.trim() === '') return false;
    const cleanedPhone = phone.replace("/\D/g", '');
    return cleanedPhone.length === 11 && (cleanedPhone.startsWith('7') || cleanedPhone.startsWith('8'));
}

export const useSearch = ({ inputSearchVal, chats, socket }: useSearchProps): useSearchReturn => {
    const [globalSearchResult, setGlobalSearchResult] = useState<UserDataBackend[]>([]);
    const [filteredChats, setFilteredChats] = useState<ChatData[]>(chats)

    useEffect(() => {
        if (inputSearchVal.trim() === "") {
            setFilteredChats(chats);
            setGlobalSearchResult([]);
            return;
        }

        if (!checkIsPhone(inputSearchVal)) {
            const filtered: ChatData[] = chats.filter((chat) =>
                chat.name.toLowerCase().includes(inputSearchVal.toLowerCase())
            );

            setFilteredChats(filtered);
            setGlobalSearchResult([]);
            return;
        }

        if (socket !== null) {
            const globalSearchUser = async () => {
                try {
                    const response = await socket.timeout(5000).emitWithAck('global_search_user_by_phone', inputSearchVal);

                    console.log('Ежи ищем по номеру')

                    if (response && (response.status === 200 || response.success)) {
                        console.log('уе успех')
                        setGlobalSearchResult(response.globalSearchResult)
                    }
                } catch (err) {
                    console.log("Ошибка глобального поиска : " + err);
                }
            }

            globalSearchUser();
        }
    }, [inputSearchVal, chats, socket])

    return {
        filteredChats,
        globalSearchResult,
    };

}