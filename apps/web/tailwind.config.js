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
        legal: {
          50: '#F0F5FA',
          100: '#E1EBF5',
          200: '#C3D7EB',
          300: '#95BCDE',
          400: '#5F9CCE',
          500: '#387EBC',
          600: '#2563EB', // Principal institucional
          700: '#1D4ED8',
          800: '#163A5F', // Azul Nobre Jurídico
          900: '#0F2537', // Deep Navy
          950: '#08131D',
        },
        gold: {
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        surface: {
          dark: '#0B0F17',
          card: '#111827',
          border: '#1F2937',
          muted: '#374151',
          light: '#F8FAFC',
          cardLight: '#FFFFFF',
          borderLight: '#E2E8F0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'premium': '0 10px 25px -5px rgba(15, 37, 55, 0.08), 0 8px 10px -6px rgba(15, 37, 55, 0.04)',
        'glow-primary': '0 0 20px -5px rgba(37, 99, 235, 0.3)',
      }
    },
  },
  plugins: [],
}
