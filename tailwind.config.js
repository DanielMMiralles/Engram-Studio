/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0d1117',
        surface: '#161b22',
        'surface-light': '#21262d',
        border: '#30363d',
        primary: {
          DEFAULT: '#388bfd',
          dark: '#1f6feb',
          light: '#58a6ff'
        },
        accent: {
          green: '#2ea043',
          purple: '#a371f7',
          orange: '#f0883e',
          cyan: '#39c5bb'
        }
      }
    },
  },
  plugins: [],
}
