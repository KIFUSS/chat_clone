import React from "react";

export const SideBarHeader: React.FC = () => {
    return (
        <header className="p-4 border-b border-zinc-800 flex items-center gap-3 shrink-0">
            <button className="p-2 hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer text-zinc-400">
                ☰
            </button>
            <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 flex items-center">
                <input 
                type="text" 
                placeholder="Поиск" 
                className="w-full bg-transparent text-sm text-zinc-100 focus:outline-none placeholder-zinc-600 font-normal"
                />
            </div>
        </header>
    )
}