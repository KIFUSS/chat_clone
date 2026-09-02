import { useAuth } from "@/context/AuthContext";
import React from "react";


export const InfoUserField: React.FC = () => {

   const {user} = useAuth();

    return (
        <div className="flex gap-2 p-4 border-t items-center">
            <div className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center font-bold text-white shrink-0">
                {user?.name[0]}
            </div>
            <div className="flex flex-col">
                <div className="flex gap-2 items-center">
                    <p>{user?.name}</p>
                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 transition-colors duration-300 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]`}></div> 
                </div>
                <p className="text-xs text-gray-500">@{user?.login}</p>
            </div>
        </div>
    )
}