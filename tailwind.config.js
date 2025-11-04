/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html", // <-- CRITICAL FIX: Tell Tailwind where your classes are
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}