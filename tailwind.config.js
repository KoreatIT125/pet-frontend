/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#A7D8DE',
        secondary: '#F3C8D9',
        surface: '#F8F4EE',
        'app-bg': '#FEFBF7',
        accent: '#E3D4FF',
        text: '#24324A',
        muted: '#6B7280',
      },
      boxShadow: {
        soft: '0 14px 36px rgba(36, 50, 74, 0.05)',
        'extra-soft': '0 10px 30px rgba(36, 50, 74, 0.04)',
      },
      borderRadius: {
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
