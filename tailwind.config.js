/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agri: {
          50: '#f2f8f5',
          100: '#e1efe7',
          200: '#c5dfd2',
          300: '#9ac5b3',
          400: '#68a48e',
          500: '#438570',
          600: '#316b5a',
          700: '#28564a',
          800: '#1b4d3e', // Primary deep agricultural green
          900: '#0f291e', // Dark forest charcoal
          950: '#071710',
        },
        earth: {
          50: '#faf8f5',
          100: '#f4efe8',
          200: '#e8decE',
          300: '#d7c4ac',
          400: '#c2a587',
          500: '#ae8c6a',
          600: '#987355',
          700: '#7e5c46',
          800: '#674c3c',
          900: '#543f33',
        },
        surface: {
          50: '#F9FAF6',
          100: '#F3F4EE',
          200: '#E7E9DF',
          300: '#D5D9C8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        typewriter: ['"Courier Prime"', '"Special Elite"', '"Cutive Mono"', 'Courier New', 'monospace'],
        brand: ['"Special Elite"', '"Courier Prime"', '"Cutive Mono"', 'Courier New', 'monospace'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 3px 1px rgba(0, 0, 0, 0.02)',
        'card': '0 4px 6px -1px rgba(15, 41, 30, 0.04), 0 2px 4px -2px rgba(15, 41, 30, 0.04)',
        'elevated': '0 10px 15px -3px rgba(15, 41, 30, 0.08), 0 4px 6px -4px rgba(15, 41, 30, 0.04)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
