// backend/index.js
//llama al archivo app.js en el backend que realmente hace la logica aqui
const app = require('./app');

// Define el puerto donde el backend escuchará las peticiones.
// process.env.PORT es usado en producción (Render, Railway, etc.).
// En desarrollo local, usa el puerto 3000.
const PORT = process.env.PORT || 3000;

//pone el backend en escucha, lo activa en el puerto 3000 o process.env.port
//para activar el backend dirigete a la carpeta donde esta este archivo
//a la raiz del proycto y ejecuta npm run dev
//deveria funcionar, si no verifica que estes en la direccion
//C:\Users\mijha\Documents\React_js_AI Chatbot built with ChatGPT_Gemini and DeepSeek\projects\react-ai-chatbot\backend
app.listen(PORT, () => {
    console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
});