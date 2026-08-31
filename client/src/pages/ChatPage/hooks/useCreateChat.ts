import { isValidObjectBDId } from "@/utils";
import { useState } from "react";
import type { useCreateChatProps, useCreateChatReturn, createChatHandler } from "../types";


export const useCreateChat = ({socket}: useCreateChatProps): useCreateChatReturn => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error,  setError]    = useState<string | null>(null);

    const createChatHandler: createChatHandler = async (partnerId) => {
        if (!isValidObjectBDId(partnerId)) {
            console.log("Некорректный ID партнера")
            setError('Некорректный ID партнера, для создания чата');
            return;
        } 

        console.log(`[creeateChatHandler]: ${partnerId}`)

        setIsLoading(true);
        setError(null);

        try {
            const response = await socket?.timeout(5000).emitWithAck('create_chat', {partnerId});
            console.log(response)

            if (response && response.success) {
                console.log('Успешное создание нового чата');
            } else {
                setError(`Ошибка создания переписки: ${response.error}`)
                return;
            }
        } catch (err) {
            setError(`Ошибка при создании нового чата: ${err}`);
        }
    }

    return {
        createChatHandler,
        isLoading,
        error,
    }


}