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
        cream: {
          50: '#FDFCF7',
          100: '#FAF9EE',
          200: '#F4F2E1',
          300: '#EBE7D0',
          400: '#DFDAC0',
          500: '#CEC8A6',
        },
        forest: {
          50: '#EDF5EE',
          100: '#D7E9D9',
          200: '#B0D3B5',
          300: '#83B88B',
          400: '#4E9659',
          DEFAULT: '#0C4A34',
          500: '#0C4A34',
          600: '#0A3D2B',
          700: '#083022',
          800: '#062319',
          900: '#041610',
          950: '#020B08',
        },
        charcoal: {
          DEFAULT: '#131E18',
          muted: '#4A5850',
          light: '#65746C',
        },
        sage: {
          50: '#F2F8F4',
          100: '#E2EFE5',
          200: '#C5DFCC',
          300: '#9DC9A7',
          400: '#6FAA7D',
          500: '#10B981',
          600: '#059669',
        },
        obsidian: {
          950: '#040F0A',
          900: '#07130E',
          850: '#0B1B14',
          800: '#0F241C',
          750: '#142E24',
          700: '#1B3B2E',
        },
        gold: {
          DEFAULT: '#0C4A34',
          light: '#105F45',
          dark: '#083324',
          50: '#EDF5EE',
          100: '#D7E9D9',
          400: '#83B88B',
          500: '#0C4A34',
          600: '#083022',
        },
        emerald: {
          DEFAULT: '#10B981',
          dark: '#0C4A34',
          deep: '#041610',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
