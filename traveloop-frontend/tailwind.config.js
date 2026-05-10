/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './public/index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0,0,0,0.08)',
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      backgroundImage: {
        'traveloop-gradient': 'linear-gradient(135deg, rgba(20,184,166,0.12), rgba(59,130,246,0.10), rgba(249,115,22,0.10))',
        'premium-dark': 'linear-gradient(to right bottom, #0f172a, #1e1b4b, #312e81)',
      },
    },
  },
  plugins: [],
};
