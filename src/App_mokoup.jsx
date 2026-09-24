import { useState, useCallback, useContext, useMemo } from 'react';
import { useImmer } from 'use-immer';
//ids
import { v4 as uuidv4 } from 'uuid';
//componentes
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import Controladores from './components/Controladores';
import { Loader } from './components/Loader/Loader';

// importa el contexto para que envuelva la aplicacion entera
//de esta manera todos los componentes tienen acceso al value de ThemeContext
import { ThemeContext } from './context/ThemeContext';
import { SelectorAsistente } from './components/SelectorAsistente/SelectorAsistente';


const CHATS = [
  {
    id: 2,
    title: "Gemini AI vs ChatGPT",
    messages: [
      { role: "user", content: "What is better ChatGPT or Gemini?" },
      {
        role: "assistant",
        content: "Hi! Can you explain for what type of tasks you will use it?",
      },
    ],
  },
  {
    id: 4,
    title: "How to use AI tools in your daily life",
    messages: [
      { role: "user", content: "Hey! How to use AI in my life?" },
      {
        role: "assistant",
        content: "Hi! Would you like to use it for work or for hobbies?",
      },
    ],
  },
];

const App = () => {
  //variable para el cambio de estado, que cambiara el valor por defecto del context
  const [colorsheme, updateColorsheme] = useImmer('dark');
  const [active, updateActive] = useImmer(false);

  const [asistente, updateAsistente] = useImmer(null);
  const [messages, updateMessages] = useImmer([]);
  const [isLoading, updateIsLoading] = useImmer(false);
  const [isStreaming, updateIsStreaming] = useImmer(false);
  //variables para los chats
  const [chats, updateChats] = useImmer(CHATS);
  const [activeChatId, updateActiveChatId] = useImmer(2);
  //se usa useMemo para optimizar, ya que es un calculo pesado recorrer todos los chats
  const activeChatMessages = useMemo(
    () => chats.find(({ id }) => id === activeChatId)?.messages ?? [],
    [chats, activeChatId]
  );

  // Clases dinámicas de Tailwind según el tema activo
  const themeBg = colorsheme === 'dark' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-900';
  const buttonThemeClass = colorsheme === 'dark'
    ? 'bg-slate-700 text-white hover:bg-slate-600'
    : 'bg-slate-300 text-slate-800 hover:bg-slate-400';

  const updateLastMessageContent = (content) => {
    updateMessages((draft) => {
      const lastMessage = draft[draft.length - 1];
      if (lastMessage) {
        lastMessage.content += content;
      }
    });
  };

  const manejarCambioAsistente = useCallback((nuevoAsistente) => {
    updateAsistente(nuevoAsistente);
    console.log("✅ Asistente cambiado:", nuevoAsistente.constructor.name);
  }, []);

  const manejarMensajeNuevo = async (new_message) => {
    //se añade un nuevo mensaje del usuario
    updateMessages((draft) => {
      draft.push({ role: "user", content: new_message });
    });
    //se establece la bandera de esta cargando a true
    updateIsLoading(true);
    // se añade un mensaje nuevo al final del asistente un mensaje de espera
    updateMessages(function (draft) {
      draft.push({ role: 'assistant', content: "..." });
    });

    //inicio del try-catch
    try {
      const stream = asistente.chatStream(new_message);
      let isFirstChunk = true;

      for await (const chunk of stream) {
        if (isFirstChunk) {
          isFirstChunk = false;
          //actualiza los mensajes si el ultimo mensaje fue el del asistente
          updateMessages((draft) => {
            const lastIndex = draft.length - 1;
            if (draft[lastIndex]?.role === "assistant") {
              draft[lastIndex].content = chunk;
            }
          });

          updateIsLoading(false);
        } else {
          updateLastMessageContent(chunk);
        }
      }
      updateIsStreaming(false);
    } catch (error) {
      console.error("Error en streaming:", error);
      
      updateMessages((draft) => {
        draft.push({role: "system", content: error?.message ?? "Sorry, I couldn't process your request. Please try again!"});
      });

      updateIsLoading(false);
      updateIsStreaming(false);
    }
  };

  /**
   * funcion que maneja el estado de activacion del sidebar
   */
  function handleClickButton() {
    //alert('me clickeaste papy');
    updateActive(draft => !draft);
  }

  function actualizarChats(messages = [], title = undefined) {
    updateChats((draft) => {
      const chat = draft.find((c) => c.id === activeChatId);
      if (chat) {
        chat.title = chat.title ?? title;
      chat.messages = messages
      }
      
    });
  }

  function handleChatMessagesUpdate(messages){
          //se le añadira un titulo basado en las primeras 7 palabras que intriuscamos
    const title = messages[0]?.content.split(" ").slice(0, 7).join(" ");

    actualizarChats(messages, title);
  }

  function handleNewChatCreate() {
    const id = uuidv4();

    updateActiveChatId(id);
    updateChats((draft) => {
      draft.push({ id, messages: [] });
    });
  }

  function handleActiveChatIdChange(id) {
    updateActiveChatId(id);
    updateChats(function(draft){
      //elimina el elemento cuya longitud sea 0, 
      //lo hace devolviendo solo los elementos cuya longitud sea > 0
      return draft.filter(({ messages }) => messages.length > 0)
    });
  }

  return (
    <ThemeContext value={colorsheme}>
      {/**contenedor de la applicacion 
         *
         *   div de prueba para responsive:  
            <div className="app h-screen text-white max-sm:bg-indigo-500 sm:bg-amber-600 md:bg-blue-500 lg:bg-cyan-700 ">
         */}
      <div className={"app h-screen h-dvh flex flex-col overflow-hidden text-base/6 md:text-lg/7 lg:text-xl/7 transition-colors " + themeBg}>

        {/**flex flex-col indica que el header siempre estara arriba */}
        <div className='flex flex-col h-[calc(100%-5vw)] sm:h-[calc(100%-4vw) md:md:h-[calc(100%-3vw) lg:md:h-[calc(100%-2vw)'>
          {/**LOGO DEL CHAT, BOTON DE CAMBIAR TEMA, TEXTO DE CHATBOT, BANNER */}
          <div className='flex flex-row flex-shrink-0 justify-between w-full h-auto py-2 px-4 font-mono text-center text-2xl md:text-3xl'>
            {/**boton para activar y desactivar el sidebar */}
            <div className={''}><button className={'w-20 h-10 ' + buttonThemeClass} onClick={handleClickButton} >menu</button></div>
            <Header className='' ></Header>
            <div className=''>

              {/**boton para cambiar de tema */}
              <button
                className={buttonThemeClass}
                onClick={
                  function () {
                    if (colorsheme == 'dark') {
                      updateColorsheme(draft => draft = 'light');
                    } else if (colorsheme == 'light') {
                      updateColorsheme(draft => draft = 'dark')
                    } else {
                      throw new Error("ERROR EN EL VALOR DEL COLORSHEME");
                    }
                    //console.log(colorsheme);
                  }
                }
              >
                {colorsheme === 'dark' ? 'light-mode' : 'dark-mode'}
              </button>

            </div>
          </div>

          {/** AREA CENTRAL: SIDEBAR + CONTENIDO PRINCIPAL
               * NOTA: BREACKPOINTS: 
               * 360PX por defecto luego
               * sm	40rem (640px)	@media (width >= 40rem) { ... }
                  md	48rem (768px)	@media (width >= 48rem) { ... }
                  lg	64rem (1024px)	@media (width >= 64rem) { ... }
               */}
          <div className={`flex flex-1  min-h-0 overflow-hidden flex-row justify-center transition-all  relative top-0 right-0      
              ${active
              ? 'w-full right-0'
              : 'w-[calc(100%+40vw)] right-[40vw] sm:w-[calc(100%+40vw)] sm:right-[40vw] md:w-[calc(100%+25vw)] md:right-[25vw] lg:w-[calc(100%+20vw)] lg:right-[20vw]'
            }`}
          >
            {/** sidebar DESPLEGABLE, A LA IZQUIERDA DEL ASIDE*/}
            <div
              className={'overflow-y-auto h-full w-[40vw] sm:w-[40vw] md:w-[25vw] lg:w-[20vw] ' +
                ` transition-all duration-300`}
            >
              <Sidebar 
                handleClick={handleClickButton} 
                chats={chats} 
                activeChatId={activeChatId} 
                activeChatMessages={activeChatMessages}
                onActiveChatIdChange={handleActiveChatIdChange} 
                onNewChatCreate={handleNewChatCreate}
              >

                </Sidebar>
            </div>

            {/**contenido principal, el area de los mensajes */}
            <div className='flex-1 h-full flex flex-col overflow-hidden min-h-0 relative'>
              <Chat 
                messages={messages} 
                updateMessages={updateMessages} 
                chatId={activeChatId} 
                chatMessages={activeChatMessages} 
                onChatMessagesUpdate={handleChatMessagesUpdate}
              >
              </Chat>
              {isLoading && <Loader />}
            </div>

          </div>

          {/**FOOTER area del controlador, donde esta el input y el boton de enviar */}
          <div className='min-h-18 max-h-70 md:max-h-90 flex-none shrink-0 p-2 border-t mb-4 border-slate-700/30'>
            <SelectorAsistente onAsistenteCambiar={manejarCambioAsistente} />
            <Controladores onSend={manejarMensajeNuevo} isDisabled={isLoading || isStreaming} >
            </Controladores>
            
          </div>
        </div>


      </div> {/**fin del contenedor general de la aplicacion */}
    </ThemeContext>

  );
};

export default App;