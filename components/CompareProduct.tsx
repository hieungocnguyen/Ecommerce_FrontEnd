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
import Rating from "@mui/material/Rating";
import Link from "next/link";

const CompareProduct = ({ openCompare }) => {
   const [posts, setPosts] = useState<any>([]);
   const { state, dispatch } = useContext(Store);
   const { compare } = state;
   const trans = useTrans();

   const fetchProducts = async () => {
      let tempPosts = Cookies.get("compare")
         ? JSON.parse(Cookies.get("compare"))
         : [];

      try {
         let tempArr = [];
         if (tempPosts.length > 0) {
            tempPosts.map(async (post) => {
               const resPost = await API.get(endpoints["salePost"](post.id));
               const resStar = await API.get(
                  endpoints["star_avg_post"](post.id)
               );
               tempArr.push({
                  ...resPost.data.data,
                  star: resStar.data.data,
               });
               if (tempArr.length == tempPosts.length) {
                  setPosts(tempArr);
                  console.log(tempArr);
               }
            });
         }
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      fetchProducts();
   }, [openCompare, compare]);

   const handleRemoveCompare = (id) => {
      if (posts.length == 1) {
         setPosts([]);
      }
      dispatch({
         type: "COMPARE_REMOVE_PRODUCT",
         payload: {
            id: id,
         },
      });
      toast.success(`Remove compare successful!`, {
         position: "top-center",
      });
   };
   return (
      <div
         className={`fixed top-0 w-full h-screen z-30 justify-center items-center backdrop-blur-sm  ${
            openCompare ? "flex" : "hidden"
         }`}
      >
         <div
            className={`w-[90%] h-6/7 dark:bg-dark-spot bg-light-spot rounded-lg p-6 overflow-auto shadow-lg transition-all border-2 border-primary-color`}
         >
            <div className="text-left font-semibold text-xl dark:text-dark-text">
               {trans.detailProduct.compare_product}
            </div>
            <div className="grid grid-cols-5">
               <div className="border-r-4 font-semibold uppercase">
                  <div className="h-[310px] m-2 p-2 flex items-center  font-medium text-lg"></div>
                  <div className="bg-light-bg p-2 ">
                     {trans.detailProduct.brand}
                  </div>
                  <div className="p-2 ">{trans.detailProduct.manufacturer}</div>
                  <div className="bg-light-bg p-2 ">
                     {trans.detailProduct.origin}
                  </div>
                  <div className="p-2 ">{trans.detailProduct.category}</div>
                  <div className="bg-light-bg p-2 ">
                     {trans.detailProduct.date_of_sale}
                  </div>
                  <div className="p-2">{trans.detailProduct.merchant}</div>
               </div>
               {posts.map((post) => (
                  <div
                     key={post.id}
                     className="text-center border-r-4 col-span-2"
                  >
                     <Link href={`/sale_post/${post.id}`}>
                        <div className="h-[310px] text-center p-2 m-2 cursor-pointer hover:bg-gray-200 rounded-lg">
                           <div className="relative w-32 mx-auto aspect-square overflow-hidden rounded-lg">
                              <Image
                                 src={post.avatar}
                                 alt="img"
                                 layout="fill"
                                 className="object-cover"
                              />
                           </div>
                           <div className="font-semibold text-center text-lg line-clamp-1 mt-1">
                              {post.title}
                           </div>
                           <div className="flex gap-1 justify-center">
                              <div className="">
                                 <Rating
                                    size="medium"
                                    sx={{
                                       "& .MuiRating-iconFilled": {
                                          color: "#2065d1",
                                       },
                                       "& .MuiRating-iconEmpty": {
                                          color: "#2065d1",
                                       },
                                    }}
                                    name="half-rating-read"
                                    precision={0.2}
                                    value={post.star?.toFixed(1)}
                                    readOnly
                                 />
                              </div>
                              <div className="text-primary-color font-semibold">
                                 ({post.star?.toFixed(1)})
                              </div>
                           </div>

                           <div className="line-through font-medium text-sm text-center">
                              {post.initialPrice.toLocaleString("it-IT", {
                                 style: "currency",
                                 currency: "VND",
                              })}
                           </div>
                           <div className="text-primary-color font-bold text-xl">
                              {post.finalPrice.toLocaleString("it-IT", {
                                 style: "currency",
                                 currency: "VND",
                              })}
                           </div>
                           <div className="p-2 bg-secondary-color rounded-lg w-fit mx-auto font-bold">
                              {trans.detailProduct.discount}{" "}
                              {(
                                 ((post.initialPrice - post.finalPrice) /
                                    post.initialPrice) *
                                 100
                              ).toFixed(0)}
                              %
                           </div>
                        </div>
                     </Link>
                     <div className="bg-light-bg py-2 font-medium">
                        {post.brand}
                     </div>
                     <div className="py-2 font-medium">{post.manufacturer}</div>
                     <div className="bg-light-bg py-2 font-medium">
                        {post.origin}
                     </div>
                     <div className="py-2 font-medium">
                        {post.category.name}
                     </div>
                     <div className="bg-light-bg py-2 font-medium">
                        {new Date(post.createdDate).toLocaleDateString("en-GB")}
                     </div>
                     <div className="py-2 font-medium">{post.agency.name}</div>
                     <div
                        className="py-2 px-3 bg-red-500 rounded-lg cursor-pointer hover:brightness-95 text-white font-semibold w-fit mx-auto mt-1"
                        onClick={() => handleRemoveCompare(post.id)}
                     >
                        {trans.detailProduct.remove}
                     </div>
                  </div>
               ))}
               {posts.length == 1 && (
                  <div className="text-center border-r-4 col-span-2">
                     <div className="h-[310px] text-center p-2 m-2  rounded-lg flex justify-center items-center opacity-70">
                        <div className="relative w-40 mx-auto aspect-square overflow-hidden rounded-lg">
                           <Image
                              src="https://res.cloudinary.com/ngnohieu/image/upload/v1686466243/balance_paeizk.png"
                              alt="img"
                              layout="fill"
                              className="object-cover"
                           />
                        </div>
                     </div>
                     <div className="bg-light-bg py-2 font-medium h-10">--</div>
                     <div className="py-2 font-medium h-10">--</div>
                     <div className="bg-light-bg py-2 font-medium h-10">--</div>
                     <div className="py-2 font-medium h-10">--</div>
                     <div className="bg-light-bg py-2 font-medium h-10">--</div>
                     <div className="py-2 font-medium h-10">--</div>
                  </div>
               )}
               {posts.length == 0 && (
                  <>
                     <div className="text-center border-r-4 col-span-2">
                        <div className="h-[310px] text-center p-2 m-2  rounded-lg flex justify-center items-center opacity-70">
                           <div className="relative w-40 mx-auto aspect-square overflow-hidden rounded-lg">
                              <Image
                                 src="https://res.cloudinary.com/ngnohieu/image/upload/v1686466243/balance_paeizk.png"
                                 alt="img"
                                 layout="fill"
                                 className="object-cover"
                              />
                           </div>
                        </div>
                        <div className="bg-light-bg py-2 font-medium h-10">
                           --
                        </div>
                        <div className="py-2 font-medium h-10">--</div>
                        <div className="bg-light-bg py-2 font-medium h-10">
                           --
                        </div>
                        <div className="py-2 font-medium h-10">--</div>
                        <div className="bg-light-bg py-2 font-medium h-10">
                           --
                        </div>
                        <div className="py-2 font-medium h-10">--</div>
                     </div>
                     <div className="text-center col-span-2">
                        <div className="h-[310px] text-center p-2 m-2  rounded-lg flex justify-center items-center opacity-70">
                           <div className="relative w-40 mx-auto aspect-square overflow-hidden rounded-lg">
                              <Image
                                 src="https://res.cloudinary.com/ngnohieu/image/upload/v1686466243/balance_paeizk.png"
                                 alt="img"
                                 layout="fill"
                                 className="object-cover"
                              />
                           </div>
                        </div>
                        <div className="bg-light-bg py-2 font-medium h-10">
                           --
                        </div>
                        <div className="py-2 font-medium h-10">--</div>
                        <div className="bg-light-bg py-2 font-medium h-10">
                           --
                        </div>
                        <div className="py-2 font-medium h-10">--</div>
                        <div className="bg-light-bg py-2 font-medium h-10">
                           --
                        </div>
                        <div className="py-2 font-medium h-10">--</div>
                     </div>
                  </>
               )}
            </div>
         </div>
      </div>
   );
};
// export default CompareProduct;
export default dynamic(() => Promise.resolve(CompareProduct), { ssr: false });
