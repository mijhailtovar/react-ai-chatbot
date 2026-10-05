/*
 * Copyright (c) 2026 Mijhail Tovar. Todos los derechos reservados.
 * Prohibida su reproducción, distribución o uso sin autorización expresa.
 */
// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
//import App from './App';
import App from './App_mokoup';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>

      <App />

  </StrictMode>
);