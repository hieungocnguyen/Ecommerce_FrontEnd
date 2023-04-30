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
            "primary-color": "#2065d1",
            "secondary-color": "#ffab00",

            "light-primary": "#E5E8EF",
            "light-bg": "#fff",
            "light-text": "#30373D",
            "light-spot": "#f2f2f2",

            "dark-primary": "#2B2B2B",
            "dark-bg": "#1F1F1F",
            "dark-text": "#F7F8FA",
            "dark-spot": "#3B3B3B",
            "dark-shadow": "#18181b",
         },
      },
   },
   plugins: [require("@tailwindcss/line-clamp")],
};
