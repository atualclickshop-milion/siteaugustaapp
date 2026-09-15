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
        // Dark theme nocturnal tokens
        night: {
          950: '#030a13',
          900: '#061423',
          850: '#0a1a2e',
          800: '#0e233d',
          700: '#143152',
          600: '#1c426e',
        },
        // Marian & Royal Blue tokens
        marian: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#00236f',
          950: '#00164e',
        },
        // Celestial Gold tokens
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        // Light theme soft backgrounds
        lightBg: {
          base: '#faf8ff',
          surface: '#f2f4fc',
          card: '#ffffff',
          cardElevated: '#eef2fb',
          border: '#e2e7ff',
          subtext: '#56607a',
          title: '#00236f'
        },
        rose: {
          quartz: '#e0b0b8',
          soft: '#fce7f3',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        glow: {
          '0%': { opacity: '0.4', filter: 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.3))' },
          '100%': { opacity: '0.8', filter: 'drop-shadow(0 0 20px rgba(245, 158, 11, 0.7))' },
        }
      }
    },
  },
  plugins: [],
}

