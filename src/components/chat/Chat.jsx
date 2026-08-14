

export function Chat(props){
    const messages = props.messages;

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
                className="max-w-[85%] lg:max-w-[75%] xl:max-w-full bg-gray-800 rounded-2xl px-4 py-2"
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
                        ? 'bg-blue-500 order-2'
                        : 'bg-yellow-400 text-black'
                    }`}
                >
                    {msg.role === 'user' ? 'U' : 'IA'}
                </div>
    
                {/* Mensaje: los mismo para el fondo de los mensajes  */}
                <div
                    className={`max-w-[85%] lg:max-w-[75%] xl:max-w-full rounded-2xl px-4 py-2 ${
                    msg.role === 'user'
                        ? 'bg-blue-600'
                        : 'bg-gray-800'
                    }`}
                >
                    {/*por ultimo el contenido del mensaje xd*/}
                    <p className="text-sm md:text-base lg:text-xl">{msg.content}</p>
                </div>
                </div>
            ))
        )}
            {/**fin del contenedor del chat */}
        </div>
    );
}