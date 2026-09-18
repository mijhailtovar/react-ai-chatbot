import React from "react";
//necesario para usar el contexto
import { useContext } from "react";
import { ThemeContext } from '../context/ThemeContext'
/**aqui va el banner, el logo del robot, el h1 y cualquiero informacion que quieras
 * 
 * @returns 
 */
export default function Header(){
    const colorsheme = useContext(ThemeContext);
    const class_name = 'panel-' + colorsheme;

    return(
        <header className={class_name + ''}> <h1>HEADER</h1> </header>
    );
}