import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'
import { useAuth } from '@/context/AuthContext';

interface JwtPayload {
  userId: string;
}

export const ProtectedRoute: React.FC = () => {
    const {myUserId, isLoading} = useAuth();

    console.log(myUserId)


    if (isLoading) {
        return <div>Загрузка....</div>
    }

    if (!myUserId) {
        return <Navigate to="/" replace />
    }

    return <Outlet />;
}