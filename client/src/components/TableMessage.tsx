import React, {useEffect} from 'react';

interface TableMessageProps {
    message: string;
    onClose: () => void;
    duration?: number;
}

const TableMessage: React.FC<TableMessageProps> = ({
    message,
    onClose,
    duration=4000
}) => {

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [onClose, duration])

    return (
        <div className="fixed top-5 left-0 right-0 z-50 flex justify-center px-4">
            <div className="flex items-center gap-3 bg-zinc-900 border border-red-500/30 shadow-2xl px-4 py-3 rounded-xl w-full max-w-sm animate-none">  
                <div className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-xs font-black shrink-0 select-none">
                !
                </div>
                <p className="text-xs font-medium text-zinc-200 flex-1 leading-relaxed">
                    {message}
                </p>
                <button 
                    onClick={onClose}
                    className="text-zinc-500 hover:text-zinc-300 transition-colors p-1 text-xs cursor-pointer select-none"
                >
                    ✕
                </button>
            </div>
        </div>
    )
}

export default TableMessage;