/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#0f172a',
          hover: '#1e293b',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#f8fafc',
          foreground: '#0f172a',
        },
        success: {
          DEFAULT: '#10b981',
          foreground: '#ffffff',
        },
        accent: {
          DEFAULT: '#c5a059',
          light: '#fdfaf3',
          dark: '#b08d45',
        },
        brand: '#2650fc',
        'brand-light': '#4f72ff',
        'brand-dark': '#1a3ecb',
        muted: '#64748b',
        border: '#e2e8f0',
      }
    },
  },
  plugins: [],
}
