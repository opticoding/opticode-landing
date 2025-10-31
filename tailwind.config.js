/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        audiowide: ['var(--font-audiowide)', 'system-ui', 'sans-serif'],
        urbanist: ['var(--font-urbanist)', 'system-ui', 'sans-serif'],
      },
      colors: {
        white: '#F0F0F0',
        'white-trans': 'rgba(255, 255, 255, 0.9)',
        primary: '#DC38FF',
        secondary: '#47adff',
        tertiary: '#2A4BDB',
        subtitle: 'rgba(230, 244, 255, 0.8)',
        'white-border': 'rgba(240, 240, 240, 0.2)',
      },
      maxWidth: {
        desktop: '1280px',
      },
      screens: {
        xs: '420px',
        '3xl': '1600px',
        '4xl': '1920px',
        '5xl': '2560px',
      },
      keyframes: {
        bounceY: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        'bounce-y': 'bounceY 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

