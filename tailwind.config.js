/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6C3FC4',
          50: '#F3EEFF',
          100: '#E4D9FC',
          200: '#C9B3F9',
          300: '#AE8DF6',
          400: '#8D62E0',
          500: '#6C3FC4',
          600: '#5A30A8',
          700: '#47248C',
          800: '#351870',
          900: '#230E54',
        },
        secondary: {
          DEFAULT: '#0F9E8A',
          50: '#E6FAF7',
          100: '#CCF5EF',
          200: '#99EBDF',
          300: '#66E1CF',
          400: '#33D7BF',
          500: '#0F9E8A',
          600: '#0C7F6F',
          700: '#096054',
          800: '#06403A',
          900: '#03201F',
        },
        background: '#F8F7FF',
        surface: '#FFFFFF',
        danger: {
          DEFAULT: '#E53E3E',
          50: '#FEF2F2',
          500: '#E53E3E',
          600: '#C53030',
        },
        success: {
          DEFAULT: '#38A169',
          50: '#F0FFF4',
          500: '#38A169',
          600: '#2F855A',
        },
        warning: {
          DEFAULT: '#D69E2E',
          50: '#FFFFF0',
          500: '#D69E2E',
          600: '#B7791F',
        },
        text: {
          DEFAULT: '#1A1A2E',
          light: '#64648C',
          muted: '#9E9EB8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        input: '8px',
        pill: '9999px',
      },
      maxWidth: {
        content: '1280px',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 2s linear infinite',
        'score-ring': 'scoreRing 1.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scoreRing: {
          '0%': { strokeDashoffset: '283' },
          '100%': { strokeDashoffset: 'var(--score-offset)' },
        },
      },
    },
  },
  plugins: [],
};
