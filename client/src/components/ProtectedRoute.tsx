import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute: React.FC = () => {
    const isAuth = !!localStorage.getItem('token');

    if (!isAuth) {
        return <Navigate to="/" replace />
    }

    return <Outlet />;
}