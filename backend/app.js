// backend/app.js
/**
 * Explicación:
Express es un framework para Node.js que te permite crear servidores web 
y APIs de forma rápida y sencilla. Sin Express, tendrías que escribir 
mucho código manual para manejar peticiones HTTP, rutas, etc.

Analogía:
Express es como un restaurante: tú (el desarrollador) dices qué platos 
(rutas) ofreces y cómo se preparan (lógica). Express se encarga de la 
cocina (servidor), los meseros (peticiones) y la entrega (respuestas).
 */
const express = require('express'); // Importas la cocina
/*
importa cors para sortear el problema de aduana de google que
no permite que un navegador se comunique con la api de gemini
pero si un servidor este cors le dice a la aduana que se la pele
y lo deje porque es un server
*/
const cors = require('cors');
/**
 * Explicación:
dotenv es una librería que carga variables de entorno desde un 
archivo .env. Las variables de entorno son como configuraciones 
secretas que no quieres poner en tu código (como tu API Key).

Analogía:
Es como tener una caja fuerte (.env) donde guardas tus contraseñas. 
dotenv es la llave que abre esa caja y pone las contraseñas disponibles 
para tu código.
 */
const dotenv = require('dotenv'); // Importas la llave
dotenv.config(); // Abres la caja fuerte (carga las variables)
// Ahora puedes usar process.env.GOOGLE_API_KEY

const app = express(); // Montas tu restaurante
app.use(cors()); // El backend dice: "Acepto peticiones de cualquier origen"
/**
 * Explicación:
express.json() es un middleware que analiza (parsea) el cuerpo de las 
peticiones en formato JSON y lo convierte en un objeto JavaScript 
accesible en req.body.

Analogía:
Es como un traductor que recibe un mensaje en JSON 
(ej. {"message": "Hola"}) y lo convierte en un objeto JavaScript 
({ message: "Hola" }) para que puedas usarlo fácilmente.
 */
app.use(express.json()); // Traduce el JSON de la petición a objeto JS
// Luego puedes usar req.body.message

//url de prueba para comprobar la salud del backend
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend funcionando' });
});

/**
 * aqui si sucede lo importante, funcion async que recupera la request 
 * (mensaje del usuario) verifica que este lleno (que no este vacio)
 * luego pone en console log que el mensaje se recibio
 * importa la SDK (Software Development Kit (Kit de Desarrollo de Software)) de google que es google/genai para
 * usar las peticiones a gemini, verifica que el API_KEY (llave para usar
 * gemini la definiste en https://aistudio.google.com/app/api-keys?project=gen-lang-client-0498316877)
 * este correcta o al menos existente y en el objeto res (response = respuesta)
 * adjunta lo que respondio gemini y  lo lleva al frontend
 * 
 */
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || message.trim() === '') {
            return res.status(400).json({ error: 'El mensaje es obligatorio.' });
        }

        console.log('📩 Mensaje recibido:', message);

        const { GoogleGenAI } = require('@google/genai'); // Importas la SDK

        if (!process.env.GOOGLE_API_KEY) {
            throw new Error('GOOGLE_API_KEY no está definida en el archivo .env');
        }

        //crea el objeto para interactuar con la ia y le pasas la apikey
        const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

        // ✅ Usamos la misma sintaxis de interactions.create
        // La nueva versión debería ser compatible con este código.
        const interaction = await ai.interactions.create({
            model: "gemini-3.5-flash",
            input: message,
            system_instruction: "Eres un asistente útil, amigable y profesional, identificate siempre como chatbot de mijhail. Responde en el idioma del usuario (en el que el hable)."
        });

        console.log('🤖 Respuesta de Gemini obtenida.');
        // manda la respuesta al frontend App.jsx puntualmente a la variable
        // response en ese archivo
        res.json({ reply: interaction.output_text });

    } catch (error) {
        //captura los errores y los pasa por la consola del backend UTIL
        console.error('🔥 Error en Gemini:', error);
        console.error('📝 Detalles:', error.message);
        res.status(500).json({
            error: 'Error al procesar la solicitud',
            details: error.message
        });
    }
});

// backend/app.js
    app.post('/api/chatStream', async (req, res) => {
        try {
        const { message } = req.body;
    
        if (!message || message.trim() === '') {
            return res.status(400).json({ error: 'El mensaje es obligatorio.' });
        }
    
        console.log('📩 Mensaje recibido (stream):', message);
    
        const { GoogleGenAI } = require('@google/genai');
        const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
    
        // Configurar cabeceras para streaming
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Transfer-Encoding', 'chunked');
        res.setHeader('Cache-Control', 'no-cache');
    
        const interaction = await ai.interactions.create({
            model: "gemini-3.5-flash",
            input: message,
            system_instruction: "Eres un asistente útil, amigable y profesional. Responde en el idioma del usuario.",
            stream: true,
        });
    
        let chunkCount = 0;
    
        // Iterar sobre los eventos del stream
        for await (const event of interaction) {
            // Verificar si el evento tiene el tipo correcto
            if (event && event.event_type === "step.delta") {
            // Verificar si el delta tiene texto
            if (event.delta && event.delta.type === "text") {
                const textChunk = event.delta.text || '';
                if (textChunk) {
                chunkCount++;
                //console.log(`📤 Fragmento #${chunkCount}: ${textChunk}`);
                res.write(textChunk);
                }
            }
            }
        }
    
        //console.log(`✅ Stream completado. Total fragmentos: ${chunkCount}`);
        res.end();
    
        } catch (error) {
        console.error('🔥 Error en streaming (backend):', error);
        console.error('📝 Detalles:', error.message);
        // Enviar error como texto plano para que el frontend lo maneje
        res.status(500).send('Error interno del servidor durante el streaming');
        }
    });

module.exports = app;