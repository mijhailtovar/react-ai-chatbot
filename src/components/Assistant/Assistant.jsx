// src/components/Assistant/Assistant.jsx
import { useEffect, useState } from "react";
import { Assistant as GoogleAIAssistant } from "../../assistants/googleai.js";
import { Assistant as DeepSeekAIAssistant } from "../../assistants/deepseek.js";

//conserva el nombre de las clases de los assistentes con la misma key
//que en las opciones del select
const array_asistentes = {
    googleai: GoogleAIAssistant,
    deepseekai: DeepSeekAIAssistant,
};

export function Assistant({cambio_asistente}) {
    //lee la variable del tema oscuro-claro
    //const isDark = props.isDark;

  const [value, setValue] = useState("googleai");

  function handleValueChange(event) {
    setValue(event.target.value);
  }

  //cambia y crea una clase de un assistente solo si cambiamos el valor del select
  useEffect(function(){
    const clase_asistente = array_asistentes[value];

    if (!clase_asistente) {
        throw new Error(`Unknown assistant: ${value}`);
    }

    cambio_asistente(new AssistantClass());
  }, [value]);

  return (
    <div className={`bg-amber-800 p-2 rounded flex items-center gap-2`}>
      <span className="text-white">Assistant:</span>
      <select
        value={value}
        onChange={handleValueChange}
        className="bg-gray-700 text-white p-1 rounded"
      >
        <option value="googleai">Google AI</option>
        <option value="deepseekai">DeepSeek AI</option>
      </select>
    </div>
  );
}