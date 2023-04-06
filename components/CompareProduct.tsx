import dynamic from "next/dynamic";
import { useContext, useEffect, useState } from "react";
import ProductItem from "./ProductItem";
import Cookies from "js-cookie";
import Image from "next/image";
import emptyBox from "../public/empty-box.png";
import { Store } from "../utils/Store";

const CompareProduct = ({ openCompare }) => {
   const [products, setProducts] = useState([]);
   const { state, dispatch } = useContext(Store);
   const { compare } = state;

   useEffect(() => {
      if (openCompare) {
         setProducts(
            Cookies.get("compare") ? JSON.parse(Cookies.get("compare")) : []
         );
      }
   }, [openCompare, compare]);

   return (
      <div
         className={`fixed top-0 w-full h-screen z-10 justify-center items-center backdrop-blur-sm  ${
            openCompare ? "flex" : "hidden"
         }`}
      >
         <div
            className={`w-[90%] h-5/6 dark:bg-dark-spot bg-light-spot rounded-lg p-6 overflow-auto shadow-lg transition-all border-2 border-blue-main`}
         >
            <div className="text-left font-semibold text-xl dark:text-dark-text">
               Comparing Product
            </div>
            <div className="mt-4">
               <div className={`grid grid-cols-4 gap-4 `}>
                  {products.length > 0 ? (
                     <>
                        {products.map((p) => (
                           <ProductItem
                              key={p.id}
                              product={p}
                              inCompare={true}
                              setLoading={undefined}
                           />
                        ))}
                     </>
                  ) : (
                     <div className="col-span-4 flex justify-center items-center">
                        <div className="relative overflow-hidden aspect-square w-1/3 mx-auto">
                           <Image
                              src={emptyBox}
                              alt="empty"
                              layout="fill"
                              className="object-cover"
                           />
                        </div>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
};
export default CompareProduct;
// export default dynamic(() => Promise.resolve(CompareProduct), { ssr: false });
