/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import React from "react";
import Layout from "./Layout/Layout";
import { HiOutlineShoppingCart } from "react-icons/hi";
import Link from "next/link";

const ProductItem = ({ product, addToCartHandler }) => {
   return (
      <div className=" bg-light-primary dark:bg-dark-primary rounded-lg">
         <img
            src={product.avatar}
            alt="tai nghe"
            className="w-[160px] h-[160px] object-cover rounded-lg mx-auto my-[24px]"
         />
         <div className="mx-7 text-center">
            <div className="font-semibold line-clamp-2">{product.title}</div>
            <div className="text-blue-main font-bold">{product.finalPrice}</div>
            <div className="grid grid-cols-4 my-4 gap-3">
               <Link href={`/sale_post/${product.id}`}>
                  <button className=" col-span-3 h-9 text-white bg-blue-main rounded-lg hover:opacity-80 font-semibold text-sm ">
                     Detail
                  </button>
               </Link>
               <button
                  className=" col-span-1 h-9 text-white bg-blue-main rounded-lg hover:opacity-80 flex items-center justify-center text-lg"
                  onClick={() => addToCartHandler(product)}
               >
                  <HiOutlineShoppingCart />
               </button>
            </div>
         </div>
      </div>
   );
};

export default ProductItem;
