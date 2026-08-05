//============================================================
// 📁 ARCHIVO: src/assistants/googleai.js
// ============================================================
// PROPÓSITO:
//   Encapsula la lógica de comunicación con la IA (Gemini) en una clase.
//   Esto permite cambiar de proveedor (OpenAI, Claude, etc.) en el futuro
//   sin modificar el resto de la aplicación (principio de "separación de responsabilidades").
// ============================================================

// 🔗 URL del backend (donde corre el servidor Node.js).
// - En desarrollo: http://localhost:3000
// - En producción: Cambiar a la URL de tu servidor en la nube (Render, Railway, etc.).
const API_BACKEND = "http://localhost:3000"; // ← Ajusta si cambias de puerto

// ============================================================
// 📦 CLASE Assistant
// ============================================================
// Encapsula toda la lógica para hablar con la IA a través del backend.
// - El constructor no recibe parámetros porque el backend ya tiene la API Key.
// - El método `chat()` envía un mensaje y devuelve la respuesta.
// ============================================================

export class Assistant {
  /**
   * Constructor vacío.
   * No necesita inicializar nada porque el backend maneja:
   * - La API Key (protegida en .env)
   * - El modelo (gemini-3.5-flash)
   * - El historial de la conversación
   */
  constructor() {}

  /**Define un método asíncrono llamado chat que
   * Envía un mensaje al backend y devuelve la respuesta de Gemini.
   *
   * @param {string} content - El mensaje del usuario (texto).
   * @returns {string} - La respuesta generada por Gemini.
   * @throws {Error} - Si el backend falla o la respuesta no es válida.
   */
  async chat(content) {
    //si ocurre un error con el api de gemini o backend aqui lo detecta
    try {
      /**
       * aqui hace una request, la manda al backend algo
       * que el interpretara como 'req.body.message'(ver backend) 
       * y obtendra una response, puntualmente manda message: content
       * (la peticion del usuario), metodo post, headers json, bady etc
       * carpinteria lo normal de una request, esto se puede inspeccionar
       * en la pestaña red del navegador
       */
      const response = await fetch(`${API_BACKEND}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: content }),
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
    } 
    catch (error) {
      throw error; // ← Relanza el error para que App.jsx lo maneje
    }
  }
}