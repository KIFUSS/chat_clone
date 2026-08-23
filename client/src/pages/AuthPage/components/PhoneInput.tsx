import React from 'react'

interface PhoneInputProps {
    value: string;
    onChange: (num: string) => void;
    countryCode: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({value, onChange, countryCode}) => {

    const changePhone = (num: string) => {
        if (num.length <= 10) {
            onChange(num)
        }
    }

    return (
        <div className="w-full flex items-center bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden mb-6">
            <span className="pl-4 pr-1 text-sm font-medium text-zinc-400">{countryCode}</span>
            <input 
            type="tel" 
            value={value}
            onChange={(e) => changePhone(e.target.value.replace(/\D/g, ''))}
            placeholder="000 000 00 00" 
            className="w-full bg-transparent text-sm text-zinc-100 py-3 pr-4 focus:outline-none placeholder-zinc-600"
            />
        </div>
    )
}