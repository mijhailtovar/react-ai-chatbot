// src/components/Chat/Chat.jsx

// 1. Importamos los hooks necesarios de React
// - useEffect: Para ejecutar código después de renderizar (como el scroll)
// - useRef: Para crear una referencia a un elemento del DOM (el final del chat)
// - useMemo: Para optimizar la agrupación de mensajes
import { useEffect, useMemo, useRef } from 'react';

// 2. Importamos los componentes de Markdown
import Markdown from 'react-markdown'; // Renderiza texto con formato (negritas, listas, etc.)
import remarkGfm from 'remark-gfm'; // Extensión para soportar tablas, tachados, etc.

// 3. Importamos los estilos del componente
import styles from './chat.module.css';

// 4. Definimos el mensaje de bienvenida
// Es un objeto simple, con rol de asistente y un saludo
const WELCOME_MESSAGE = {
  role: 'assistant',
  content: '¡Hola! ¿En qué puedo ayudarte hoy?'
};

// 5. Función principal del componente Chat
export function Chat({ messages }) {
  // 5.1 Referencia al final del contenedor del chat
  // messages_end_ref es un "marcador" que apunta al último elemento del chat
  // Lo usaremos para hacer scroll hacia él
  const messagesEndRef = useRef(null);

  // 5.2 Agrupación de mensajes usando useMemo
  // useMemo se ejecuta solo cuando 'messages' cambia, para optimizar el rendimiento
  const groupedMessages = useMemo(() => {
    // Si no hay mensajes, devolvemos un array con el mensaje de bienvenida
    if (messages.length === 0) {
      return [WELCOME_MESSAGE];
    }

    // Creamos un array vacío para almacenar los mensajes agrupados
    const grouped = [];
    // Variable temporal para construir un grupo de mensajes
    let currentGroup = [];

    // Recorremos cada mensaje del array 'messages'
    messages.forEach((message) => {
      // Si el mensaje actual es del usuario y ya hay mensajes en el grupo actual,
      // significa que el grupo actual debe cerrarse y comenzar uno nuevo.
      if (message.role === 'user' && currentGroup.length > 0) {
        grouped.push(currentGroup); // Guardamos el grupo anterior
        currentGroup = []; // Reiniciamos para el nuevo grupo
      }
      // Añadimos el mensaje actual al grupo actual
      currentGroup.push(message);
    });

    // Después del bucle, si quedan mensajes en el grupo actual, los guardamos
    if (currentGroup.length > 0) {
      grouped.push(currentGroup);
    }

    // Devolvemos el array de grupos agrupados
    return grouped;
  }, [messages]); // Dependencia: se recalcula cada vez que 'messages' cambia

  // 5.3 Efecto para el auto-scroll
  // useEffect se ejecuta después de cada renderizado
  useEffect(() => {
    // Si la referencia existe (messagesEndRef.current), hacemos scroll hacia ella
    // behavior: "smooth" para que sea un desplazamiento suave
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]); // Dependencia: se ejecuta cada vez que 'messages' cambia

  // 6. Renderizado del componente
  return (
    <div className={styles.Chat}>
      {/* 6.1 Renderizado de los mensajes agrupados */}
      {/* Recorremos cada grupo de mensajes */}
      {groupedMessages.map((group, groupIndex) => (
        // Si el grupo es un array (agrupación), lo recorremos
        // Si es un mensaje suelto (como el de bienvenida), lo envolvemos en un array
        <div key={groupIndex} className={styles.Group}>
          {/* Recorremos cada mensaje dentro del grupo */}
          {Array.isArray(group) ? (
            // Si el grupo es un array, renderizamos todos sus mensajes
            group.map(({ role, content }, messageIndex) => (
              <div
                key={messageIndex}
                className={styles.Message}
                data-role={role}
              >
                {/* Renderizamos el contenido con Markdown */}
                <Markdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // Configuramos que los enlaces se abran en nueva pestaña
                    a: ({ href, children }) => (
                      <a href={href} target="_blank" rel="noopener noreferrer">
                        {children}
                      </a>
                    )
                  }}
                >
                  {content}
                </Markdown>
              </div>
            ))
          ) : (
            // Si no es un array (caso del mensaje de bienvenida), lo renderizamos directamente
            <div
              key={0}
              className={styles.Message}
              data-role={group.role}
            >
              <Markdown
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({ href, children }) => (
                    <a href={href} target="_blank" rel="noopener noreferrer">
                      {children}
                    </a>
                  )
                }}
              >
                {group.content}
              </Markdown>
            </div>
          )}
        </div>
      ))}
      {/* 6.2 Elemento fantasma para el auto-scroll */}
      {/* messagesEndRef se asigna a este div, que siempre estará al final del chat */}
      <div ref={messagesEndRef} />
    </div>
  );
}