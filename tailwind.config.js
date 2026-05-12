/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        farm: {
          50:  '#F1F9E5',
          100: '#E3F3CB',
          200: '#C6E797',
          300: '#AADB63',
          400: '#96CB3A',
          500: '#7AAA28',
          600: '#618B1E',
          700: '#496B15',
          800: '#304C0C',
          900: '#182D04',
        },
        cream: {
          50:  '#FAFAF7',
          100: '#EDEEE8',
          200: '#E0E1D9',
          300: '#CECEC8',
          400: '#B4B4AC',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        card:       '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.10)',
        'card-lg':  '0 4px 16px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}
