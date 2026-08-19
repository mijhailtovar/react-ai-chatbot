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

// ============================================================
// 🧠 RUTA PARA DEEPSEEK DIRECTO (DOCUMENTACIÓN - NO USAR AHORA)
// ============================================================
// // Esta es la ruta que diseñaste para DeepSeek directo.
// // La mantengo comentada como documentación para cuando puedas pagar.
/**
 
/**
 * RUTAS PARA DEEPSEEK
 */
// Please install OpenAI SDK first: `npm install openai`
//se importa el OpenAI para usar deepseek
//import OpenAI from "openai";

// backend/app.js

// ============================================================
// 🧠 RUTA PARA DEEPSEEK (SIN STREAMING)
// ============================================================
// Descripción: Recibe un mensaje, lo envía a DeepSeek y devuelve la respuesta completa.
// Formato: JSON
// ============================================================
/*

app.post('/api/chat-deepseek', async (req, res) => {
  try {
    // 1. Extraer mensaje del cuerpo de la petición
    const { message, history = [] } = req.body;

    // 2. Validar que el mensaje no esté vacío
    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'El mensaje es obligatorio.' });
    }

    console.log('📩 Mensaje recibido para DeepSeek:', message);

    // 3. Importar la SDK de OpenAI (compatible con DeepSeek)
    const OpenAI = require('openai');

    // 4. Configurar el cliente de DeepSeek
    const openai = new OpenAI({
      baseURL: 'https://api.deepseek.com', // ← URL de DeepSeek
      apiKey: process.env.DEEPSEEK_API_KEY, // ← Tu API Key en .env
    });

    // 5. Crear la solicitud de chat
    const completion = await openai.chat.completions.create({
      model: 'deepseek-v4-pro', // ← Modelo recomendado
      messages: [
        { role: 'system', content: 'Eres un asistente útil, amigable y profesional.' },
        ...history, // ← Historial de la conversación (si se envía)
        { role: 'user', content: message },
      ],
      thinking: { type: 'enabled' }, // ← Habilita el razonamiento avanzado
      reasoning_effort: 'high', // ← Nivel de razonamiento
      stream: false, // ← Respuesta completa (sin streaming)
    });

    // 6. Extraer la respuesta
    const reply = completion.choices[0].message.content;
    console.log('🤖 Respuesta de DeepSeek obtenida.');

    // 7. Devolver la respuesta al frontend
    res.json({ reply });

  } catch (error) {
    // 8. Manejo de errores
    console.error('🔥 Error en DeepSeek:', error);
    console.error('📝 Detalles:', error.message);
    res.status(500).json({
      error: 'Error al procesar la solicitud con DeepSeek',
      details: error.message,
    });
  }
});

// backend/app.js

// ============================================================
// 🧠 RUTA PARA DEEPSEEK CON STREAMING
// ============================================================
// Descripción: Recibe un mensaje, lo envía a DeepSeek y devuelve la respuesta en fragmentos.
// Formato: text/plain (fragmentos)
// ============================================================
app.post('/api/chatStream-deepseek', async (req, res) => {
  try {
    // 1. Extraer mensaje del cuerpo de la petición
    const { message, history = [] } = req.body;

    // 2. Validar que el mensaje no esté vacío
    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'El mensaje es obligatorio.' });
    }

    console.log('📩 Mensaje recibido para DeepSeek (stream):', message);

    // 3. Importar la SDK de OpenAI (compatible con DeepSeek)
    const OpenAI = require('openai');

    // 4. Configurar el cliente de DeepSeek
    const openai = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: process.env.DEEPSEEK_API_KEY,
    });

    // 5. Configurar cabeceras para streaming
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache');

    // 6. Crear la solicitud de chat con streaming
    const stream = await openai.chat.completions.create({
      model: 'deepseek-v4-pro',
      messages: [
        { role: 'system', content: 'Eres un asistente útil, amigable y profesional.' },
        ...history,
        { role: 'user', content: message },
      ],
      thinking: { type: 'enabled' },
      reasoning_effort: 'high',
      stream: true, // ← Habilita el streaming
    });

    let chunkCount = 0;

    // 7. Iterar sobre los fragmentos del stream
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        chunkCount++;
        console.log(`📤 Fragmento #${chunkCount} (DeepSeek): ${content}`);
        res.write(content); // ← Envía cada fragmento
      }
    }

    console.log(`✅ Stream de DeepSeek completado. Total fragmentos: ${chunkCount}`);
    res.end();

  } catch (error) {
    // 8. Manejo de errores
    console.error('🔥 Error en streaming de DeepSeek:', error);
    console.error('📝 Detalles:', error.message);
    res.status(500).json({
      error: 'Error al procesar la solicitud con DeepSeek',
      details: error.message,
    });
  }
});

// backend/app.js

// ============================================================
// 🏥 RUTA PARA VERIFICAR EL ESTADO DEL BACKEND
// ============================================================
app.get('/api/health-deepseek', function(req, res){
  res.json({
    status: 'ok',
    message: 'Backend de DeepSeek funcionando',
  });
});

 */
// ============================================================

// ============================================================
// 🌐 RUTA PARA OPENROUTER (ACTIVA - USAR AHORA)
// ============================================================
// Descripción: Recibe un mensaje y lo envía a OpenRouter, que a su vez llama a DeepSeek.
// Usa tu API Key de OpenRouter y un modelo gratuito (con :free).
// ============================================================
app.post('/api/chat-openrouter', async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'El mensaje es obligatorio.' });
    }

    console.log('📩 Mensaje recibido para OpenRouter (DeepSeek):', message);

    // 1. Importar la SDK de OpenAI (compatible con OpenRouter)
    const OpenAI = require('openai');

    // 2. Configurar el cliente para OpenRouter
    //    - baseURL: https://openrouter.ai/api/v1
    //    - apiKey: Tu clave de OpenRouter (en .env)
    const openai = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    // 3. Crear la solicitud de chat con OpenRouter
    const completion = await openai.chat.completions.create({
      // 4. Modelo gratuito de DeepSeek a través de OpenRouter
      model: 'deepseek/deepseek-v4-flash', // ← Sufijo :free para pruebas
      messages: [
        { role: 'system', content: 'Eres un asistente útil, amigable y profesional.' },
        ...history,
        { role: 'user', content: message },
      ],
      // Nota: Los parámetros 'thinking' y 'reasoning_effort' no son compatibles
      // con la versión gratuita de OpenRouter.
    });

    const reply = completion.choices[0].message.content;
    console.log('🤖 Respuesta de OpenRouter (DeepSeek) obtenida.');

    res.json({ reply });

  } catch (error) {
    console.error('🔥 Error en OpenRouter:', error);
    console.error('📝 Detalles:', error.message);
    res.status(500).json({
      error: 'Error al procesar la solicitud con OpenRouter',
      details: error.message,
    });
  }
});

// backend/app.js

// ============================================================
// 🌊 RUTA PARA OPENROUTER CON STREAMING
// ============================================================
app.post('/api/chatStream-openrouter', async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'El mensaje es obligatorio.' });
    }

    console.log('📩 Mensaje recibido para OpenRouter (stream):', message);

    const OpenAI = require('openai');

    const openai = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache');

    const stream = await openai.chat.completions.create({
      model: 'deepseek/deepseek-v4-flash',
      messages: [
        { role: 'system', content: 'Eres un asistente útil, amigable y profesional.' },
        ...history,
        { role: 'user', content: message },
      ],
      stream: true,
    });

    let chunkCount = 0;

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        chunkCount++;
        console.log(`📤 Fragmento #${chunkCount} (OpenRouter): ${content}`);
        res.write(content);
      }
    }

    console.log(`✅ Stream de OpenRouter completado. Total fragmentos: ${chunkCount}`);
    res.end();

  } catch (error) {
    console.error('🔥 Error en streaming de OpenRouter:', error);
    console.error('📝 Detalles:', error.message);
    res.status(500).json({
      error: 'Error al procesar la solicitud con OpenRouter',
      details: error.message,
    });
  }
});


// Ruta para OpenAI (sin streaming)
app.post('/api/chat-openai', async (req, res) => {
    try {
      const { message, history = [] } = req.body;
  
      if (!message || message.trim() === '') {
        return res.status(400).json({ error: 'El mensaje es obligatorio.' });
      }
  
      console.log('📩 Mensaje recibido para OpenAI:', message);
  
      const OpenAI = require('openai');
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
  
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [...history, { content: message, role: "user" }],
      });
  
      const reply = response.choices[0].message.content;
      console.log('🤖 Respuesta de OpenAI obtenida.');
      res.json({ reply });
  
    } catch (error) {
      console.error('🔥 Error en OpenAI:', error);
      res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
  });
  
  // Ruta para OpenAI con streaming
  app.post('/api/chatStream-openai', async (req, res) => {
    try {
      const { message, history = [] } = req.body;
  
      if (!message || message.trim() === '') {
        return res.status(400).json({ error: 'El mensaje es obligatorio.' });
      }
  
      console.log('📩 Mensaje recibido para OpenAI (stream):', message);
  
      const OpenAI = require('openai');
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
  
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Transfer-Encoding', 'chunked');
      res.setHeader('Cache-Control', 'no-cache');
  
      const stream = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [...history, { content: message, role: "user" }],
        stream: true,
      });
  
      let chunkCount = 0;
  
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          chunkCount++;
          console.log(`📤 Fragmento #${chunkCount} (OpenAI): ${content}`);
          res.write(content);
        }
      }
  
      console.log(`✅ Stream de OpenAI completado. Total fragmentos: ${chunkCount}`);
      res.end();
  
    } catch (error) {
      console.error('🔥 Error en streaming de OpenAI:', error);
      res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
  });

module.exports = app;