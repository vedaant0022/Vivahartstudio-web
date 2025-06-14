/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'playfair': ['"Playfair Display"', 'serif'],
      },
      colors: {
        'purple': {
          700: '#9C2B7C',
        },
        'pink': {
          500: '#E75480',
        },
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' }
        }
      },
      animation: {
        'scroll': 'scroll 20s linear infinite'
      }
    },
  },
  plugins: [],
} 