import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { BiArrowBack, BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";

const PaginationComponent = ({ totalPage, pageCurrent, setPageCurrent }) => {
   const [i, seti] = useState(0);
   const maxViewCount = totalPage - 4;

   const handlePrev = () => {
      if (i > 0) {
         seti(i - 1);
      }
   };

   const handleNext = () => {
      if (i < maxViewCount) {
         seti(i + 1);
      }
   };

   return (
      <div className="flex gap-2 justify-center items-center my-8">
         {totalPage > 4 && (
            <div
               className={`text-3xl text-primary-color  ${
                  i == 0 ? "opacity-30" : "cursor-pointer"
               }`}
               onClick={() => handlePrev()}
            >
               <BiLeftArrowAlt className="" />
            </div>
         )}

         <div
            className={`w-44 overflow-hidden flex ${
               totalPage > 4 ? "justify-start" : "justify-center"
            }`}
         >
            <div
               className={`flex w-fit gap-4 transition-all -translate-x-[${
                  i * 48
               }px]`}
            >
               {totalPage > 1 &&
                  Array.from(Array(totalPage), (e, i) => {
                     return (
                        <div
                           key={i}
                           className={`w-8 h-8 rounded-lg border-2 border-primary-color flex justify-center items-center cursor-pointer paginator font-semibold ${
                              pageCurrent === i + 1
                                 ? "bg-primary-color text-white"
                                 : ""
                           } `}
                           onClick={(e) => {
                              setPageCurrent(i + 1);
                           }}
                        >
                           {i + 1}
                        </div>
                     );
                  })}
            </div>
         </div>
         {totalPage > 4 && (
            <div
               className={`text-3xl text-primary-color ${
                  i == maxViewCount ? "opacity-30" : "cursor-pointer"
               }`}
               onClick={() => handleNext()}
            >
               <BiRightArrowAlt />
            </div>
         )}
      </div>
   );
};

// export default PaginationComponent;
export default dynamic(() => Promise.resolve(PaginationComponent), {
   ssr: false,
});
