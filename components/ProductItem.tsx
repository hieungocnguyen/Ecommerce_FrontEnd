/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Layout from "./Layout/Layout";
import { HiOutlineShoppingCart } from "react-icons/hi";
import Link from "next/link";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { authAxios, endpoints } from "../API";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import moment from "moment";
import { BiGitCompare } from "react-icons/bi";

const ProductItem = ({ product }) => {
   const [stateLike, setStateLike] = useState(false);
   const router = useRouter();
   const handleAddToWishList = async () => {
      if (!Cookies.get("accessToken")) {
         router.push("/signin");
      } else {
         const resAdd = await authAxios().get(
            endpoints["like_post"](product.id)
         );
         loadLikeStatus();
      }
   };
   const handleRemoveToWishList = async () => {
      const resRemove = await authAxios().get(
         endpoints["like_post"](product.id)
      );
      loadLikeStatus();
   };
   const loadLikeStatus = async () => {
      const resStatus = await authAxios().get(
         endpoints["check_like"](product.id)
      );
      setStateLike(resStatus.data.data);
   };
   useEffect(() => {
      if (Cookies.get("accessToken")) {
         loadLikeStatus();
      }
      setStateLike(false);
   }, []);
   return (
      <div className=" bg-light-primary dark:bg-dark-primary rounded-lg">
         <div className="flex justify-between m-2 items-center">
            <div className="bg-red-500 font-semibold p-1 w-fit rounded-lg whitespace-nowrap text-sm">
               {product.sellStatus.name}
            </div>
            <div className="mr-2">
               {moment(product.createdDate).startOf("hour").fromNow()}
            </div>
         </div>

         <img
            src={product.avatar}
            alt="tai nghe"
            className="w-[200px] h-[200px] object-cover rounded-lg mx-auto my-[24px]"
         />
         <div className="mx-7 text-center">
            <div className="font-semibold line-clamp-2 text-lg  uppercase h-16 ">
               {product.title}
            </div>
            <div className="line-through text-sm opacity-60">
               {product.initialPrice.toLocaleString("it-IT", {
                  style: "currency",
                  currency: "VND",
               })}
            </div>

            <div className="text-blue-main font-bold text-xl">
               {product.finalPrice.toLocaleString("it-IT", {
                  style: "currency",
                  currency: "VND",
               })}
            </div>
            <div>{product.category.name}</div>
            <div className="grid grid-cols-4 my-4 gap-3">
               <div className="col-span-2">
                  <Link href={`/sale_post/${product.id}`}>
                     <button className=" h-9 text-white bg-blue-main rounded-lg hover:opacity-80 font-semibold text-sm w-full">
                        Detail
                     </button>
                  </Link>
               </div>
               <div>
                  {!stateLike ? (
                     <button
                        className=" h-9 text-white bg-blue-main rounded-lg hover:opacity-80 font-semibold text-xl w-full flex justify-center items-center"
                        onClick={handleAddToWishList}
                     >
                        <AiOutlineHeart />
                     </button>
                  ) : (
                     <button
                        className=" h-9 text-white bg-blue-main rounded-lg hover:opacity-80 font-semibold text-xl w-full flex justify-center items-center"
                        onClick={handleRemoveToWishList}
                     >
                        <AiFillHeart />
                     </button>
                  )}
               </div>
               <div className="h-9 text-white bg-blue-main rounded-lg hover:opacity-80 font-semibold text-xl w-full flex justify-center items-center">
                  <BiGitCompare />
               </div>
            </div>
         </div>
      </div>
   );
};

export default ProductItem;
