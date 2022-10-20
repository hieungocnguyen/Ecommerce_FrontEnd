import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useRef } from "react";

const SearchBar = ({ categories }) => {
   const router = useRouter();
   const searchInput = useRef(null);
   const [isOpen, setIsOpen] = useState(false);
   const search = (e: any) => {
      e.preventDefault();
      const query = searchInput.current.value;
      if (!query) {
         searchInput.current.focus();
      } else {
         router.push(`/search?input=${query}`);
      }
   };
   const handleOpenCategory = () => {
      const container = document.getElementById("container-category");
      if (isOpen) {
         container.classList.remove("grid");
         container.classList.add("hidden");
      } else {
         container.classList.remove("hidden");
         container.classList.add("grid");
      }

      setIsOpen(!isOpen);
   };
   return (
      <div>
         <div className="my-4 flex justify-center w-full">
            <button
               className="py-[7px] px-[10px] bg-blue-main rounded-lg font-semibold text-sm hover:opacity-80 text-white"
               onClick={handleOpenCategory}
            >
               Category
            </button>
            <div
               className="hidden grid-cols-5 gap-8 absolute z-10 top-[128px] dark:bg-dark-primary bg-light-primary rounded-lg p-8 w-[90%] transition-all "
               id="container-category"
            >
               <Link href={`/category/all`}>
                  <div className="bg-blue-main rounded-lg h-10 hover:opacity-80 cursor-pointer flex items-center justify-center">
                     <a className="font-semibold text-sm text-white">All</a>
                  </div>
               </Link>
               {categories.map((i) => (
                  <Link href={`/category/${i.id}`} key={i.id}>
                     <div className="bg-blue-main rounded-lg h-10 flex items-center  justify-center hover:opacity-80 cursor-pointer">
                        <a className="font-semibold text-sm text-white">
                           {i.name}
                        </a>
                     </div>
                  </Link>
               ))}
            </div>
            <form onSubmit={search} className="">
               <input
                  type="text"
                  placeholder="Type something..."
                  ref={searchInput}
                  className="rounded-lg px-8 py-[6px] font-semibold outline-none w-[500px] bg-light-primary dark:bg-dark-primary ml-8 mr-4"
               />
               <button
                  type="submit"
                  className="bg-blue-main rounded-lg py-[7px] px-[10px] font-semibold text-white hover:opacity-80 text-sm"
               >
                  <span>Tìm kiếm</span>
               </button>
            </form>
         </div>
      </div>
   );
};

export default SearchBar;
