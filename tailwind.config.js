/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'line-to-center': 'line-to-center 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        'line-to-center': {
          '0%': { 
            transform: 'scaleX(0)',
            opacity: '0'
          },
          '35%': {
            transform: 'scaleX(1)',
            opacity: '1'
          },
          '65%': {
            transform: 'scaleX(1)',
            opacity: '1'
          },
          '100%': { 
            transform: 'scaleX(0)',
            opacity: '0'
          }
        }
      },
      backdropBlur: {
        xs: '2px'
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"],
  }
}

