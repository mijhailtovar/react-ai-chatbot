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
    const [seleccion, setSeleccion] = useState("google");

    // cada vez que cambia la selección, creamos una nueva isntancia
    useEffect(() => {
        // Buscamos la clase en el mapa
        const ClaseAsistente = mapaAsistentes[seleccion];

        // Si no existe, mostramos un error y salimos
        if (!ClaseAsistente) {
            console.error(`Asistente desconocido: ${seleccion}`);
            return;
        }

        // Creamos una instancia (ej. new deepseek)
        const nuevoAsistente = new ClaseAsistente();

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
        <option value="google">Gemini (google_ai)</option>
        <option value="deepseek">deepseek</option>
        <option value="openai">GhatGPT (openai)</option>
      </select>
    </div>
  );

}