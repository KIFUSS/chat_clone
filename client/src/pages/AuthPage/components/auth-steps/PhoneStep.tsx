import React from 'react'
import CountrySelect from '../CoutrySelect'
import { PhoneInput } from '../PhoneInput'

interface PhoneStepProps {
    countryCode: string;
    setCountryCode: (newCode: string) => void;
    phoneNumber: string;
    setPhoneNumber: (num: string) => void;
}

export const PhoneStep: React.FC<PhoneStepProps> = ({
    countryCode,
    setCountryCode,
    phoneNumber,
    setPhoneNumber
}) => {
    
    return (
        <>
            <h1 className="text-xl font-semibold text-zinc-100 mb-2">Ваш телефон</h1>
            <p className="text-xs text-zinc-400 text-center mb-6">
            Пожалуйста, введите свой номер телефона.
            </p>
            {/* <CountrySelect value={countryCode} onChange={setCountryCode} /> */}
            <PhoneInput value={phoneNumber} onChange={setPhoneNumber} countryCode={countryCode}/>
        </>
    )
}