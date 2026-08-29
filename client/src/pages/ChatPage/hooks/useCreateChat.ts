import { isValidObjectBDId } from "@/utils";
import { useState } from "react";
import type { useCreateChatProps, useCreateChatReturn, createChatHandler } from "../types";


export const useCreateChat = ({socket}: useCreateChatProps): useCreateChatReturn => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error,  setError]    = useState<string | null>(null);

    const createChatHandler: createChatHandler = async (myUserId, partnerId) => {
        if (!isValidObjectBDId(myUserId) || !isValidObjectBDId(partnerId)) {
            console.log("Некорректный ID участников")
            setError('Некорректный ID пользователя');
            return;
        } 

        setIsLoading(true);
        setError(null);

        try {
            const response = await socket?.timeout(5000).emitWithAck('create_chat', {myUserId, partnerId});
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