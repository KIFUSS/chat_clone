import React, {createContext, useContext, useEffect, useState } from 'react'


interface AuthContextType {
    myUserId: string | null;
    isLoading: boolean;
    checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [myUserId, setMyUserId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const checkAuth = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/auth/me", {
                method: 'GET',
                credentials: 'include'  
            })

            console.log("Проверка авторизации в контексте...")
            console.log(response)

            if (response.ok) {
                console.log('Авторизован')
                const data = await response.json();
                setMyUserId(data.user.id || data.user._id);
            } else {
                console.log('Не авторизован')
                setMyUserId(null)
            }
        } catch (err) {
            console.log('Ошибка проверки авторизации', err);
        } finally {
            setIsLoading(false);
        }
    }
    
    useEffect(() => {
        checkAuth();
    }, [])

    return (
        <AuthContext.Provider value={{myUserId, isLoading, checkAuth}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth need used in inside AuthProvider');
    return context;
}