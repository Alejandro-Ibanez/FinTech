/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Verifica que NO falte ninguna de estas extensiones
  ],
  theme: {
    extend: {
      colors: {
        // Colores para que se vea como una App de banco real
        fintech: {
          dark: "#0f172a",
          blue: "#2563eb",
          bg: "#f8fafc",
        },
      },
    },
  },
  plugins: [],
};
