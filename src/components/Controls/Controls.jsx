//importa el textarea autoajustable
import TextareaAutosize from 'react-textarea-autosize';
import { useState } from 'react';

export function Controls(props){
    //recupera la funcion manejarMensajeNuevo de los props, que vienen del app.jsx
    const onSend = props.onSend;
    //lee la variable del tema oscuro-claro
    const isDark = props.isDark;

    //estilos del textareaautozice, por alguna razon da error si se aplica directamente el condicional
    // dentro de ese textarea
    const text_area_autosize_styles = "flex-1 px-4 py-2 rounded-xl bg-transparent focus:outline-none focus:ring focus:ring-offset-2 focus:ring-opacity-90 " + `${isDark ? 'text-gray-100 placeholder-gray-400 focus:ring-blue-600 active:bg-blue-900' : 'text-gray-900 placeholder-gray-700 focus:ring-blue-300 active:bg-blue-400'}` + "  text-sm md:text-md lg:text-xl md:text-base resize-none min-h-12 font-semibold "


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
        /* ============================================================
            CONTROLES (Input + Botón Enviar)
            ============================================================
            - `py-4`: Padding vertical de 16px.
            - `border-t`: Borde superior.
            - `border-gray-700`: Color del borde.
            RECUERDA isDark es un prop para establecer un condicional de estilos para el cambio de tema
            ============================================================ */
            <div className={"py-4 border-t  " + `${isDark ? 'border-gray-700' : 'border-gray-500' }`}>
            {/* Contenedor del input + botón */}
            <div 
              // - `flex`: Contenedor flexible.
              // - `gap-2`: Espacio de 8px entre el input y el botón.
              className={"flex items-end gap-2 border rounded-xl  "
                + `${isDark ? 'border-gray-700 bg-gray-800' : 'border-2 border-cyan-900 bg-blue-200'}`
              }
            >
              {/* Input de texto */}
              <TextareaAutosize
                minRows={1}
                maxRows={12}
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
                className={text_area_autosize_styles}
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
                        + `${isDark 
                              ? 'bg-blue-600 hover:bg-blue-400 focus:ring-blue-600 active:bg-blue-900 ' 
                              : 'bg-blue-100 hover:bg-blue-300 focus:ring-blue-400 active:bg-blue-500 '
                            }`}
                //si se cliquea el boton no se comprueba la tecla, se actualiza
                //los mensajes directamente
                onClick={handleSend}
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
            </div>
          </div>
    );
}