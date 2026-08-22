// src/assistants/deepseek.js

// 🔗 URL del backend (donde corre el servidor Node.js).
const API_BACKEND = "http://localhost:3000";

// ============================================================
// 📦 CLASE DeepSeekAssistant (se llama assistant para poder cambiar facilmente en app.jsx) (USANDO OPENROUTER)
// ============================================================
export class Assistant {
  constructor() {}

  async chat(content, history = []) {
    try {
      // 1. Petición POST a /api/chat-openrouter
      const response = await fetch(`${API_BACKEND}/api/chat-openrouter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: content, history }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      return data.reply;
    } catch (error) {
      throw error;
    }
  }

  async *chatStream(content, history = []) {
    try {
      // 1. Petición POST a /api/chatStream-openrouter (si la implementas)
      const response = await fetch(`${API_BACKEND}/api/chatStream-openrouter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: content, history }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        yield chunk;
      }
    } catch (error) {
      throw error;
    }
  }
}