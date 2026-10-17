/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'f1-red': '#E10600',
        'f1-dark': '#15151E',
        'f1-gold': '#FFD700',
      },
      fontFamily: {
        racing: ['Orbitron', 'sans-serif'],
        tech: ['Chakra Petch', 'sans-serif'],
        body: ['Titillium Web', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
