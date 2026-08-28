import { useState } from "react";
import type { ChatData } from "../types";
import type { Socket } from "socket.io-client";

interface useSearchProps {
    inputSearchVal: string;
    chats: ChatData[];
    socket: Socket | null;
}

interface useSearchReturn {
    filteredChats: ChatData[];
    globalSearchResult: ChatData[];
}


const checkIsPhone = (phone: string) => {
    if (phone.trim() === '') return false;
    const cleanedPhone = phone.replace("/\D/g", '');
    return cleanedPhone.length === 11 && (cleanedPhone.startsWith('7') || cleanedPhone.startsWith('8'));
}

export const useSearch = ({ inputSearchVal, chats, socket }: useSearchProps): useSearchReturn => {
    const [globalSearchResult, setGlobalSearchResult] = useState<ChatData[]>([]);

    if (inputSearchVal.trim() !== '') {
        if (!checkIsPhone(inputSearchVal)) {
            console.log('В строке не телефон')
            const filteredChats = chats.filter((chat) =>
                chat.name.toLowerCase().includes(inputSearchVal.toLowerCase())
            );

            return {
                filteredChats,
                globalSearchResult,
            }
        } else {
            if (socket !== null) {
                const globalSearchUser = async () => {
                    try {
                        const response = await socket.timeout(5000).emitWithAck('global_search_user_by_phone', inputSearchVal);

                        console.log('Ежи ищем по номеру')
                        console.log(response)

                        if (response && (response.status === 200 || response.success)) {
                            console.log('уе успех')
                            setGlobalSearchResult(response.globalSearchResult)
                        }


                    } catch (err) {
                        console.log("Ошибка глобального поиска : " + err);
                    }
                }

                globalSearchUser();

                return {
                    filteredChats: [],
                    globalSearchResult: globalSearchResult
                };
            }
        }
    }

    

    return {
        filteredChats: chats,
        globalSearchResult: []
    };

    

    
    
}