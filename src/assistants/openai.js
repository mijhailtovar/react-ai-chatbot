// ============================================================
// 📁 ARCHIVO: src/assistants/openai.js
// ============================================================
// PROPÓSITO:
//   Encapsula la lógica de comunicación con OpenAI (ChatGPT) en una clase.
//   Esto permite cambiar de proveedor (Gemini, Claude, etc.) en el futuro
//   sin modificar el resto de la aplicación.
// ============================================================
// 
// 🔒 NOTA DE SEGURIDAD:
//   Este archivo contiene DOS formas de usar OpenAI:
//   1. A través del backend (recomendado): La API Key está protegida.
//   2. Directamente desde el frontend (NO recomendado en producción):
//      - Usa `dangerouslyAllowBrowser: true`.
//      - Expone la API Key en el navegador.
//      - Solo útil para pruebas locales o demostraciones.
// ============================================================

// 🔗 URL del backend (donde corre el servidor Node.js).
// - En desarrollo: http://localhost:3000
// - En producción: Cambiar a la URL de tu servidor en la nube (Render, Railway, etc.).
const API_BACKEND = "http://localhost:3000";

// ============================================================
// 📦 CLASE OpenAIAssistant (VERSIÓN CON BACKEND - RECOMENDADA)
// ============================================================
// Esta clase usa el backend como puente para proteger la API Key.
// - El constructor no recibe parámetros.
// - El método `chat()` envía un mensaje y devuelve la respuesta.
// - El método `chatStream()` devuelve un generador asíncrono para streaming.
// ============================================================

export class OpenAIAssistant {
  /**
   * Constructor vacío.
   * No necesita inicializar nada porque el backend maneja:
   * - La API Key (protegida en .env)
   * - El modelo (gpt-4o-mini o el que esté configurado)
   * - El historial de la conversación
   */
  constructor() {}

  /**
   * Envía un mensaje al backend y devuelve la respuesta de OpenAI (ChatGPT).
   *
   * @param {string} content - El mensaje del usuario (texto).
   * @param {Array} history - Historial de la conversación (opcional, lo maneja el backend).
   * @returns {string} - La respuesta generada por OpenAI.
   * @throws {Error} - Si el backend falla o la respuesta no es válida.
   */
  async chat(content, history = []) {
    try {
      // 1. Enviar petición al backend
      const response = await fetch(`${API_BACKEND}/api/chat-openai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // 2. Enviar mensaje y opcionalmente el historial
        body: JSON.stringify({ 
          message: content,
          history: history, // ← El backend puede usar esto para mantener contexto
        }),
      });

      // 3. Verificar que la respuesta fue exitosa
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // 4. Convertir respuesta a JSON
      const data = await response.json();

      // 5. Devolver la respuesta de OpenAI
      return data.reply;
    } catch (error) {
      // 6. Relanzar el error para que quien llame a chat() lo maneje
      throw error;
    }
  }

  /**
   * Método que devuelve un generador asíncrono para streaming.
   *
   * @param {string} content - El mensaje del usuario (texto).
   * @param {Array} history - Historial de la conversación (opcional).
   * @returns {AsyncGenerator<string>} - Generador que produce fragmentos.
   * @throws {Error} - Si el backend falla.
   */
  async *chatStream(content, history = []) {
    try {
      // 1. Enviar petición al backend con streaming
      const response = await fetch(`${API_BACKEND}/api/chatStream-openai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          message: content,
          history: history,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // 2. Leer la respuesta como un stream de texto
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let chunkCount = 0;

      // 3. Iterar sobre los fragmentos a medida que llegan
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log(`✅ Stream de OpenAI completado. Total fragmentos: ${chunkCount}`);
          break;
        }

        const chunk = decoder.decode(value);
        chunkCount++;
        console.log(`📥 Fragmento #${chunkCount} (OpenAI): ${chunk}`);
        yield chunk; // ← Devuelve cada fragmento
      }
    } catch (error) {
      console.error('🔥 Error en streaming de OpenAI:', error);
      throw error;
    }
  }
}

// ============================================================
// 📦 CLASE OpenAIAssistantDirect (VERSIÓN DIRECTA - SOLO PRUEBAS)
// ============================================================
// ⚠️ ADVERTENCIA:
//   Esta clase usa `dangerouslyAllowBrowser: true` y expone la API Key.
//   NO debe usarse en producción. Solo para pruebas locales o demos.
// ============================================================
// 
// Esta es la versión que se parece al código del profesor.
// - Usa la SDK de OpenAI directamente en el frontend.
// - La API Key se lee desde `import.meta.env.VITE_OPEN_AI_API_KEY`.
// - El historial se maneja en el frontend.
// ============================================================

/*
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPEN_AI_API_KEY,
  dangerouslyAllowBrowser: true, // ← Esto permite usar OpenAI en el navegador
});

export class OpenAIAssistantDirect {
  #model;

  constructor(model = "gpt-4o-mini") {
    this.#model = model;
  }

  async chat(content, history) {
    try {
      const result = await openai.chat.completions.create({
        model: this.#model,
        messages: [...history, { content, role: "user" }],
      });

      return result.choices[0].message.content;
    } catch (error) {
      throw error;
    }
  }

  async *chatStream(content, history) {
    try {
      const result = await openai.chat.completions.create({
        model: this.#model,
        messages: [...history, { content, role: "user" }],
        stream: true,
      });

      for await (const chunk of result) {
        const content = chunk.choices[0]?.delta?.content || "";
        yield content;
      }
    } catch (error) {
      throw error;
    }
  }
}
*/