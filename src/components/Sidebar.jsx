import React from "react";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function Sidebar({ 
    handleClick, 
    chats, 
    activeChatId, 
    onActiveChatIdChange, 
    onNewChatCreate 
}) {
    const colorsheme = useContext(ThemeContext);

    const sidebarTheme = colorsheme === 'dark'
        ? 'bg-slate-800 text-slate-100 border-r border-slate-700'
        : 'bg-slate-200 text-slate-900 border-r border-slate-300';

    const buttonThemeClass = colorsheme === 'dark'
        ? 'bg-slate-700 text-white hover:bg-slate-600'
        : 'bg-slate-300 text-slate-800 hover:bg-slate-400';

    return (
        <aside className={`${sidebarTheme} h-full overflow-y-auto p-4`}>
            <div className="flex flex-col gap-y-4">
                <div className="flex flex-row">
                    <b className="basis-1/2">SIDEBAR</b>
                    <button className={"basis-1/2 " + buttonThemeClass} onClick={handleClick}>
                        cierrame
                    </button>
                </div>
                <div>
                    <button 
                        className={"w-full p-3 bg-none border-2 border-dashed rounded-lg text-center cursor-pointer " + buttonThemeClass}
                        onClick={onNewChatCreate}
                    >
                        Nuevo Chat
                    </button>
                </div>
            </div>

            <nav className="list-none mt-4">
                {chats.map((chat) => (
                    <li
                        key={chat.id}
                        className={`p-2 rounded cursor-pointer transition-colors text-base md:text-lg lg:text-xl ${
                            chat.id === activeChatId 
                                ? 'bg-slate-700 text-white' 
                                : 'hover:bg-slate-700'
                        }`}
                        onClick={() => onActiveChatIdChange(chat.id)}
                    >
                        {chat.title || "Chat sin título"}
                    </li>
                ))}
            </nav>
        </aside>
    );
}