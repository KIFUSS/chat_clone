import React from 'react'

interface RegisterStepProps {
    name: string;
    setName: (partName: string) => void;
    login: string;
    setLogin: (partLogin: string) => void;
}

export const RegisterStep: React.FC<RegisterStepProps> = ({
    name, setName,
    login, setLogin,
}) => {

    return (
        <>
            <h1 className="text-xl font-semibold text-zinc-100 mb-2">О себе</h1>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ваше имя"
              className="w-full bg-zinc-950 text-sm text-white border border-zinc-800 p-3 rounded-xl focus:outline-none focus:border-sky-500"
            />
            <input 
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Придумайте уникальный логин"
              className="w-full bg-zinc-950 text-sm text-white border border-zinc-800 p-3 rounded-xl focus:outline-none focus:border-sky-500 mt-4"
            />
        </>
    )
}