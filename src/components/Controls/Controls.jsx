// esto permite a un texarea o contenedor ser autodimensionable
// es el efecto de deepseek cuando metes mucho texto el input crece automaticamente
import TextareaAutosize from 'react-textarea-autosize';

import { useState } from "react";
import styles from "./Controls.module.css";

export function Controls({ is_disable = false ,onSend }) {
    const [content, setContent] = useState("");

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
                    className={styles.TextArea} 
                    disabled={is_disable}
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