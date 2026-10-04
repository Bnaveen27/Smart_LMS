/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      colors: {
        brand: {
          50: 'var(--brand-50, #EEF2FF)',
          100: 'var(--brand-100, #E0E7FF)',
          500: 'var(--brand-primary, #4F46E5)',
          600: 'var(--brand-600, #4338CA)',
          700: 'var(--brand-700, #3730A3)',
        },
        accent: {
          500: 'var(--brand-secondary, #06B6D4)'
        }
      }
    },
  },
  plugins: [],
}
