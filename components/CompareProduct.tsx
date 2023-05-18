import dynamic from "next/dynamic";
import { useContext, useEffect, useState } from "react";
import ProductItem from "./ProductItem";
import Cookies from "js-cookie";
import Image from "next/image";
import emptyBox from "../public/empty-box.png";
import { Store } from "../utils/Store";
import API, { endpoints } from "../API";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import useTrans from "../hook/useTrans";

const CompareProduct = ({ openCompare }) => {
   const [posts, setPosts] = useState([]);
   const { state, dispatch } = useContext(Store);
   const { compare } = state;
   const trans = useTrans();

   const fetchProducts = () => {
      let tempPosts = Cookies.get("compare")
         ? JSON.parse(Cookies.get("compare"))
         : [];
      try {
         if (tempPosts.length > 0) {
            tempPosts.map(async (post) => {
               const resPost = await API.get(endpoints["salePost"](post.id));
               Object.assign(post, resPost.data.data);
            });
         }
         setPosts(tempPosts);
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      fetchProducts();
   }, [openCompare, compare]);

   return (
      <div
         className={`fixed top-0 w-full h-screen z-10 justify-center items-center backdrop-blur-sm  ${
            openCompare ? "flex" : "hidden"
         }`}
      >
         <div
            className={`w-[90%] h-6/7 dark:bg-dark-spot bg-light-spot rounded-lg p-6 overflow-auto shadow-lg transition-all border-2 border-primary-color`}
         >
            <div className="text-left font-semibold text-xl dark:text-dark-text">
               {trans.detailProduct.compare_product}
            </div>
            <div className="mt-4">
               <div className={`grid sm:grid-cols-4 grid-cols-1 gap-4 `}>
                  {posts.length > 0 ? (
                     <>
                        {posts.map((product) => (
                           <ProductItem
                              key={product.id}
                              product={product}
                              inCompare={true}
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
