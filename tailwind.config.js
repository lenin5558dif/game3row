/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'everglow': {
          'pink': '#FF1F66',
          'purple': '#B4006C',
          'blue': '#00E0FF',
          'gradient-start': '#FF1F66',
          'gradient-end': '#B4006C',
        }
      }
    },
  },
  plugins: [],
} 