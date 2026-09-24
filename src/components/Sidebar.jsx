import React from "react";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

/**esta es la barra lateral, se oculta y muestra, contiene el historial de chats
 * ademas de el boton de nuevo chat
 * 
 * @param  
 * @returns 
 */
export default function Sidebar({ 
    handleClick, 
    chats, 
    activeChatId, 
    activeChatMessages, 
    onActiveChatIdChange, 
    onNewChatCreate 
}) {
    //variable del contexto que obtendra el tema
    const colorsheme = useContext(ThemeContext);

    // Variables de estilo dinámicas de Tailwind según el tema activo
    const sidebarTheme = colorsheme === 'dark'
        ? 'bg-slate-800 text-slate-100 border-r border-slate-700 scrollbar-thumb-indigo-600 scrollbar-track-slate-800'
        : 'bg-slate-200 text-slate-900 border-r border-slate-300 scrollbar-thumb-emerald-500 scrollbar-track-gray-300';

    const buttonThemeClass = colorsheme === 'dark'
        ? 'bg-slate-700 text-white hover:bg-slate-600'
        : 'bg-slate-300 text-slate-800 hover:bg-slate-400';

    function handleChatClick(chatId){
        onActiveChatIdChange(chatId);
    }

    return (
        <aside className={`${sidebarTheme} h-full overflow-y-auto p-4`}>
            <div className="flex flex-col gap-y-4">
                <div className="flex flex-row">
                    <b className="basis-1/2">SIDEBAR</b>
                    <button className={"basis-1/2 " + buttonThemeClass} onClick={handleClick}>cierrame</button>
                </div>
                <div>
                    <button 
                        className={"w-full p-3 bg-none border-2 border-dashed rounded-lg text-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed " + buttonThemeClass} 
                        disabled={activeChatMessages.length === 0}
                        onClick={onNewChatCreate}
                    >
                        Nuevo Chat
                    </button>
                </div>
            </div>
            


            <nav className="list-none">
                {chats.filter(({ messages }) => messages.length > 0).map((chat) => (
                    <li
                        key={chat.id}
                        className="p-2 rounded hover:bg-slate-700 cursor-pointer transition-colors text-base md:text-lg lg:text-xl"
                        onClick={function(){
                            onActiveChatIdChange(chat.id);
                        }}
                    >
                        {chat.title}
                    </li>
                ))}
            </nav>
        </aside>
    );
}