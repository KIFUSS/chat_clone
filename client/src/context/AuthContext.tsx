import type { UserDataBackend } from '@/pages/ChatPage/types';
import React, {createContext, useContext, useEffect, useState } from 'react'


interface AuthContextType {
    myUserId: string | null;
    isLoading: boolean;
    checkAuth: () => Promise<void>,
    token: string | null,
    user: UserDataBackend | null,
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [myUserId, setMyUserId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<UserDataBackend | null>(null);

    const checkAuth = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/auth/me", {
                method: 'GET',
                credentials: 'include'  
            })

            if (response.ok) {
                const data = await response.json();
                
                setUser(data.user);
                setMyUserId(data.user.id || data.user._id);
                setToken(data.token);
            } else {
                setMyUserId(null)
                setToken(null)
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
        <AuthContext.Provider value={{myUserId, isLoading, checkAuth, token, user}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth need used in inside AuthProvider');
    return context;
}