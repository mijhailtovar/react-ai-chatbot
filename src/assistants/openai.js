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
// 🔗 URL del backend (lee la variable de Vercel o usa localhost para desarrollo local).
const API_BACKEND = import.meta.env.VITE_API_URL || "http://localhost:3000";

// ============================================================
// 📦 CLASE OpenAIAssistant (ACTUALIZADA PARA OPENROUTER)
// ============================================================
export class OpenAIAssistant {
  constructor(model = "openai/gpt-4o-mini") {
    // Aseguramos que el modelo lleve el prefijo correcto que exige OpenRouter
    this.model = model.startsWith("openai/") ? model : `openai/${model}`;
  }

  /**
   * Envía un mensaje al backend y devuelve la respuesta de OpenAI a través de OpenRouter.
   *
   * @param {string} content - El mensaje del usuario (texto).
   * @param {Array} history - Historial de la conversación (opcional).
   * @returns {string} - La respuesta generada.
   */
  async chat(content, history = []) {
    try {
      const response = await fetch(`${API_BACKEND}/api/chat-openai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          message: content,
          history,
          model: this.model // Envía "openai/gpt-4o-mini" al backend
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(`Error \({response.status}:\){errData.details || response.statusText}`);
      }

      const data = await response.json();
      return data.reply;
    } catch (error) {
      console.error('🔥 Error en OpenAIAssistant.chat():', error);
      throw error;
    }
  }

  /**
   * Método que devuelve un generador asíncrono para streaming vía OpenRouter.
   *
   * @param {string} content - El mensaje del usuario (texto).
   * @param {Array} history - Historial de la conversación (opcional).
   * @returns {AsyncGenerator} - Generador que produce fragmentos.
   */
  async *chatStream(content, history = []) {
    try {
      const response = await fetch(`${API_BACKEND}/api/chatStream-openai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          message: content,
          history: history,
          model: this.model // Envía "openai/gpt-4o-mini" al backend
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(`Error \({response.status}:\){errData.details || response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let chunkCount = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log(`✅ Stream de OpenAI (OpenRouter) completado. Total fragmentos: ${chunkCount}`);
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        chunkCount++;
        yield chunk; 
      }
    } catch (error) {
      console.error('🔥 Error en streaming de OpenAIAssistant:', error);
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