/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        secondary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        neon: {
          blue: '#00f2ff',
          purple: '#b700ff',
          pink: '#ff00e6',
          green: '#00ff9d',
          yellow: '#ffee00',
        },
        dark: {
          900: '#111827',  // gray-900
          800: '#1f2937',  // gray-800
          700: '#374151',  // gray-700
          600: '#4b5563',  // gray-600
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        future: ['Orbitron', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'neon-primary': '0 0 5px rgba(2, 132, 199, 0.5), 0 0 20px rgba(2, 132, 199, 0.3)',
        'neon-secondary': '0 0 5px rgba(124, 58, 237, 0.5), 0 0 20px rgba(124, 58, 237, 0.3)',
        'neon-glow': '0 0 10px rgba(56, 189, 248, 0.7), 0 0 30px rgba(56, 189, 248, 0.5)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'cyber-grid': 'linear-gradient(rgba(2, 132, 199, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(2, 132, 199, 0.1) 1px, transparent 1px)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'gradient': 'gradient 15s ease infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(2, 132, 199, 0.5), 0 0 10px rgba(2, 132, 199, 0.3)' },
          '100%': { boxShadow: '0 0 10px rgba(2, 132, 199, 0.7), 0 0 20px rgba(2, 132, 199, 0.5)' },
        },
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
  darkMode: 'class',
}