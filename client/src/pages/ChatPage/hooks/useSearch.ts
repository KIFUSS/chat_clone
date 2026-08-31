import { useEffect, useState } from "react";
import type { ChatData, UserDataBackend } from "../types";
import type { Socket } from "socket.io-client";
import { checkIsPhone } from "@/utils";
import type { useSearchProps, useSearchReturn } from "../types";
import { globalSearchByLogin, globalSearchByPhone } from "./service/searchService";




export const useSearch = ({ inputSearchVal, chats, socket }: useSearchProps): useSearchReturn => {
    const [globalSearchResult, setGlobalSearchResult] = useState<UserDataBackend | null>(null);
    const [filteredChats, setFilteredChats] = useState<ChatData[]>(chats)

    useEffect(() => {
        if (inputSearchVal.trim() === "") {
            console.log(1);
            setFilteredChats(chats);
            setGlobalSearchResult(null);
            return;
        }

        if (!checkIsPhone(inputSearchVal) && !inputSearchVal.startsWith("@")) {
            console.log('2')
            if (chats.length > 0) {
                const filtered: ChatData[] = chats.filter((chat) =>
                    chat.name.toLowerCase().includes(inputSearchVal.toLowerCase())
                );

                setFilteredChats(filtered);
                setGlobalSearchResult(null);
                return;
            }

            setFilteredChats(chats);
            setGlobalSearchResult(null);
            return;            
        }

        console.log(3)

        const delayDebounceFn = setTimeout(() => {
            if (socket !== null) {
                const globalSearchUser = async () => {
                    try {
                        let response;

                        if (inputSearchVal.startsWith("@")) {
                            console.log('[FRONTEND] START SEARCH BY LOGIN....');
                            response = await globalSearchByLogin(socket, inputSearchVal);
                        } else if (checkIsPhone(inputSearchVal)) {
                            console.log('[FRONTEND] START SEARCH BY PHONE....');
                            response = await globalSearchByPhone(socket, inputSearchVal);
                            console.log(response)
                        }

                        if (response && (response.status === 404 && !response.success)) {
                            // not found
                            setGlobalSearchResult(null);
                            setFilteredChats(chats);
                            return;
                        }

                        if (response && (response.status === 200 && response.success)) {
                            setGlobalSearchResult(response.user)
                            setFilteredChats([]);
                            return;
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