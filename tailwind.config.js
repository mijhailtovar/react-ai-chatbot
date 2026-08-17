/** @type {import('tailwindcss').Config} */

// tailwind.config.js
export default {
  darkMode: 'class', // ← Esto activa el modo oscuro con una clase
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};