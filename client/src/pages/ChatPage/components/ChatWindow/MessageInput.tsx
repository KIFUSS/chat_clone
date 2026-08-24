import React from 'react';

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
        <button
          onClick={onSend} 
          className="text-sky-500 hover:text-sky-400 font-medium text-sm px-2 cursor-pointer transition-colors select-none"
        >
          Отправить
        </button>
      </div>
    </footer>
  );
};