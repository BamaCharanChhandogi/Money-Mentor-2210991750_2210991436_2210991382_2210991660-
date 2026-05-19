/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: ['Inter', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      colors: {
        primary: {
          50: '#fdfbf0',
          100: '#faf5db',
          200: '#f3e8b0',
          300: '#e8d47d',
          400: '#d9be56',
          500: '#C9A24A',
          600: '#b08a3a',
          700: '#8f6e2e',
          800: '#6e5524',
          900: '#4d3b19',
        },
        accent: {
          50: '#f7f7f5',
          100: '#edece8',
          200: '#d8d6cf',
          300: '#b8b5ab',
          400: '#908c80',
          500: '#57564F',
          600: '#4a4943',
          700: '#3d3c37',
          800: '#302f2b',
          900: '#2A2925',
        },
        success: {
          50: '#f3f7f0',
          100: '#e3eddb',
          200: '#c6d9b5',
          300: '#a3c088',
          400: '#82a86a',
          500: '#6B8E5A',
          600: '#577548',
          700: '#455d3a',
          800: '#37492e',
          900: '#2a3623',
        },
        warning: {
          50: '#fdf5f0',
          100: '#fae8db',
          200: '#f2cdb2',
          300: '#e5ab82',
          400: '#d18f65',
          500: '#B8745C',
          600: '#9c5f49',
          700: '#7d4b3a',
          800: '#60392d',
          900: '#462a21',
        },
        /* Warm dark palette for backgrounds & text */
        dark: {
          50: '#faf9f5',
          100: '#f4f0d8',
          200: '#e8e4cc',
          300: '#d5d0b8',
          400: '#94918a',
          500: '#6b6860',
          600: '#57564f',
          700: '#3d3c37',
          800: '#2A2925',
          900: '#1a1916',
        },
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
