// src/components/Chat.jsx
import React, { useEffect, useRef, useContext } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ThemeContext } from "../context/ThemeContext";

export default function Chat({ messages = [] }) {
  const colorsheme = useContext(ThemeContext);
  const isDark = colorsheme === "dark";
  const messagesEndRef = useRef(null);

  // Auto-scroll al final cuando cambian los mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const chatTheme = isDark
    ? 'bg-slate-900 text-slate-100'
    : 'bg-white text-slate-800';

  return (
    <main className={`${chatTheme} h-full overflow-y-auto p-4`}>
      {messages.length === 0 ? (
        // Mensaje de bienvenida
        <div className="flex items-end gap-2">
          <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-sm font-bold text-black">
            AI
          </div>
          <div className={`max-w-[85%] rounded-2xl px-4 py-2 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
            <p className="text-sm md:text-base lg:text-xl">
              Hola, ¿cómo puedo ayudarte hoy?
            </p>
          </div>
        </div>
      ) : (
        messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                msg.role === 'user' ? 'bg-blue-500 order-2' : 'bg-yellow-400 text-black'
              }`}
            >
              {msg.role === 'user' ? 'U' : 'IA'}
            </div>
            <div
              className={`max-w-[85%] lg:max-w-[75%] rounded-2xl px-4 py-2 ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : msg.role === 'assistant'
                    ? (isDark ? 'bg-slate-800 text-slate-100' : 'bg-slate-200 text-slate-900')
                    : 'bg-red-500 text-white'
              }`}
            >
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
      <div ref={messagesEndRef} />
    </main>
  );
}