import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { BiListUl, BiSearch } from "react-icons/bi";

const quickSearch = ["airpod", "gaming desk", "blaze"];

const SearchBar = ({ categories }) => {
   const router = useRouter();
   const searchInput = useRef(null);
   const [isOpen, setIsOpen] = useState(false);

   const searchByKeyWord = (e: any) => {
      e.preventDefault();
      const query = searchInput.current.value;
      router.push(`/search?input=${query}`);
   };
   useEffect(() => {}, []);
   return (
      <div>
         <form
            onSubmit={searchByKeyWord}
            className="flex justify-center gap-4 my-6"
         >
            <button
               className="px-4 py-3 bg-blue-main rounded-lg text-white flex items-center gap-2 h-fit hover:shadow-lg hover:shadow-blue-main"
               onClick={() => setIsOpen(!isOpen)}
               type="button"
            >
               <BiListUl className="text-2xl" />
               <div className="font-semibold">Category</div>
            </button>
            <div className="text-left">
               <input
                  type="text"
                  placeholder="Search post..."
                  defaultValue=""
                  ref={searchInput}
                  className="rounded-lg px-4 py-3 font-semibold outline-none w-[500px] bg-light-primary dark:bg-dark-primary"
               />
               <div className="text-sm flex gap-3 pl-2 pt-1 text-blue-main">
                  {quickSearch.map((i) => (
                     <div
                        key={i}
                        onClick={() => (searchInput.current.value = i)}
                        className="cursor-pointer"
                     >
                        {i}
                     </div>
                  ))}
               </div>
            </div>
            <button
               type="submit"
               className="px-4 py-3 bg-blue-main rounded-lg text-white flex items-center gap-2 h-fit hover:shadow-lg hover:shadow-blue-main"
            >
               <BiSearch className="text-2xl" />
               <div className="font-semibold">Search</div>
            </button>
         </form>
         <div
            className={`grid grid-cols-5 gap-8 absolute z-10 top-[160px] dark:bg-dark-primary bg-light-primary rounded-lg p-8 w-[90%] transition-all ease-out duration-200 ${
               isOpen ? "scale-100" : "scale-0 -translate-y-40 -translate-x-80"
            }`}
            id="container-category"
         >
            <Link href={`/category/all`}>
               <div
                  className="bg-primary-color rounded-lg h-10 hover:opacity-80 cursor-pointer flex items-center justify-center"
                  onClick={() => {
                     setIsOpen(false);
                  }}
               >
                  <a className="font-semibold text-sm text-white">All</a>
               </div>
            </Link>
            {categories.map((i) => (
               <Link href={`/category/${i.id}`} key={i.id}>
                  <div
                     className="bg-blue-main text-white font-semibold text-sm rounded-lg h-10 flex items-center justify-center hover:opacity-80 cursor-pointer"
                     onClick={() => {
                        setIsOpen(false);
                     }}
                  >
                     {i.name}
                  </div>
               </Link>
            ))}
         </div>
      </div>
   );
};

export default SearchBar;
