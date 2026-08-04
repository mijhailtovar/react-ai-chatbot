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
    return (
        <div className={styles.Chat} > 
            {[WELCOME_MESSAGE, ...messages].map(({ role, content }, index ) => (
                <div key={index} className={styles.Message} data-role={role} >
                    {content}
                </div>
            ))} 
        </div>
    );
    
}