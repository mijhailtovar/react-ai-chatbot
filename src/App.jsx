// ============================================================
// 📁 ARCHIVO: src/App.jsx
// ============================================================
// Aplicación principal del chatbot con tema oscuro por defecto y responsive.
// Este archivo contiene TODA la estructura visual, sin componentes separados.
// ============================================================

//dependecias de react
import { useState } from 'react';

// ← Importa tu asistente
import { Assistant } from "./assistants/googleai"; 
// ← OpenAI, se usa el alias Assistant para no modificar el codigo
// import { OpenAIAssistant as Assistant } from "./assistants/openai"; 

//importamos los componentes
import { Chat } from './components/chat/Chat';
import { Controls } from './components/Controls/Controls';  
import { Loader } from './components/Loader/Loader';
//IMPORTANTE COMPONENTE PARA CAMBIAR DE TEMA O MEJOR DICHO
//dependencias para cambio de tema
import { useContext } from 'react';
import { ThemeContext } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';


function App() {
  // 1. Instancia del asistente (para hablar con la IA)
  //    - Se crea una vez al cargar la aplicación.
  //    - Internamente usa el backend para comunicarse con Gemini
  const assistant = new Assistant(); // ← Instancia del asistente
// Estado que guarda el historial de mensajes (usuario e IA).
  // Se actualiza cada vez que se envía o recibe un mensaje.
  const [messages, setMessages] = useState([]);
// Estado que indica si la IA está procesando la respuesta.
  // Muestra "..." o "El asistente está escribiendo..." mientras espera.
  const [isLoading, setIsLoading] = useState(false);
  //establece la variable bandera para establcer el tema, si es true es oscuro si no es claro
  const { isDark } = useContext(ThemeContext);
  // variable para detectar si se esta recibiendo la respuesta por streaming, es decir
  //palabra por palabra y NO un solo bloque de golpe
  const [isStreaming, setIsStreaming] = useState(false);
  /**
   * esto adjunta palabra por palabra, el mensaje a los mensajes anteriores
   */
  function updateLastMessageContent(content) {
    setMessages((prevMessages) =>
      prevMessages.map((message, index) =>
        index === prevMessages.length - 1 // ← ¿Es el último mensaje?
          ? { ...message, content: `${message.content}${content}` } // ← Sí: añade el fragmento
          : message // ← No: déjalo igual
      )
    );
  }

/**
 * funcion para guardar un mensaje nuevo 
 * y actualizar el array de mensajes de arriba
 */
const manejarMensajeNuevo = async function (new_message) {
  // 1. Agregar mensaje del usuario
  setMessages((prevMessages) => [
    ...prevMessages,
    { role: "user", content: new_message },
  ]);

  // 2. Activar estado de carga
  setIsLoading(true);
  setMessages((prev) => [
    ...prev,
    { role: "assistant", content: "..." },
  ]);

  try {
    // 3. Llamar al método de streaming
    const stream = assistant.chatStream(new_message);
    //si es el primer fracmento de la respuesta
    let isFirstChunk = true;

    // 4. Iterar sobre los fragmentos
    for await (const chunk of stream) {
      //si el el primer fracmento d ela respuesta, dejara de serlo porque vienen otros
      if (isFirstChunk) {
        isFirstChunk = false;
        setMessages((prev) => [
          ...prev,
          { content: "", role: "assistant" },
        ]);
        setIsLoading(false);
        setIsStreaming(true);
      }
      //se actualiza el mensaje con el nuevo fracmento
      updateLastMessageContent(chunk);
    }
    setIsStreaming(false);
  } catch (error) {
    // 5. Manejo de errores
    console.error("Error en streaming:", error);
    setMessages((prev) => [
      ...prev,
      {
        content: "Sorry, I couldn't process your request. Please try again!",
        role: "system",
      },
    ]);
    setIsLoading(false);
    setIsStreaming(false);
  }
};



  return (
    // ============================================================
    // CONTENEDOR PRINCIPAL
    // ============================================================
    // - `min-h-screen`: Altura mínima = 100% de la pantalla.
    // - `bg-gray-900`: Fondo gris muy oscuro (casi negro).
    // - `text-gray-100`: Texto gris muy claro (casi blanco).
    // - `dark:`: Activa el modo oscuro .
    // ============================================================
    <div className={"min-h-screen " + `${isDark ? 'bg-gray-900 text-gray-100' : ' bg-gray-50 text-gray-900 '}`}>
      
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
        <header 
          className={"flex items-center justify-between py-4 border-b "
            + `${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`
          }
        
        >

          {/* 🔹 Espacio vacío a la izquierda (para equilibrar) */}
          <div className="w-12 md:w-16 xl:w-20"></div>

          {/* 🔹 Logo + Título (centrado) */}
          <div className="flex items-center justify-center gap-3">
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
          </div>
          
          {/**boton para cambiar de tema themetogle */}
          <ThemeToggle/>
        </header>

        {/* =======ÁREA DE CHAT (Mensajes) declarado como 'COMPONENTE CHAT'  Pasamos los mensajes al componente Chat====================*/}
        <Chat messages={messages} isDark={isDark} />

        {/* Loader (se muestra mientras isLoading es true) */}
        {isLoading && <Loader />}

        {/* ============================================================
            CONTROLES (Input + Botón Enviar) declarado como componente
            Pasamos la función para enviar mensajes al componente Controls
            ademas para detectar si esta en proceso de streaming o no
            ============================================================ */}
        <Controls onSend={manejarMensajeNuevo} isDark={isDark} isDisabled={isLoading || isStreaming} />
      </div>
    </div>
  );
}

export default App;