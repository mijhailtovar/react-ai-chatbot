// src/components/Chat/Chat.jsx
import { useEffect, useRef } from 'react';
import Markdown from "react-markdown";
import remarkGfm from 'remark-gfm';

export function Chat(props){
    //lee la propiedad emnsajes
    const messages = props.messages;
    //lee la variable del tema oscuro-claro
    const isDark = props.isDark;

    /**
     * Crea una referencia (un "marcador") que apunta a un elemento del DOM (en este caso, el final del chat). useRef(null) inicializa la referencia vacía.
     */
    const messagesEndRef = useRef(null);

    /**
     * Ejecuta el código dentro de la función después de cada renderizado, pero solo cuando messages cambia.
    Analogía: Es como un vigilante que se activa cada vez que la lista de mensajes se actualiza y hace scroll al final
    useEffect se ejecuta después de que React actualiza el DOM.
    El array de dependencias [messages] le dice a React: "Solo ejecuta este efecto si messages cambia".
Nivel avanzado:
    Si el array de dependencias está vacío [], el efecto se ejecuta una sola vez (al montar el componente).
    useEffect puede retornar una función de limpieza (cleanup) para evitar memory leaks.
*/
    useEffect(() => {
                /**
                 *     messagesEndRef.current → Obtiene el elemento DOM (el div al final del chat).
            ?. → Si current es null (no existe), no hace nada (evita errores).
            .scrollIntoView() → Desplaza el elemento hacia la vista.
            { behavior: "smooth" } → Hace que el scroll sea suave (no instantáneo).
        Analogía: Es como bajar suavemente una cortina para ver la última línea de un texto.
        Nivel intermedio:
            ?. (optional chaining) es una forma segura de acceder a propiedades de un objeto que podría ser null o undefined.
            scrollIntoView es un método nativo del DOM que desplaza el elemento a la vista del usuario.
        Nivel avanzado:
            scrollIntoView tiene opciones como behavior: "smooth" (scroll suave) y block: "start" (alinear al inicio o final).
                */
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return(
        /**
         * ============================================================
            ÁREA DE CHAT (Mensajes)
            ============================================================
            - `flex-1`: Ocupa todo el espacio disponible (empuja el footer abajo).
            - `overflow-y-auto`: Si hay muchos mensajes, aparece scroll vertical.
            - `py-4`: Padding vertical de 16px.
            - `space-y-3`: Espacio de 12px entre cada hijo.
            ============================================================ 
         */
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
            
        {/**Un operador ternario que evalúa una condición y retorna un valor u otro.
        Estructura: condición ? valor_si_verdadero : valor_si_falso */
        messages.length === 0 ? (
            /* --- Mensaje del asistente --- */
            <div className="flex items-end gap-2">
                {/* Avatar del asistente */}
                <div 
                // - `w-8 h-8`: Tamaño del avatar (32px).
                // - `rounded-full`: Borde completamente redondo (círculo).
                // - `bg-yellow-400`: Fondo amarillo.
                // - `flex items-center justify-center`: Centra la "AI" dentro del círculo.
                // - `text-sm`: Texto pequeño.
                // - `font-bold`: Negrita.
                // - `text-black`: Texto negro para contrastar con el fondo amarillo.
                className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-sm font-bold text-black"
                >
                AI
                </div>

                {/* Burbuja del mensaje */}
                <div 
                // - `max-w-[85%]`: Ancho máximo en móviles.
                // - `lg:max-w-[75%]`: En pantallas grandes se reduce para que no ocupe todo.
                // - `xl:max-w-full`: En extra grandes puede ocupar más espacio.
                // - `bg-gray-800`: Fondo gris oscuro.
                // - `rounded-2xl`: Borde muy redondeado (16px).
                // - `px-4 py-2`: Padding horizontal y vertical.
                // - se evalua la expresion isDArk para el tema (oscuro o claro)
                className={"max-w-[85%] lg:max-w-[75%] xl:max-w-full  rounded-2xl px-4 py-2 "
                    + `${isDark ? 'bg-gray-800' : 'bg-gray-300'}`
                }
                >
                {/* Texto del mensaje */}
                <p 
                    // - `text-sm`: Tamaño base en móviles.
                    // - `md:text-base`: En tabletas se hace más grande.
                    className="text-sm md:text-base lg:text-xl"
                >
                    Hola, ¿cómo puedo ayudarte hoy?
                </p>
                </div>
            </div>
        ):(
            // Renderizar mensajes reales
            /** el ${} es usado para definir una clase condicional, si es
             * usuario lo alinea a la derecha si es la ia a la izquierda
                key={index}	Una etiqueta para saber qué mensaje es cuál 
            */
            messages.map((msg, index) => (
                <div
                key={index}
                className={`flex items-end gap-2 ${
                    msg.role === 'user' ? 'justify-end' : ''
                }`}
                >
                {/* Avatar: tambien una clase condicional si es usuario le da azul al color
                del avatar, si no es amarillo (la ia) tambien un condicional para la letra de usuario 'U' o la de
                la ia 'IA' */}
                <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    msg.role === 'user'
                        ? (isDark ? 'bg-blue-500 order-2' : 'bg-blue-500 order-2 text-white')
                        : 'bg-yellow-400 text-black'
                    }`}
                >
                    {msg.role === 'user' ? 'U' : 'IA'}
                </div>
    
                {/* Mensaje: los mismo para el fondo de los mensajes 
                    son las burbujas del usuario o ia, se usa el ternario dentro de un ternario isDark
                    para establecer los estilos en caso de un cambio de tema, y si es un error 'system' mostrara fondo rojo con la ternaria
                        : (msg.role === 'assistant' ? (isDark ? 'bg-gray-800' : 'bg-gray-200') : ('bg-red-400 text-white') )
                    evalua primero si el mensaje es del assistente (ia) si lo es pone los estio si no es de system y es un error
                */}
                <div
                    className={`max-w-[85%] lg:max-w-[75%] xl:max-w-full rounded-2xl px-4 py-2 ${
                    msg.role === 'user'
                        ? (isDark ? 'bg-blue-600 text-white' : 'bg-blue-200 text-black') 
                        : (msg.role === 'assistant' ? (isDark ? 'bg-gray-800' : 'bg-gray-200') : ('bg-red-400 text-white') )
                    }`}
                >
                    {/*por ultimo el contenido del mensaje envuelto en markdown para 
                    estilisarlo sin el es texto plano Contenedor con la clase de estilo*/}
                    
                    <div className="text-sm md:text-base lg:text-xl">
                        <Markdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              a: ({ href, children }) => (
                                <a href={href} target="_blank" rel="noopener noreferrer">
                                  {children}
                                </a>
                              ),
                            }}
                        >
                            {msg.content}
                        </Markdown>
                    </div>
                    
                </div>
                </div>
            ))
        )}
            {/* Elemento fantasma para auto-scroll */}
            <div ref={messagesEndRef} />
            {/**fin del contenedor del chat */}
        </div>
    );
}