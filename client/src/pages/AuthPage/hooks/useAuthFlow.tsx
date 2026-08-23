import {useState} from 'react'
import { useNavigate } from 'react-router-dom'

export const useAuthFlow = () => {
    const navigate = useNavigate();

    const [countryCode, setCountryCode] = useState<string>('+7');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [step, setStep] = useState<'phone' | 'sms' | 'register'>('phone');
    const [smsCode, setSmsCode] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleNext = () => {
        if (step === 'phone') {
            if (phoneNumber.length < 10) return setError('Неполный номер телефона');
            setStep('sms');
        } 
        else if (step === 'sms') {
            if (smsCode.length < 5) return setError('Неверный код смс');
            
            const isNewUser = true; // Заглушка для бэкенда

            if (isNewUser) {
                setStep('register');
            } else {
                navigate('/chat', { replace: true });
            }
        }   
        else if (step === 'register') {
            if (!name.trim()) return setError('Вы не ввели имя!');
            navigate('/chat', { replace: true });
        }
  };

  const clearError = () => setError(null);

  // Возвращаем объект, со всем, что понадобится компоненту разметки
  return {
    countryCode, setCountryCode,
    phoneNumber, setPhoneNumber,
    step,
    smsCode, setSmsCode,
    name, setName,
    error, setError, clearError,
    handleNext,
  };
}