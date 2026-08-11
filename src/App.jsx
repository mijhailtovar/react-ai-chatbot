// ============================================================
// 📁 ARCHIVO: src/App.jsx
// ============================================================
// Aplicación principal del chatbot con tema oscuro por defecto y responsive.
// Este archivo contiene TODA la estructura visual, sin componentes separados.
// ============================================================

function App() {
  return (
    // ============================================================
    // CONTENEDOR PRINCIPAL
    // ============================================================
    // - `min-h-screen`: Altura mínima = 100% de la pantalla.
    // - `bg-gray-900`: Fondo gris muy oscuro (casi negro).
    // - `text-gray-100`: Texto gris muy claro (casi blanco).
    // - `dark`: Activa el modo oscuro (para usar `dark:` en hijos).
    // ============================================================
    <div className="min-h-screen bg-gray-900 text-gray-100 dark">
      
      {/* ============================================================
          CONTENEDOR INTERNO (Ancho máximo y centrado)
          ============================================================
          - `max-w-3xl`: Ancho máximo en móviles.
          - `lg:max-w-4xl`: En pantallas grandes (≥1024px) se ensancha.
          - `xl:max-w-6xl`: En pantallas extra grandes (≥1280px) más ancho.
          - `mx-auto`: Centra horizontalmente.
          - `px-4`: Padding horizontal de 1rem (16px) en móviles.
          - `h-screen`: Ocupa el 100% de la altura de la pantalla.
          - `flex flex-col`: Organiza a sus hijos en columna (uno debajo de otro).
          ============================================================ */}
      <div className="max-w-3xl lg:max-w-4xl xl:max-w-6xl mx-auto px-4 h-screen flex flex-col">
        
        {/* ============================================================
            HEADER (Encabezado)
            ============================================================
            - `flex`: Contenedor flexible.
            - `items-center`: Centra los hijos verticalmente.
            - `justify-center`: Centra los hijos horizontalmente.
            - `gap-3`: Espacio de 12px entre los hijos.
            - `py-4`: Padding vertical de 16px.
            - `border-b`: Solo borde inferior.
            - `border-gray-700`: Color del borde.
            ============================================================ */}
        <header className="flex items-center justify-center gap-3 py-4 border-b border-gray-700">
          
          {/* Logo del chatbot */}
          <img 
            src="/chat-bot.png" 
            alt="Chatbot IA" 
            // - `w-12 h-12`: Tamaño en móviles (48px).
            // - `md:w-16 md:h-16`: En tabletas (≥768px) crece a 64px.
            // - `xl:w-20 xl:h-20`: En pantallas extra grandes (≥1280px) crece a 80px.
            className="w-12 h-12 md:w-16 md:h-16 xl:w-20 xl:h-20" 
          />
          
          {/* Título con degradado */}
          <h1 
            // - `text-2xl`: Tamaño base en móviles.
            // - `md:text-3xl`: En tabletas crece.
            // - `xl:text-4xl`: En pantallas extra grandes crece más.
            // - `font-bold`: Negrita.
            // - `text-transparent`: Hace el texto transparente.
            // - `bg-clip-text`: Recorta el fondo solo al texto.
            // - `bg-gradient-to-r`: Degradado de izquierda a derecha.
            // - `from-yellow-400 to-blue-500`: Colores del degradado.
            className="text-2xl md:text-3xl xl:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-blue-500"
          >
            AI Chatbot
          </h1>
        </header>

        {/* ============================================================
            ÁREA DE CHAT (Mensajes)
            ============================================================
            - `flex-1`: Ocupa todo el espacio disponible (empuja el footer abajo).
            - `overflow-y-auto`: Si hay muchos mensajes, aparece scroll vertical.
            - `py-4`: Padding vertical de 16px.
            - `space-y-3`: Espacio de 12px entre cada hijo.
            ============================================================ */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          
          {/* --- Mensaje del asistente --- */}
          <div className="flex items-start gap-2">
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
                className="text-sm md:text-base"
              >
                Hola, ¿cómo puedo ayudarte hoy?
              </p>
            </div>
          </div>

          {/* --- Mensaje del usuario --- */}
          <div 
            // - `flex`: Contenedor flexible.
            // - `items-start`: Alinea los hijos al inicio vertical.
            // - `gap-2`: Espacio de 8px entre el avatar y el mensaje.
            // - `justify-end`: Alinea el contenedor a la derecha.
            className="flex items-start gap-2 justify-end"
          >
            {/* Burbuja del mensaje del usuario */}
            <div 
              // - `max-w-[85%]`: Ancho máximo en móviles.
              // - `md:max-w-[75%]`: En tabletas se reduce.
              // - `bg-blue-600`: Fondo azul.
              // - `rounded-2xl`: Borde muy redondeado.
              // - `px-4 py-2`: Padding interno.
              className="max-w-[85%] md:max-w-[75%] bg-blue-600 rounded-2xl px-4 py-2"
            >
              <p className="text-sm md:text-base">Quiero aprender sobre IA</p>
            </div>

            {/* Avatar del usuario */}
            <div 
              // - Misma estructura que el avatar del asistente pero con fondo azul.
              className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold"
            >
              U
            </div>
          </div>
        </div>

        {/* ============================================================
            CONTROLES (Input + Botón Enviar)
            ============================================================
            - `py-4`: Padding vertical de 16px.
            - `border-t`: Borde superior.
            - `border-gray-700`: Color del borde.
            ============================================================ */}
        <div className="py-4 border-t border-gray-700">
          {/* Contenedor del input + botón */}
          <div 
            // - `flex`: Contenedor flexible.
            // - `gap-2`: Espacio de 8px entre el input y el botón.
            className="flex gap-2"
          >
            {/* Input de texto */}
            <input
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
              className="flex-1 px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 
                        text-gray-100 placeholder-gray-400
                        focus:outline-none focus:ring focus:ring-offset-2 
                        focus:ring-blue-600 focus:ring-opacity-90 active:bg-blue-900
                        text-sm md:text-base"
            />

            {/* ============================================================
                BOTÓN ENVIAR
                ============================================================
                - `px-4 py-2`: Padding.
                - `bg-blue-600`: Fondo azul.
                - `hover:bg-blue-400`: Al pasar el mouse, se aclara a azul medio.
                - `rounded-full`: Borde completamente redondo.
                - `transition-colors`: Transición suave de colores.
                - `duration-200`: Duración de 200ms.
                - `flex items-center justify-center`: Centra el ícono dentro.
                - `disabled:opacity-50`: Cuando está deshabilitado, opacidad 50%.
                - `disabled:cursor-not-allowed`: Cursor de "no permitido".
                ============================================================ */}
            <button
              className="px-4 py-2 border-0 bg-blue-600 hover:bg-blue-400 hover:translate-x-1
                       focus:outline-none focus:ring focus:ring-offset-2 
                       focus:ring-blue-600 active:bg-blue-900 transform rounded-full 
                       transition-colors duration-200 flex items-center justify-center
                       disabled:opacity-50 disabled:cursor-not-allowed"
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
      </div>
    </div>
  );
}

export default App;