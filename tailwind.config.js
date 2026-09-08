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
        brand: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          900: '#7f1d1d',
          dark: '#0a0a0a',
          card: '#121212',
          border: '#262626'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px 0 rgba(0, 0, 0, 0.3)',
        'card': '0 4px 12px -2px rgba(0, 0, 0, 0.6), 0 2px 6px -1px rgba(0, 0, 0, 0.4)',
        'float': '0 10px 30px -5px rgba(220, 38, 38, 0.25), 0 8px 12px -6px rgba(0, 0, 0, 0.5)',
        'red-glow': '0 0 25px -3px rgba(239, 68, 68, 0.35)',
      }
    },
  },
  plugins: [],
}
