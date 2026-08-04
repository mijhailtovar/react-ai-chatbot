// src/App.jsx (MODIFICADO)
//importa las dependencias necesarias
import { useState } from "react";
import { Chat } from "./components/Chat/Chat";
import { Controls } from "./components/Controls/Controls";
import styles from "./App.module.css";

// URL del backend. En producción, cambiarías localhost por la URL de tu servidor en la nube.
const API_BACKEND = "http://localhost:3000";

//funcion principal de la aplicacion, aqui se ejecuta todo el codigo
function App() {
  // Estado que guarda el historial de mensajes (usuario e IA).
  // Se actualiza cada vez que se envía o recibe un mensaje.
  const [messages, setMessages] = useState([]);
  // Estado que indica si la IA está procesando la respuesta.
  // Muestra "..." o "El asistente está escribiendo..." mientras espera.
  const [isLoading, setIsLoading] = useState(false);

  // Función asíncrona que maneja el envío de un mensaje.
  // `async` permite usar `await` para esperar respuestas de Gemini.
  // Siempre devuelve una Promesa, aunque no se use explícitamente.
  async function handleContentSend(content) {
    // 1. Agregar mensaje del usuario
    setMessages((prev) => [...prev, { content, role: "user" }]);
    
    // 2. Estado de carga
    // muestra los ... en el chat en señal de espera
    setIsLoading(true);
    setMessages((prev) => [...prev, { role: "assistant", content: "..." }]);

    try {
      // Envía el mensaje del usuario al backend (NO directamente a Gemini).
      // El backend se encarga de llamar a Gemini y devolver la respuesta.
      const response = await fetch(`${API_BACKEND}/api/chat`, {
        /*esto es carpinteria, tiene que se post porque se configuro asi en
         backend\app.js y tiene que ser content-type aplication json*/
        method: "POST",
        headers: {
          "Content-Type": "application/json", // El backend espera JSON
        },
        /*importante, envia la peticion REQUEST a el backend puntualmente
        a la direccion del metodo /api/chat con el contenido del mensaje
        es decir la pericion del usuario */
        body: JSON.stringify({ message: content }),
      });

      // si la respuesta del backend no fue VETE A LA MIERDA NO TE DEVUELVO NADA
      // no se ejecutara esta linea, pero si no es asi, pues da error
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      // `await` pausa la ejecución hasta que el backend devuelva la respuesta.
      // `response.json()` convierte la respuesta en un objeto JavaScript.
      // Sin `await`, el código seguiría ejecutándose y `data` sería undefined.
      const data = await response.json();

      // 4. Actualizar mensaje del asistente
      //concatena los mensajes previos (si no se eliminaria la conversacion)
      //con los mensajes nuevos
      setMessages((prev) => {
        //mensajes previos
        const newMessages = [...prev];
        //indice del mensaje anterior
        const lastIndex = newMessages.length - 1;
        //si el ultimo mensaje fue del assistente (gemini) nos respondio
        if (newMessages[lastIndex].role === "assistant") {
          //recupera la respuesta de gemini y la pone en mensajes
          //cerrando el ciclo y obteniendo la respuesta en el chat
          newMessages[lastIndex].content = data.reply || "Sin respuesta";
        }
        //devuelve el mensaje
        return newMessages;
      });

    }//fin del try 
    catch (error) {
      //aqui no tiene mucha ciencia, si da error la respuesta lanzara error por el chat
      console.error("Error al llamar al backend:", error);
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastIndex = newMessages.length - 1;
        if (newMessages[lastIndex].role === "assistant") {
          newMessages[lastIndex].content = "Error: No se pudo conectar con el servidor.";
        }
        return newMessages;
      });
    } finally {
      //finalmente deja de estar en estado de espera, los 3 puntos se van
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.App}>
      <header className={styles.Header}>
        <img className={styles.Logo} src="/chat-bot.png" alt="chat bot LMAO" />
        <h2 className={styles.Title}>AI Chatbot</h2>
      </header>
      <div className={styles.ChatContainer}>
        <Chat messages={messages} />
        {isLoading && <p className={styles.Loading}>El asistente está escribiendo...</p>}
      </div>
      <Controls onSend={handleContentSend} disabled={isLoading} />
    </div>
  );
}

export default App;