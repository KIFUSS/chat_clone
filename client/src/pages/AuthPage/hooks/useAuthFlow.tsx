import { useAuth } from '@/context/AuthContext';
import {useState} from 'react'
import { useNavigate } from 'react-router-dom'

export const useAuthFlow = () => {
    const navigate = useNavigate();

    const {checkAuth} = useAuth();

    const [countryCode, setCountryCode] = useState<string>('+7');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [step, setStep] = useState<'phone' | 'sms' | 'register'>('phone');
    const [smsCode, setSmsCode] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleNext = async () => {
        const fullPhone = `${countryCode}${phoneNumber}`;

        if (step === 'phone') {
            if (phoneNumber.length < 10) return setError('Неполный номер телефона');

            try {

                const response = await fetch('http://localhost:5000/api/auth/send-code', {
                    method: "POST",
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify({phone: fullPhone})
                });

                const data = await response.json();

                if (!response.ok) {
                    return setError(data.error || 'Ошибка при отправке кода');
                }

                setStep('sms');
            } catch (err) {
                setError('Не удалось связаться с сервером');
            }

            
        } 
        else if (step === 'sms') {
            if (smsCode.length < 5) return setError('Неверный код смс');

            try {
                const response = await fetch("http://localhost:5000/api/auth/verify-code", {
                    method: "POST",
                    headers: {'Content-type': 'application/json'},
                    body: JSON.stringify({phone: fullPhone, code: smsCode})
                })

                const data = await response.json();

                if (!response.ok) {
                    return setError(data.error || 'Неверный код!');
                }

                if (data.isNewUser) {
                    setStep('register');
                } else {
                    localStorage.setItem('token', data.token);
                    navigate('/chat', {replace: true});
                }
            } catch (err) {
                setError('Ошибка при проверки кода на сервере!');
            }
        }   
        else if (step === 'register') {
            if (!name.trim()) return setError('Вы не ввели имя!');

            try {
                console.log('Начала регистрации юзера')
                const response = await fetch("http://localhost:5000/api/auth/register", {
                    method: "POST",
                    headers: {'Content-type': 'application/json'},
                    body: JSON.stringify({phone: fullPhone, name: name.trim()}),
                    credentials: 'include',
                })

                const data = await response.json();

                if (!response.ok) {
                    setError(data.error || "Ошибка при создании пользователя")
                }

                


                console.log("Пользователь успешно сохранен в бд");

                checkAuth();
                navigate('/chat', {replace: true})
            } catch (err) {
                setError("Ошибка при создании пользователя");
            }
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