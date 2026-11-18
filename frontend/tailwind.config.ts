import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          500: '#1e3a5f',
          600: '#162d4a',
          700: '#0f1f33',
          800: '#0a1628',
          900: '#060e1a',
        },
        spree: {
          blue: '#2563eb',
          'blue-dark': '#1d4ed8',
          'blue-light': '#3b82f6',
          navy: '#1e3a5f',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
