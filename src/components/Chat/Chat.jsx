//sirve para usar referencias a objetos del dom y hacer autoscrolling
import { useEffect, useRef } from 'react';
//este le da el formato a la respuesta de gemini eliminando simbolos raros
//encapsulas el contenido dentro de las etiquetas markdown
import Markdown from 'react-markdown';
//react-markdown permite resaltar código con remark-gfm (GitHub Flavored Markdown)
import remarkGfm from 'remark-gfm'; // ← Importa el plugin
import styles from './chat.module.css'


const WELCOME_MESSAGE = {
    role: 'assistant',
    content: 'hello! How can I assist you right now?'
};

/**
 * key={index} (identificador único para React)

className={styles.Message} (estilos del módulo CSS)

data-role={role} (atributo personalizado para diferenciar "user" de "assistant")

El contenido del mensaje dentro del <div>
 */

export function Chat({ messages })
{
    const messages_end_ref = useRef(null);

    useEffect(() => {
        messages_end_ref.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);

    return (
        <div className={styles.Chat} > 
            {[WELCOME_MESSAGE, ...messages].map(({ role, content }, index ) => (
                <div key={index} className={styles.Message} data-role={role} >
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
                        {content}
                    </Markdown>
                </div>
            ))} 

            <div ref={messages_end_ref}></div> 
        </div>
    );
    
}