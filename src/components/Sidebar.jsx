import React from "react";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

/**esta es la barra lateral, se oculta y muestra, contiene el historial de chats
 * ademas de el boton de nuevo chat
 * 
 * @param  
 * @returns 
 */
export default function Sidebar({handleClick}){
    //variable del contexto que obtendra el tema
    const colorsheme = useContext(ThemeContext);

    // Variables de estilo dinámicas de Tailwind según el tema activo
    const sidebarTheme = colorsheme === 'dark' 
        ? 'bg-slate-800 text-slate-100 border-r border-slate-700' 
        : 'bg-slate-200 text-slate-900 border-r border-slate-300';
        
    const buttonThemeClass = colorsheme === 'dark' 
        ? 'bg-slate-700 text-white hover:bg-slate-600' 
        : 'bg-slate-300 text-slate-800 hover:bg-slate-400';
    

    return(
        <aside className={`${sidebarTheme} h-full overflow-y-auto p-4`}>
            <div className="flex flex-row">
                <b className="basis-1/2">SIDEBAR</b>
                <button className={"basis-1/2 " + buttonThemeClass} onClick={handleClick}>cierrame</button>
            </div>
            
                <nav className="list-none">
                    <li>primer chat</li>
                    <li>segundo chat</li>
                </nav>
        </aside>
    );
}