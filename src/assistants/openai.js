// src/assistants/openai.js
// Este archivo encapsula la lógica para OpenAI (ChatGPT)

const API_BACKEND = "http://localhost:3000";

export class OpenAIAssistant {
  async chat(content) {
    try {
      const response = await fetch(`${API_BACKEND}/api/chat-openai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      return data.reply; // ← Respuesta de OpenAI
    } catch (error) {
      throw error;
    }
  }
}