/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        plumage: {
          primary: '#2D6A4F',
          'primary-light': '#40916C',
          'primary-dark': '#1B4332',
          surface: '#FEFCF9',
          'surface-alt': '#F5F0EB',
          accent: '#D4A373',
          border: '#E8E2DA',
        },
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
