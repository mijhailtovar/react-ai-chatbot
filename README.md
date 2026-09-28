# 🤖 Chatbot con IA (Gemini) - Proyecto de Integración

Este es un proyecto full-stack que construí para **aprender a integrar una IA (Gemini) en una aplicación web**. El objetivo era superar el bloqueo del error CORS y entender cómo funciona una comunicación segura entre un frontend, un backend y una API externa.

---

## 🧠 Mi Viaje de Aprendizaje

Este proyecto fue mi campo de pruebas para entender conceptos que me parecían complejos:

1. **El problema de CORS:** Entendí que el navegador tiene una "aduana" que impide que un sitio web (mi frontend) hable directamente con Google. La solución fue construir mi propio "país intermedio": **un backend**.
2. **Backend como puente:** Aprendí que el backend (Node.js + Express) actúa como un asistente personal. El frontend le pide algo, él va a Google, espera la respuesta y la trae de vuelta.
3. **Proteger secretos:** Descubrí que la API Key de Google es mi contraseña y debe ir en un archivo `.env` en el servidor, nunca en el frontend.
4. **Comunicación asíncrona:** Entendí que `async/await` es como decirle al código: *"Espera aquí a que Gemini responda, no sigas"*.

---

## 🚀 ¿Cómo funciona el proyecto?

```text
[Usuario] → [Frontend (React)] → [Backend (Node.js)] → [API de Gemini]
                                                                       ↓
[Usuario] ← [Frontend (React)] ← [Backend (Node.js)] ← [API de Gemini]
```
---
```text

## Estructura del Proyecto
/
├── backend/
│   ├── app.js          # Configuración principal del servidor (CORS, rutas, conexión a Gemini)
│   ├── index.js        # Punto de entrada: arranca el servidor en el puerto 3000
│   ├── package.json    # Dependencias del backend
│   └── .env            # Archivo para guardar la API Key (NO se sube a GitHub)
│
├── src/                # Código del frontend (React)
│   ├── components/     # Componentes (Chat, Controls, Loader)
│   ├── assistants/     # Lógica de IA (googleai.js, openai.js)
│   ├── App.jsx         # Lógica principal del frontend
│   └── main.jsx        # Punto de entrada del frontend
│
├── package.json        # Dependencias del frontend
└── README.md           # Este archivo
```

## Configuración y Ejecución Local

### 1. Clonar el repositorio
```bash 
git clone https://github.com/tu-usuario/tu-repositorio.git
cd tu-repositorio
```
### 2. Configurar el Backend
```bash
cd backend
npm install
```
Crea un archivo `.env` dentro de la carpeta `backend/` y añade tu API Key de Google:
```env
GOOGLE_API_KEY=TU_API_KEY_AQUI
```
### 3. Ejecutar el Backend
`npm run dev`

Deberías ver: `🚀 Backend corriendo en http://localhost:3000`
### 4. Configurar y Ejecutar el Frontend

Abre una nueva terminal en la raíz del proyecto y ejecuta:
```bash
npm install
npm run dev
```
El frontend estará disponible en 
```bash
http://localhost:5173.
```
## 💡 Desafíos y Soluciones
|**Desafío**|	**Solución Implementada**|
|:---|:---|
| **Error CORS al llamar a Gemini desde el navegador.** | Creación de un backend con Express y CORS para actuar como intermediario. |
| **API Key expuesta en el código del frontend.** | Almacenamiento de la API Key en un archivo `.env` en el backend. |
| **Esperar a que Gemini responda sin bloquear la app.** | Uso de funciones asíncronas (`async/await`) para manejar las respuestas. |
---
## 🌱 Próximos Pasos

Este proyecto es la base. A continuación, pienso añadirle:

- [ ] **Streaming de respuestas:** Mostrar la respuesta de Gemini letra por letra, como un ChatGPT.
- [ ] **Markdown en los mensajes:** Para que la IA pueda formatear texto (negritas, listas, etc.).
- [ ] **Modo Oscuro/Claro:** Para una mejor experiencia de usuario.
- [ ] **Despliegue en la nube:** Subir el Backend a Render y el Frontend a Vercel para tener una demo pública.

---

## 🧑‍💻 Un agradecimiento especial

Este README es un resumen de mi proceso de aprendizaje. Cada línea de código y comentario en este proyecto fue escrita para **entender y construir**, no solo para copiar y pegar.

Si estás viendo esto, espero que te sirva como ejemplo de cómo **construir un proyecto de IA de principio a fin**.

---

### 📎 Enlaces Útiles

- [Documentación de Gemini API](https://ai.google.dev/gemini-api/docs)
- [Documentación de Express](https://expressjs.com/)
- [React - Documentación Oficial](https://react.dev/)

# 📚 Explicación de cambios - Versión 2.5.0

## 🔗 Enlace a la conversación completa
[Explicación de DeepSeek sobre cambios en la versión v2.5.0](https://chat.deepseek.com/share/pi04vgce3e52zr49pf)

## 📋 Resumen de la versión 2.5.0

Esta versión introduce:
- **Historial por chat:** cada chat tiene su propio `messages`.
- **Arquitectura unificada:** el estado vive en `chats`, no en `messages`.
- **`Chat` como componente visual:** solo renderiza, no maneja lógica.
- **Sidebar mejorado:** muestra todos los chats, incluidos los vacíos.
- **Título automático:** el título del chat se basa en el primer mensaje.

## 🛠️ Cambios por archivo

### `App.jsx`
- Eliminado el estado `messages`.
- Añadidas funciones `updateActiveChatMessages` y `updateActiveChatTitle`.
- `Chat` recibe `messages={activeChatMessages}`.
- Eliminado el filtro de chats vacíos en `handleActiveChatIdChange`.

### `Chat.jsx`
- Eliminado `useState` interno.
- Eliminada la lógica del asistente y del streaming.
- Ahora solo recibe `messages` y los renderiza.

### `Sidebar.jsx`
- Eliminado el `.filter()` que ocultaba chats vacíos.
- Eliminado el `disabled` del botón "Nuevo Chat".

### `Controladores.jsx`
- Sin cambios.

## 📖 Conceptos de React utilizados

| Concepto | Uso en el proyecto |
| :--- | :--- |
| **Componente** | `App`, `Chat`, `Sidebar`, `Controladores` |
| **Props** | `Chat` recibe `messages`; `Sidebar` recibe `chats` |
| **Estado** | `chats`, `activeChatId`, `isLoading`, `isStreaming` |
| **`useState`** | `Controladores` maneja el `content` del textarea |
| **`useEffect`** | Auto-scroll en `Chat`; sincronización en `App` |
| **`useMemo`** | `activeChatMessages` se calcula a partir de `chats` |
| **`useCallback`** | `manejarCambioAsistente` para no recrear la función |
| **`useImmer`** | `chats` y `activeChatId` para drafts mutables |
| **Props drilling** | `Sidebar` recibe props de `App` |

## 🎯 Próximos pasos

- [ ] **Persistencia en localStorage:** guardar `chats` y `activeChatId` en el navegador.
- [ ] **Título generado por IA:** enviar una petición extra para generar un título corto.
- [ ] **Eliminar chats:** añadir un botón para borrar chats individuales.
- [ ] **Renombrar chats:** permitir editar el título manualmente.

## 📎 Enlaces útiles

- [Documentación de React](https://react.dev/)
- [Documentación de useImmer](https://github.com/immerjs/use-immer)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)