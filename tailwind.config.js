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
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        earth: {
          50: '#faf8f5',
          100: '#f4efe8',
          200: '#e8dece',
          300: '#d7c4ac',
          400: '#c2a587',
          500: '#ae8c6a',
          600: '#987355',
          700: '#7e5c46',
          800: '#674c3c',
          900: '#543f33',
        },
        surface: {
          50: '#f8fafb',
          100: '#f1f5f4',
          200: '#e4eae8',
          300: '#cdd6d2',
        }
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        display: ['"Space Grotesk"', '"DM Sans"', 'system-ui', 'sans-serif'],
        typewriter: ['"Courier Prime"', '"Special Elite"', '"Cutive Mono"', '"Courier New"', 'monospace'],
        brand: ['"Special Elite"', '"Courier Prime"', '"Cutive Mono"', '"Courier New"', 'monospace'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.03)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
        'elevated': '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
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
