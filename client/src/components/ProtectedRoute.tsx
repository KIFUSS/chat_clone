import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const ProtectedRoute: React.FC = () => {
    const {myUserId, isLoading, checkAuth} = useAuth();

    if (isLoading) {
        return <div>Загрузка....</div>
    }

    if (!myUserId) {
        return <Navigate to="/" replace />
    }

    return <Outlet />;
}