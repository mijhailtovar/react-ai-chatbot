// src/components/ThemeToggle/ThemeToggle.jsx
import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

export default function ThemeToggle() {
  const { isDark, setIsDark } = useContext(ThemeContext);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className={
        "px-4 py-2 rounded  "
        + `${isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-200  text-gray-800'}`
        }
    >
      {isDark ? 'Claro:☀️' : 'Oscuro:🌙'}
    </button>
  );
}