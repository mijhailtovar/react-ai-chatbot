// src/context/ThemeContext.jsx
import { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    //si lo quieres testear
    const [isDark, setIsDark] = useState(false); // Empezamos en oscuro (true) o light (false)
  // 1. Cargar el tema guardado (o usar 'light' por defecto)
  console.log(isDark);
  /*
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
*/
  // 2. Guardar el tema cada vez que cambie
  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark }}>
      {children}
    </ThemeContext.Provider>
  );
};