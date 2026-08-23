import React from 'react'

interface SmsStepProps {
    countryCode: string;
    phoneNumber: string;
    smsCode: string;
    setSmsCode: (partSmsCode: string) => void;
}

export const SmsStep: React.FC<SmsStepProps> = ({
    countryCode,
    phoneNumber,
    smsCode,
    setSmsCode
}) => {

    return (
        <>
            <h1 className="text-xl font-semibold text-zinc-100 mb-2">Проверка кода</h1>
            <p className="text-xs text-zinc-400 text-center mb-4">Мы отправили SMS с кодом на {countryCode} {phoneNumber}</p>
            {/* Тут будет твой инпут для SMS кода */}
            <input 
            maxLength={5} 
            value={smsCode} 
            onChange={(e) => setSmsCode(e.target.value.replace(/\D/g, ''))}
            placeholder="00000"
            className="w-full bg-zinc-950 text-center text-xl tracking-widest text-white border border-zinc-800 py-3 rounded-xl focus:outline-none focus:border-sky-500"
            />
        </>
    )
}