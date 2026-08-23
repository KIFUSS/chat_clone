import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import AuthPage from '../pages/AuthPage/AuthPage';
import ChatPage from '../pages/ChatPage/ChatPage';

export const router = createBrowserRouter([
  {path: '/auth', element: <AuthPage/>},
  {path: '/chat', element: <ChatPage/>},
  {path: '*', element: <Navigate to="/auth" replace/>}
])
