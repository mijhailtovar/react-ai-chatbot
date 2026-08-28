// src/components/SelectorAsistente/SelectorAsistente.jsx
import { useState, useEffect } from "react";
//importa desde el index.js dentro de asistentes todos los asistentes o IAs
import {GoogleAIAssistant, DeepSeekAssistant, OpenAIAssistant} from "../../assistants/index";

// 1. Mapeo de nombres a clases (como un diccionario)
const mapaAsistentes = {
    google: GoogleAIAssistant,
    deepseek: DeepSeekAssistant,
    openai: OpenAIAssistant,
  };

export function SelectorAsistente({ onAsistenteCambiar }) {
    // estado: que asistente está seleccionado (por defecto "google_ai gemini")
    const [seleccion, setSeleccion] = useState("google:gemini-3.5-flash");

    // cada vez que cambia la selección, creamos una nueva isntancia
    useEffect(() => {
      //usa el metodo split para separar el asistente (google,deepseel etc) y el modelo 
        const [asistente, modelo] = seleccion.split(":");
        // Buscamos la clase en el mapa
        const ClaseAsistente = mapaAsistentes[asistente];

        // Si no existe, mostramos un error y salimos
        if (!ClaseAsistente) {
            console.error(`Asistente desconocido: ${asistente} o modelo ${modelo}`);
            return;
        }

        // Creamos una instancia (ej. new deepseek) y le pasamos el modelo por ejemplo en google seria
        // new GoogleAIAssistant(google:Gemini 3.5 Flash)
        //esto funciona porque el primer parametro en el constructor de estas clases es el modelo
        const nuevoAsistente = new ClaseAsistente(modelo);

        // La enviamos al componente padre (App.jsx) a través de la prop
        onAsistenteCambiar(nuevoAsistente);
    }, [seleccion, onAsistenteCambiar]); // Dependencias: se ejecuta cuando cambia seleccion

  // 4. Función que maneja el cambio en el <select>
    const manejarCambio = function(evento){
        setSeleccion(evento.target.value); //Actualiza el estado
    };

    // 5. Renderizado del selector
  return (
    <div className="flex items-center gap-2 p-3 bg-gray-800 rounded-lg">
      <span className="text-white font-medium">Elige un asistente:</span>
      <select
        value={seleccion}
        onChange={manejarCambio}
        className="bg-gray-700 text-white px-3 py-1 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <optgroup label="Google ai" >
          <option value="google:gemini-3.5-flash">Gemini 3.5 Flash</option>
          <option value="google:gemini-3.5-flash-lite">Gemini 3.5 Flash-Lite</option>
          <option value="google:gemini-3.1-flash-lite">Gemini 3.1 Flash-Lite</option>
        </optgroup>

        <optgroup label="DeepSeek AI" >
          <option value="deepseek:deepseek-v4-flash">deepseek-v4-flash</option>
        </optgroup>
        
        <optgroup label="Open AI">
          <option value="openai:gpt-4o-mini">gpt-4o-mini</option>
        </optgroup>
        
      </select>
    </div>
  );

}