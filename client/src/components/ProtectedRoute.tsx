import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'

interface JwtPayload {
  userId: string;
}

export const ProtectedRoute: React.FC = () => {
    const token = localStorage.getItem('token');
    let isAuth = false;

    if (token) {
        try {
            const decoded = jwtDecode<JwtPayload>(token)
            if (decoded) isAuth = true;
        } catch (err) {
            console.log("Ошибка декодирования jwt токена");
        }
    }

    

    if (!isAuth) {
        return <Navigate to="/" replace />
    }

    return <Outlet />;
}