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

/**
 * funcion para guardar un mensaje nuevo 
 * y actualizar el array de mensajes de arriba
 */
const manejarMensajeNuevo = async function(new_message){
  setMessages((prevMessages) => {//inicio de prevmessages
    //retorna el nuevo mensaje y lo adjunta al estado anterior de 
    //set messages (anteriores mensajes para no borrar los otros mensajes cada bez que se inserta uno nuevo)
    //es decir el prevmessages tiene el estado anterior aqui
    return [
      ...prevMessages, //tiene aun el estado anterior
      {role: 'user', content: new_message}
    ];
    //aqui ya se actualizo
    //fin de setmessages
  });

  // Mostrar estado de carga
    // muestra los ... en el chat en señal de espera
  setIsLoading(true);
  setMessages((prev) => {
    return [
      ...prev, {role: "assistant", content: "..."}
    ];
  });

  try {
      // Llamar al asistente (que internamente llama al backend)
      // luego este Envía el mensaje del usuario al backend (NO directamente a Gemini).
      // El backend se encarga de llamar a Gemini y devolver la respuesta.
      const result = await assistant.chat(new_message);

      // 4. Añadir la respuesta del asistente 
      setMessages((prev) => {
        //mensajes previos
        const mensajes_previos = [...prev];
        //indice del mensaje anterior
        const lastIndex = mensajes_previos.length - 1;
        //si el ultimo mensaje fue del assistente (gemini) nos respondio
        if (mensajes_previos[lastIndex].role === "assistant") {
          //pone la respuesta de gemini y la pone en mensajes
          //cerrando el ciclo y obteniendo la respuesta en el chat
          mensajes_previos[lastIndex].content = result;
        }
        //devuelve el mensaje
        return mensajes_previos;
      });
  } catch (error) {
      //aqui no tiene mucha ciencia, si da error la respuesta lanzara error por el chat
      console.error("Error:", error);
      setMessages((prev) => {
        const mensajes_previos = [...prev];
        const lastIndex = mensajes_previos.length - 1;
        if (mensajes_previos[lastIndex].role === "assistant") {
          mensajes_previos[lastIndex].content = "Sorry, I couldn't process your request. Please try again!";
        }
        return new_message;
      });
  } finally {
       // 5. Desactivar el Loader (siempre se ejecuta)
       setIsLoading(false);
  }

}

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

        {/* =======ÁREA DE CHAT (Mensajes) declarado como 'COMPONENTE CHAT'  Pasamos los mensajes al componente Chat====================*/}
        <Chat messages={messages} />

        {/* Loader (se muestra mientras isLoading es true) */}
        {isLoading && <Loader />}

        {/* ============================================================
            CONTROLES (Input + Botón Enviar) declarado como componente
            Pasamos la función para enviar mensajes al componente Controls
            ============================================================ */}
        <Controls onSend={manejarMensajeNuevo}/>

      </div>
    </div>
  );
}

export default App;