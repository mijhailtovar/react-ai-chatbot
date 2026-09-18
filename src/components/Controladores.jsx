import React from "react";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useState } from "react";
//importa el textarea autoajustable
import TextareaAutosize from 'react-textarea-autosize';

/**esta funcion contiene el footer, que contiene el textarea para añadir
 * texto e introducir la peticion, para preguntarle a la ia, ademas del boton para 
 * enviar la peticion
 * 
 * @param  
 * @returns <footer>
 */
export default function Controladores(props){
    //recupera la funcion manejarMensajeNuevo de los props, que vienen del app.jsx
    const onSend = props.onSend;
    
    //variable para saber si habilitamos o no los controles
    const isDisabled = props.isDisabled;
    //variable del contexto
    const colorsheme = useContext(ThemeContext);

    // Variables dinámicas para el footer y sus elementos internos
    const footerTheme = colorsheme === 'dark' 
        ? 'bg-slate-800 border-t border-slate-700 text-slate-100' 
        : 'bg-slate-100 border-t border-slate-300 text-slate-900';
        
    const inputTheme = colorsheme === 'dark' 
        ? 'bg-slate-700 text-white border-slate-600 placeholder-slate-400 scrollbar-thumb-indigo-600 scrollbar-track-slate-800' 
        : 'bg-white text-slate-900 border-slate-300 placeholder-slate-500 scrollbar-thumb-emerald-500 scrollbar-track-gray-300';

    const buttonTheme = colorsheme === 'dark'
        ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
        : 'bg-emerald-500 hover:bg-emerald-400 text-black ';

    //estilos del textareaautozice, por alguna razon da error si se aplica directamente el condicional
        // dentro de ese textarea
        const text_area_autosize_styles = "flex-1 px-4 py-2 rounded-xl bg-transparent focus:outline-none focus:ring focus:ring-offset-2 focus:ring-opacity-90 " + 
                                            "  text-sm md:text-md lg:text-xl md:text-base resize-none min-h-12 font-semibold ";
    
        //variable que maneja el contenido del textarea
        const [content, setContent] = useState('');
    
        /**
         * funcion que se ejecuta cuando el usuario presiona la tecla enter
         * o el boton de enviar, verifica si el textarea esta vacio, si es 
         * verdad no hace nada, si no actualiza el mensaje llamando a
         * onSend
         */
    
        const handleSend = function(){
          if (content.trim() === '') {
            return;
          }else{
            //el usuario introdujo texto en el textareaAutoresizable
            onSend(content); // Llama a la función que viene de App.jsx
            setContent(''); // Limpia el textarea
          } 
        };
    
        /*
          esta funcion se encarga de detectar si se presiono el boton o enter
          si es verdad dispara la funcion handleSend (la de arriba)
          si se presiona shift + enter se añade salto de linea y no se envia
          el mensaje
        */
       const handleKeyDown = function(e){
          if(e.key === 'Enter' && !e.shiftKey){
            e.preventDefault();
            handleSend();
          }
       };


    return(
        <footer className={`h-full px-4 pb-4 flex flex-col justify-center ${footerTheme} transition-colors duration-300`}>
            <p className="text-xs mb-1 opacity-75">PIE DE PAGINA</p>
            <form action="#" className="flex flex-row gap-2 w-full items-center">
               {/* El input ocupa el espacio restante (4/5 aproximadamente gracias a flex) 
               <input 
                 type="text" 
                 defaultValue='peticion a la ia' 
                 className={`w-4/5 px-3 py-2 rounded border outline-none ${inputTheme}`} 
               />
*/}


               {/* El botón ocupa exactamente 1/5 del ancho disponible */}
               {/* Input de texto */}
              <TextareaAutosize
                minRows={1}
                maxRows={10}
                type="text"
                placeholder="Escribe un mensaje..."
                // - `flex-1`: Ocupa todo el espacio disponible.
                // - `px-4 py-2`: Padding interno.
                // - `rounded-xl`: Borde redondeado (12px).
                // - `bg-gray-800`: Fondo gris oscuro.
                // - `border`: Borde de 1px.
                // - `border-gray-700`: Color del borde.
                // - `text-gray-100`: Texto claro.
                // - `placeholder-gray-400`: Color del placeholder.
                // - `focus:outline-none`: Elimina el contorno al enfocar.
                // - `focus:ring-6`: Anillo de 6px al enfocar.
                // - `focus:ring-blue-500`: Color del anillo.
                // - `text-sm md:text-base`: Tamaño responsivo.
                className={text_area_autosize_styles + ' ' + inputTheme}
                //aqui vienen las variables de las funciones
                value={content}
                //llama a una funcion anonima que siempre actualiza el estado
                //si se introduce algo (cambia el textarea)
                onChange={function(e){setContent(e.target.value)}}
                //si se presiona una tecla llama a la funcion de arriba
                onKeyDown={handleKeyDown}
              >
                </TextareaAutosize>
  
              {/* ============================================================
                  BOTÓN ENVIAR
                  ============================================================
                  - w-16 h-12 ancho y altura fijo
                  - `bg-blue-600`: Fondo azul.
                  - `hover:bg-blue-400`: Al pasar el mouse, se aclara a azul medio.
                  - `rounded-full`: Borde completamente redondo.
                  - `transition-colors`: Transición suave de colores.
                  - `duration-200`: Duración de 200ms.
                  - `flex items-center justify-center`: Centra el ícono dentro.
                  - `disabled:opacity-50`: Cuando está deshabilitado, opacidad 50%.
                  - `disabled:cursor-not-allowed`: Cursor de "no permitido".
                  flex-shrink-0 Evita que el botón se encoja cuando el textarea crece.
                  ============================================================ */}
              <button
                className={"w-16 h-12 border-0  transition-all duration-300 hover:-translate-x-1 hover:shadow-lg"
                        + " focus:outline-none focus:ring focus:ring-offset-2" 
                        + "   transform rounded-full" 
                        + " transition-colors flex items-center justify-center"
                        + " disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                        + buttonTheme}
                //si se cliquea el boton no se comprueba la tecla, se actualiza
                //los mensajes directamente
                onClick={handleSend}
                //si el prop isDisable dice que lo desabilitemos el boton no funcionara para
                //enviar datos
                disabled={isDisabled}
              >
                {/* Ícono de enviar (SVG) */}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  height="24px" 
                  viewBox="0 -960 960 960" 
                  width="24px" 
                  fill="currentColor"
                >
                  {/* El `path` es un código de dibujo que forma el ícono de "enviar" */}
                  <path d="M120-160v-240l320-80-320-80v-240l760 320-760 320Z"/>
                </svg>
              </button>
            </form>
        </footer>
    );
}