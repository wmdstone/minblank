/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        org: {
          bg: "#0d1612",
          card: "#1d2e26",
          surface: "#2a4336",
          border: "#2d473a",
          highlight: "#86cfa7",
          muted: "#8da698",
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}