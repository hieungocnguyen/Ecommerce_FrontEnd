import { useEffect, useState } from "react";
import ProductItem from "./ProductItem";

const CompareProduct = (props) => {
   const [products, setProducts] = useState([]);
   useEffect(() => {
      const products = JSON.parse(localStorage.getItem("products"));
      setProducts(products ? products : []);
   }, [props]);
   return (
      <div
         className={`fixed top-0 w-full h-screen z-10 justify-center items-center backdrop-blur-sm  ${
            props.openCompare ? "flex" : "hidden"
         }`}
      >
         <div className="w-[90%] h-4/5 bg-dark-spot rounded-lg p-6">
            <div className="text-left font-semibold text-xl">
               Compare Product
            </div>
            <div className="mt-4">
               <div className={`grid grid-cols-4 gap-4`}>
                  {products.map((p) => (
                     <ProductItem key={p.id} product={p} />
                  ))}
               </div>
            </div>
         </div>
      </div>
   );
};
export default CompareProduct;
