import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { BiMoon, BiSun } from "react-icons/bi";

const ThemeToggler = () => {
   const { theme, setTheme } = useTheme();
   const [mounted, setMounted] = useState(false);
   useEffect(() => setMounted(true), []);
   if (!mounted) return null;
   return (
      <button
         className="w-10 h-10 bg-light-primary rounded-lg dark:bg-dark-primary flex items-center justify-center hover:bg-slate-300 dark:hover:bg-neutral-800 transition-all"
         onClick={() => setTheme(theme === "light" ? "dark" : "light")}
         aria-label="Toggle Dark Mode"
      >
         {theme === "light" ? (
            <BiSun className=" w-6 h-6 hover:text-primary-color" />
         ) : (
            <BiMoon className="w-6 h-6 hover:text-primary-color" />
         )}
      </button>
   );
};

export default ThemeToggler;
