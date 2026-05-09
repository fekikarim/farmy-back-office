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
        accent: {
          primary: '#90A53E',
          deep: '#4E7034',
        },
        dark: {
          bg: '#0B0F0A',
          surface: '#1A2315',
          card: '#1A2315',
          border: '#2A3620',
          text: '#6B7F62',
        },
        light: {
          bg: '#F5F7F3',
          surface: '#FFFFFF',
          border: '#EDEEE9',
        }
      },
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        dmsans: ['DM Sans', 'sans-serif'],
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(135deg, #90A53E 0%, #4E7034 100%)',
      },
      boxShadow: {
        'accent-glow': '0 0 16px rgba(144, 165, 62, 0.35)',
      }
    },
  },
  plugins: [],
}
