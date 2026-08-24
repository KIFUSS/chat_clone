import React from "react";

export const ChatHeader: React.FC = () => {
    return (
        <>
        <header className="h-16 border-b border-zinc-800 bg-zinc-900/50 px-6 flex items-center justify-between shrink-0 select-none">
            <div className="flex flex-col">
                <h2 className="text-sm font-semibold text-zinc-100">Алексей Программист</h2>
                <p className="text-xs text-emerald-400">в сети</p>
            </div>
            <button className="text-zinc-400 hover:text-white p-2 rounded-full hover:bg-zinc-800 transition-colors cursor-pointer text-sm">
                •••
            </button>
        </header>
        </>
    )
}