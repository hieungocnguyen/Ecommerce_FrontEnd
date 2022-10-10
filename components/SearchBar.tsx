import { useRouter } from "next/router";
import React from "react";
import { useRef } from "react";

const SearchBar = () => {
   const router = useRouter();
   const searchInput = useRef(null);
   const search = (e: any) => {
      e.preventDefault();
      const query = searchInput.current.value;
      if (!query) {
         searchInput.current.focus();
      } else {
         router.push(`/search?input=${query}`);
      }
   };
   return (
      <div>
         <div className="my-4">
            <form onSubmit={search}>
               <input
                  type="text"
                  placeholder="Type something..."
                  ref={searchInput}
                  className="rounded-lg px-8 py-[6px] font-semibold outline-none mr-3 w-[40%] bg-light-primary dark:bg-dark-primary"
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
