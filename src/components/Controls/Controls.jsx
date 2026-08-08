// esto permite a un texarea o contenedor ser autodimensionable
// es el efecto de deepseek cuando metes mucho texto el input crece automaticamente
import TextareaAutosize from 'react-textarea-autosize';
// se usa el use effect y use ref para poder manejar referencias de estado
// del texarea y manejar el autofocus con 'Ref'
import { useEffect, useRef } from "react";

import { useState } from "react";
import styles from "./Controls.module.css";

export function Controls({ is_disable = false ,onSend }) {
    const textarea_ref = useRef(null); // almacenara el estado del textarea
    const [content, setContent] = useState("");

    //si el desabilitador cambia de un valor a false le da el focus
    useEffect(() => {
        if (!is_disable) {
            textarea_ref.current.focus();
        }
    }, [is_disable]);

    function handleContentChange(event) {
        setContent(event.target.value);
    }

    function handleContentSend() {
        if(content.length > 0) {
            onSend(content);
            setContent("");
        }
    }

    function handleEnterPress(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleContentSend();

        }
    }

    return (
        <div className={styles.Controls}>
            <div className={styles.TextAreaContainer}>
                <TextareaAutosize 
                    ref={textarea_ref} //autofocus despues de recibir respuesta
                    className={styles.TextArea} 
                    disabled={is_disable} //se desavilita despues de mandar un mensaje hasta que reciba respuesta
                    placeholder="Message AI Chatbot" 
                    value={content}
                    onChange={handleContentChange}
                    onKeyDown={handleEnterPress}
                    minRows={1}
                    maxRows={10}
                >
                </TextareaAutosize>
            </div>
            <button className={styles.Button} disabled={is_disable} onClick={handleContentSend}> 
                <SendIcon/>
            </button>
        </div>
    );
}

function SendIcon(){
    return(
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M120-160v-240l320-80-320-80v-240l760 320-760 320Z"/></svg>
    );
}