import React from 'react';
import { Send } from 'lucide-react';

interface MessageInputProps {
  value: string;
  onChange: (text: string) => void;
  onSend: () => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({value, onChange, onSend}) => {

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSend();
    }
  }

  return (
    <footer className="p-4 bg-transparent shrink-0">
      <div className="mx-auto flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-2.5 focus-within:border-zinc-700 transition-colors">
        <input 
          type="text" 
          placeholder="Напишите сообщение..." 
          value={value}
          onKeyDown={handleKeyDown}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent text-sm text-zinc-100 focus:outline-none placeholder-zinc-600 font-normal"
        />
        <Send
              onClick={(onSend)}
              className='cursor-pointer transition-transform duration-200 hover:scale-105 hover:text-sky-500'
            >

            </Send>
        
      </div>
    </footer>
  );
};