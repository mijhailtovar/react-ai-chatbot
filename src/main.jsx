// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './context/ThemeContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider> {/* ← Envolvemos la app */}
      <App />
    </ThemeProvider>
  </StrictMode>
);