/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,tsx}", // Ensure Tailwind scans your TypeScript and JavaScript files
    ],
    theme: {
      extend: {},
    },
    plugins: [require('daisyui')], // Include DaisyUI plugin
  };
  