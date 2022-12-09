/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#5A7684',
        'secondary': '#DC5656',
        'text': '#4F4F4F',
      },
    },
  },
  plugins: [],
}
