import React, { useState } from 'react';
import { useChat } from './hooks/useChat';

import { 
  SideBarHeader, 
  ChatList, 
  ChatHeader, 
  MessageArea, 
  MessageInput 
} from './components';


const ChatPage: React.FC = () => {
    const {
        chats, 
        activeChatId, 
        currentChat, 
        currentMessages, 
        inputText, 
        setInputText, 
        searchQuery, 
        setSearchQuery, 
        handleSendMessage, 
        handleSelectChat,
        handleCreateChat} = useChat();

    const [menuActive, setMenuActive] = useState<boolean>(false);

    const handleMenuActive = () => {
        setMenuActive(prev => !prev);
    }

    return (
        <>
            <div className='flex h-screen w-full bg-zinc-950 text-zinc-100 overflow-hidden select-none'>
                <aside className="w-80 h-full bg-zinc-900 border-r border-zinc-800 flex flex-col shrink-0">
                    <SideBarHeader value={searchQuery} onChange={setSearchQuery} toggleMenu={handleMenuActive}/>
                    <ChatList 
                        chats={chats} 
                        activeChatId={activeChatId} 
                        onSelectChat={handleSelectChat} 
                    />
                </aside>
                <main className="flex-1 h-full bg-zinc-950 flex flex-col">
                    {/* Внедряем декомпозированные блоки окна чата */}
                    <ChatHeader chat={currentChat}/>
                    <MessageArea messages={currentMessages}/>
                    <MessageInput value={inputText} onChange={setInputText} onSend={handleSendMessage}/>
                </main>
            </div>
        </>
    )
}

export default ChatPage