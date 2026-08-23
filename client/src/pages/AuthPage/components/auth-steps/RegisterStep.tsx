import React from 'react'

interface RegisterStepProps {
    value: string;
    onChange: (partName: string) => void;
}

export const RegisterStep: React.FC<RegisterStepProps> = ({
    value,
    onChange
}) => {

    return (
        <>
            <h1 className="text-xl font-semibold text-zinc-100 mb-2">О себе</h1>
            <input 
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Ваше имя"
              className="w-full bg-zinc-950 text-sm text-white border border-zinc-800 p-3 rounded-xl focus:outline-none focus:border-sky-500"
            />
        </>
    )
}