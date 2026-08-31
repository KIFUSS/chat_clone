import { useEffect, useState } from "react";
import type { ChatData, UserDataBackend } from "../types";
import type { Socket } from "socket.io-client";
import { checkIsPhone } from "@/utils";
import type { useSearchProps, useSearchReturn } from "../types";




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

        const delayDebounceFn = setTimeout(() => {
            if (socket !== null) {
                const globalSearchUser = async () => {
                    try {
                        const response = await socket.timeout(5000).emitWithAck('global_search_user_by_phone', inputSearchVal);

                        if (response && (response.status === 200 || response.success)) {
                            setGlobalSearchResult(response.globalSearchResult)
                        }
                    } catch (err) {
                        console.log("Ошибка глобального поиска : " + err);
                    }
                }

                globalSearchUser();
            }
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [inputSearchVal, chats, socket])

    return {
        filteredChats,
        globalSearchResult,
    };

}