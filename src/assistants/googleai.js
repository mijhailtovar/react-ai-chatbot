const API_BACKEND = "http://localhost:3000";

export class Assistant {
  constructor(model = "gemini-2.5-flash") {
    this.model = model;
  }

async chat(content, history = []) {
  try {
    const response = await fetch(`${API_BACKEND}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        message: content,
        history: history,        // ← AÑADIDO: envía el historial
        model: this.model
      }),
    });
     // verifica si la respuesta del BACKEND NO FUE EXITOSA
      // response.ok` es `true` si el código de estado HTTP es 2xx (200-299)
      // response.status devuelve el numero exacto del error 
      //SI HAY ERRORES LANZA UN ERROR AL FRONTEND
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // convierte el json de la respuesta en un objeto javascript
      // se usa await como precaucion en caso de que tarde en procesarlo
      // (si es una respuesta muy larga)
      const data = await response.json();

      // devuelve la respuesta a App.jsx
      return data.reply; // ← La respuesta de Gemini desde tu backend
  } catch (error) {
    throw error;
  }
}

async *chatStream(content, history = []) {
  try {
    const response = await fetch(`${API_BACKEND}/api/chatStream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        message: content,
        history: history,        // ← AÑADIDO: envía el historial
        model: this.model
      }),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let chunkCount = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        //console.log(`✅ Stream completado en el frontend. Total fragmentos: ${chunkCount}`);
        break;
      }

      const chunk = decoder.decode(value);
      chunkCount++;
      //console.log(`📥 Fragmento #${chunkCount}: ${chunk}`);
      yield chunk;
    }
  } catch (error) {
    throw error;
  }
}
}