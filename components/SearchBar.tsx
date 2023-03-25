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
         <form
            onSubmit={searchByKeyWord}
            className="flex justify-center gap-4 my-6"
         >
            <button
               className="px-4 py-3 bg-blue-main rounded-lg text-white flex items-center gap-2 h-fit"
               // onClick={handleOpenCategory}
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
               className="px-4 py-3 bg-blue-main rounded-lg text-white flex items-center gap-2 h-fit"
            >
               <BiSearch className="text-2xl" />
               <div className="font-semibold">Search</div>
            </button>
         </form>
         {/* <div
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
                     <div
                        className="bg-blue-main rounded-lg h-10 flex items-center  justify-center hover:opacity-80 cursor-pointer"
                        onClick={handleOpenCategory}
                     >
                        <a className="font-semibold text-sm text-white">
                           {i.name}
                        </a>
                     </div>
                  </Link>
               ))}
            </div> */}
      </div>
   );
};

export default SearchBar;
