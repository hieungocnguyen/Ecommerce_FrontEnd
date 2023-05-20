import { useEffect, useState } from "react";
import API, { endpoints } from "../API";
import ProductItem from "./ProductItem";
import useTrans from "../hook/useTrans";

const RelativePost = ({ IDCategory, IDSalePost }) => {
   const [posts, setPosts] = useState([]);
   const trans = useTrans();

   const fetchPost = async () => {
      try {
         const res = await API.post(endpoints["search_salePost"], {
            categoryID: IDCategory,
            page: 1,
         });
         setPosts(res.data.data.listResult);
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      if (IDCategory) {
         fetchPost();
      }
   }, [IDCategory]);

   return (
      <div>
         {posts.length > 1 && (
            <div>
               <div className="text-2xl font-bold mb-4">
                  {trans.detailProduct.relative_post}
               </div>
               <div className="grid sm:grid-cols-4 grid-cols-1 sm:gap-8 gap-4">
                  {posts.map(
                     (post) =>
                        post.id != IDSalePost && (
                           <ProductItem
                              key={post.id}
                              product={post}
                              inCompare={false}
                           />
                        )
                  )}
               </div>
            </div>
         )}
      </div>
   );
};

export default RelativePost;
