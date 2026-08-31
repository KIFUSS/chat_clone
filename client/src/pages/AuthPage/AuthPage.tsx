import React, { useState } from 'react';
import { PhoneStep, SmsStep, RegisterStep} from './components';
import { useAuthFlow } from './hooks/useAuthFlow';
import TableMessage  from "../../components/TableMessage"

const AuthPage: React.FC = () => {
  const {
    step,
    countryCode, setCountryCode,
    phoneNumber, setPhoneNumber,
    smsCode, setSmsCode,
    name, setName,
    login, setLogin,
    error, clearError,
    handleNext
  } = useAuthFlow();
    

  return (
    <>
        {error && (
            <TableMessage 
                message={error}
                onClose={clearError}
            />
        )}
        <div className="flex min-h-screen w-full items-center justify-center bg-zinc-950 p-4">
            <div className="w-80 bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col items-center">
                <div className="w-20 h-20 bg-sky-500 rounded-full flex items-center justify-center mb-6">
                <span className="text-white font-black text-2xl transform p-4">SEND</span>
                </div>
                {step === 'phone' && (
                    <>
                        <PhoneStep 
                            countryCode={countryCode} setCountryCode={setCountryCode}
                            phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber}
                         />
                    </>
                )}

                {step === 'sms' && (
                    <>
                        <SmsStep
                            countryCode={countryCode} phoneNumber={phoneNumber}
                            smsCode={smsCode} setSmsCode={setSmsCode}
                        />
                    </>
                )}

                {step === 'register' && (
                <>
                    <RegisterStep name={name} setName={setName} login={login} setLogin={setLogin} />
                </>
                )}
                
                <button 
                    onClick={handleNext}
                    className="w-full mt-6 py-3 bg-sky-500 text-white font-medium rounded-xl text-sm hover:bg-sky-600 transition-colors cursor-pointer"
                >
                {step === 'register' ? 'Начать общение' : 'Далее'}
                </button>
            </div>
        </div>
    </>
  );
};

export default AuthPage;