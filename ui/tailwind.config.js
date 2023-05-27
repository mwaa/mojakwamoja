/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
  ],
  plugins: [
    require("flowbite/plugin")
  ],
  theme: {}
}
