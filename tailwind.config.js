/** @type {import('tailwindcss').Config} */
module.exports = {
   content: [
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
   ],
   darkMode: "class",
   theme: {
      extend: {
         colors: {
            "light-primary": "#E5E8EF",
            "light-bg": "#fff",
            "light-text": "#30373D",
            "dark-primary": "#2B2B2B",
            "dark-bg": "#1F1F1F",
            "dark-text": "#F7F8FA",
            "blue-main": "#525EC1",
         },
      },
   },
   plugins: [],
};
