/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    "bg-red-900",
    "bg-blue-900",
    "bg-green-900",
    "bg-gray-900"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

