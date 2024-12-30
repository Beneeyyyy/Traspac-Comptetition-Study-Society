/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        wag: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(10deg)' },
        }
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'float-delay': 'float 3s ease-in-out 1s infinite',
        'float-slow': 'float 4s ease-in-out infinite',
        'wag': 'wag 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}

