import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'rgb(1, 97, 239)',
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#0161ef',
          600: '#0154cf',
          700: '#0143a5',
        },
        secondary: {
          DEFAULT: 'rgb(1, 84, 207)',
          dark: '#0143a5',
        },
        accent: {
          DEFAULT: 'rgb(109, 40, 217)',
          50: '#f5f3ff',
          500: '#6d28d9',
          600: '#5b21b6',
        },
        page: {
          light: '#ffffff',
          dark: '#030620',
        },
        muted: {
          light: 'rgba(16, 16, 16, 0.66)',
          dark: 'rgba(229, 236, 246, 0.66)',
        },
        navy: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          500: '#1e3a5f',
          600: '#162d4a',
          700: '#0f1f33',
          800: '#0a1628',
          900: '#030620',
        },
        spree: {
          blue: '#0161ef',
          'blue-dark': '#0154cf',
          'blue-light': '#38bdf8',
          navy: '#030620',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'astrowind': '0 4px 20px -2px rgba(1, 97, 239, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'astrowind-hover': '0 10px 25px -3px rgba(1, 97, 239, 0.12), 0 4px 10px -2px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}

export default config
