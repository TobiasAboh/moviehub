/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",        // 👈 App Router pages
    "./components/**/*.{js,ts,jsx,tsx}", // 👈 Your components
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwind-scrollbar-hide'), // 👈 Add the plugin here
  ],
};

