// src/App.jsx
import { useState } from "react";

// ← Importa tu asistente
import { Assistant } from "./assistants/googleai"; 
// ← OpenAI, se usa el alias Assistant para no modificar el codigo
// import { OpenAIAssistant as Assistant } from "./assistants/openai"; 

import Loader from './components/Loader/Loader'
import { Chat } from "./components/Chat/Chat"; //importa el componente chat
import { Controls } from "./components/Controls/Controls";
import styles from "./App.module.css";

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

  //funcion que añade un mensaje al chat, para no borrar todos los mensajes
  //del chat cada vez que alguien escribe algo, si no que se añada
  //como en las inteligencias artificiales normales
  function addMessage(message) {
    setMessages((prevMessages) => [...prevMessages, message]);
  }

  // Función asíncrona que maneja el envío de un mensaje.
  // `async` permite usar `await` para esperar respuestas de Gemini.
  // Siempre devuelve una Promesa, aunque no se use explícitamente.
  async function handleContentSend(content) {
    // Agregar mensaje del usuario
    addMessage({ content, role: "user" });

    // Mostrar estado de carga
    // muestra los ... en el chat en señal de espera
    setIsLoading(true);
    addMessage({ role: "assistant", content: "..." });

    try {
      // Llamar al asistente (que internamente llama al backend)
      // luego este Envía el mensaje del usuario al backend (NO directamente a Gemini).
      // El backend se encarga de llamar a Gemini y devolver la respuesta.
      const result = await assistant.chat(content);

      // 4. Actualizar mensaje del asistente
      //concatena los mensajes previos (si no se eliminaria la conversacion)
      //con los mensajes nuevos
      // Reemplazar "..." con la respuesta real
      setMessages((prev) => {
        //mensajes previos
        const newMessages = [...prev];
        //indice del mensaje anterior
        const lastIndex = newMessages.length - 1;
        //si el ultimo mensaje fue del assistente (gemini) nos respondio
        if (newMessages[lastIndex].role === "assistant") {
          //pone la respuesta de gemini y la pone en mensajes
          //cerrando el ciclo y obteniendo la respuesta en el chat
          newMessages[lastIndex].content = result;
        }
        //devuelve el mensaje
        return newMessages;
      });
    } //fin del try 
    catch (error) {
      //aqui no tiene mucha ciencia, si da error la respuesta lanzara error por el chat
      console.error("Error:", error);
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastIndex = newMessages.length - 1;
        if (newMessages[lastIndex].role === "assistant") {
          newMessages[lastIndex].content = "Sorry, I couldn't process your request. Please try again!";
        }
        return newMessages;
      });
    } finally {
      //finalmente deja de estar en estado de espera, los 3 puntos se van
      setIsLoading(false);
    }
  }

  // 6. Renderizado de la interfaz
  return (
    <div className={styles.App}>
      {/* Encabezado de la aplicación */}
      <header className={styles.Header}>
        <img className={styles.Logo} src="/chat-bot.png" alt="AI Chatbot" />
        <h2 className={styles.Title}>AI Chatbot</h2>
      </header>

      {/* Contenedor del chat */}
      <div className={styles.ChatContainer}>
        {/* Renderiza la lista de mensajes */}
        <Chat messages={messages} />

        {/* Indicador de carga (se muestra solo si isLoading es true) */}
        {isLoading && <Loader />}
      </div>

      {/* Controles (input + botón enviar) */}
      <Controls is_disable={isLoading} onSend={handleContentSend}/>
    </div>
  );
}

export default App;