import { useEffect, useState } from "react";
import API, { endpoints } from "../API";
import ProductItem from "./ProductItem";

const RelativePost = ({ IDCategory, IDSalePost }) => {
   const [posts, setPosts] = useState([]);

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
               <div className="text-2xl font-bold mb-4">RelativePost</div>
               <div className="grid grid-cols-4 gap-10">
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
