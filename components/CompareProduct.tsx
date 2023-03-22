import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import ProductItem from "./ProductItem";
import Cookies from "js-cookie";

const CompareProduct = (props) => {
   const [products, setProducts] = useState([]);
   useEffect(() => {
      setProducts(
         Cookies.get("compare") ? JSON.parse(Cookies.get("compare")) : []
      );
   }, [props]);
   return (
      <div
         className={`fixed top-0 w-full h-screen z-10 justify-center items-center backdrop-blur-sm  ${
            props.openCompare ? "flex" : "hidden"
         }`}
      >
         <div className="w-[90%] h-5/6 dark:bg-dark-spot bg-light-spot rounded-lg p-6 overflow-auto shadow-lg shadow-blue-main">
            <div className="text-left font-semibold text-xl dark:text-dark-text">
               Comparing Product
            </div>
            <div className="mt-4">
               <div className={`grid grid-cols-4 gap-4 `}>
                  {products.map((p) => (
                     <ProductItem
                        key={p.id}
                        product={p}
                        inCompare={true}
                        setLoading={undefined}
                     />
                  ))}
               </div>
            </div>
         </div>
      </div>
   );
};
export default CompareProduct;
// export default dynamic(() => Promise.resolve(CompareProduct), { ssr: false });