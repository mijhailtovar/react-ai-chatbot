// src/App.jsx
import { useState, useCallback, useContext } from 'react';
import { SelectorAsistente } from './components/SelectorAsistente/SelectorAsistente';
import { Chat } from './components/chat/Chat';
import { Controls } from './components/Controls/Controls';
import { Loader } from './components/Loader/Loader';
import { ThemeContext } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import { Sidebar } from './components/Sidebar/Sidebar';

function App() {
  const [asistente, setAsistente] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const { isDark } = useContext(ThemeContext);

  // Estado para controlar si el sidebar está abierto en móvil
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Función para alternar el sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Función para cerrar el sidebar (al hacer clic en un elemento)
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const updateLastMessageContent = (content) => {
    setMessages((prev) =>
      prev.map((msg, idx) =>
        idx === prev.length - 1
          ? { ...msg, content: `${msg.content}${content}` }
          : msg
      )
    );
  };

  const manejarCambioAsistente = useCallback((nuevoAsistente) => {
    setAsistente(nuevoAsistente);
    console.log("✅ Asistente cambiado:", nuevoAsistente.constructor.name);
  }, []);

  const manejarMensajeNuevo = async (new_message) => {
    setMessages((prev) => [...prev, { role: "user", content: new_message }]);
    setIsLoading(true);
    setMessages((prev) => [...prev, { role: "assistant", content: "..." }]);

    try {
      const stream = asistente.chatStream(new_message);
      let isFirstChunk = true;

      for await (const chunk of stream) {
        if (isFirstChunk) {
          isFirstChunk = false;
          setMessages((prev) => {
            const newMessages = [...prev];
            const lastIndex = newMessages.length - 1;
            if (newMessages[lastIndex].role === "assistant") {
              newMessages[lastIndex].content = chunk;
            }
            return newMessages;
          });
          setIsLoading(false);
          setIsStreaming(true);
        } else {
          updateLastMessageContent(chunk);
        }
      }
      setIsStreaming(false);
    } catch (error) {
      console.error("Error en streaming:", error);
      setMessages((prev) => [
        ...prev,
        {
          content: error?.message ?? "Sorry, I couldn't process your request. Please try again!",
          role: "system",
        },
      ]);
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      
      <div className="max-w-3xl lg:max-w-4xl xl:max-w-6xl mx-auto px-4 h-screen flex flex-col">
        <header className={`flex items-center justify-between py-4 border-b ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
          <div className="w-12 md:w-16 xl:w-20"></div>
          <div className="flex items-center justify-center gap-3">
            <img src="/chat-bot.png" alt="Chatbot IA" className="w-12 h-12 md:w-16 md:h-16 xl:w-20 xl:h-20" />
            <h1 className="text-2xl md:text-3xl xl:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-blue-500">
              AI Chatbot
            </h1>
          </div>
          <ThemeToggle />
        </header>

        {/**contenedor del contenido principal */}
        <div className='flex flex-1 gap-4 w-full overflow-hiddens'>
          <Sidebar 
          
          />
          {/**semanticamente en html el main es donde se almacena la logica y contenido principal de nuestra aplicacion */}
          
          <main className="flex flex-col flex-1 gap-4">
            <Chat messages={messages} isDark={isDark} />
            {isLoading && <Loader />}

            <Controls onSend={manejarMensajeNuevo} isDark={isDark} isDisabled={isLoading || isStreaming} />
            <SelectorAsistente onAsistenteCambiar={manejarCambioAsistente} />
          </main>
        </div>
        
          
        
        

      </div>
    </div>
  );
}

export default App;