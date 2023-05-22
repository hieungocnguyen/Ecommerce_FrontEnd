import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { BiListUl, BiSearch } from "react-icons/bi";
import API, { endpoints } from "../API";
import useTrans from "../hook/useTrans";
import toast from "react-hot-toast";

const quickSearch = ["airpod", "gaming desk", "blaze"];

const SearchBar = ({ categories, setNumberPage }) => {
   const router = useRouter();
   const searchInput = useRef(null);
   const searchContainer = useRef(null);
   const [isOpen, setIsOpen] = useState(false);
   const [suggestText, setSuggestText] = useState([]);
   const [isOpenSearch, setIsOpenSearch] = useState(false);
   const { locale } = useRouter();

   const trans = useTrans();

   const searchByKeyWord = () => {
      const query = searchInput.current.value;
      router.push(`/search?input=${query}`);
      setNumberPage(1);
   };

   const FetchSuggest = async (keyword: string) => {
      try {
         const res = await API.get(
            `${endpoints["get_keyword_suggest"]}?keyword=${keyword}`
         );
         setSuggestText(res.data.data);
         if (res.data.data.length > 0) {
            setIsOpenSearch(true);
         }
      } catch (error) {
         console.log(error);
         toast.error("Something wrong, please try again!");
      }
   };

   useEffect(() => {
      function handleClickOutside(event) {
         if (
            searchContainer.current &&
            !searchContainer.current.contains(event.target)
         ) {
            setIsOpenSearch(false);
         }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [searchContainer]);

   return (
      <div>
         <div className="flex justify-center gap-4 my-3 mx-auto sm:w-[90%] w-full">
            <button
               className="px-4 py-3 bg-primary-color rounded-lg text-white flex items-center gap-2 h-fit hover:shadow-lg hover:shadow-primary-color"
               onClick={() => setIsOpen(!isOpen)}
               type="button"
            >
               <BiListUl className="text-2xl" />
               <div className="font-semibold hidden sm:flex">
                  {trans.home.category}
               </div>
            </button>
            <div className="text-left relative" ref={searchContainer}>
               <input
                  type="text"
                  placeholder={trans.home.searchPlaceholder}
                  defaultValue={router.query.input}
                  ref={searchInput}
                  onChange={(e) => {
                     FetchSuggest(e.target.value);
                  }}
                  onClick={() => setIsOpenSearch(true)}
                  className="rounded-lg px-4 py-3 font-semibold outline-none sm:w-[500px] w-[210px] bg-light-primary dark:bg-dark-primary"
               />
               <div className="text-sm sm:flex gap-3 pl-2 pt-2 hidden">
                  {quickSearch.map((i) => (
                     <div
                        key={i}
                        onClick={() => (searchInput.current.value = i)}
                        className="cursor-pointer bg-primary-color py-[1px] px-2 rounded-full text-white font-medium"
                     >
                        {i}
                     </div>
                  ))}
               </div>
               {suggestText.length > 0 && isOpenSearch ? (
                  <>
                     <div
                        className={`overflow-auto absolute rounded-lg z-30 left-0 top-14 w-full h-fit bg-light-primary p-2 ${
                           suggestText.length > 5 ? "h-52" : "h-fit"
                        }`}
                     >
                        {suggestText.map((text) => (
                           <div
                              key={text}
                              onClick={() => {
                                 searchInput.current.value = text;
                                 searchByKeyWord();
                              }}
                              className="p-2 cursor-pointer hover:text-primary-color font-medium rounded-lg"
                           >
                              {text}
                           </div>
                        ))}
                     </div>
                  </>
               ) : (
                  <></>
               )}
            </div>
            <button
               onClick={searchByKeyWord}
               className="px-4 py-3 bg-primary-color rounded-lg text-white flex items-center gap-2 h-fit hover:shadow-lg hover:shadow-primary-color"
            >
               <BiSearch className="text-2xl" />
               <div className="font-semibold sm:flex hidden">
                  {trans.home.search}
               </div>
            </button>
         </div>
         <div
            className={`grid sm:grid-cols-5 grid-cols-2 gap-8 absolute z-40 sm:top-[160px] top-[140px] dark:bg-dark-primary bg-light-primary rounded-lg p-8 w-[90%] transition-all ease-out duration-200 ${
               isOpen ? "scale-100" : "scale-0 -translate-y-40 -translate-x-80"
            }`}
            id="container-category"
         >
            <Link href={`/category/all`}>
               <div
                  className="bg-secondary-color rounded-lg h-10 hover:opacity-80 cursor-pointer flex items-center justify-center"
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
                     className="bg-primary-color text-white font-semibold text-sm rounded-lg h-10 flex items-center justify-center hover:opacity-80 cursor-pointer"
                     onClick={() => {
                        setIsOpen(false);
                     }}
                  >
                     {locale == "vi" ? i.nameVi : i.name}
                  </div>
               </Link>
            ))}
         </div>
      </div>
   );
};

export default SearchBar;
