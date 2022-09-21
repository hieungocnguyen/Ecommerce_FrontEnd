/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import React from "react";
import Layout from "./Layout/Layout";
import { HiOutlineShoppingCart } from "react-icons/hi";
import Link from "next/link";

const ProductItem = (props: any) => {
   return (
      <div className="h-[320px] bg-light-primary dark:bg-dark-primary rounded-lg">
         <img
            src={props.product.imageURL}
            alt="tai nghe"
            className="w-[160px] h-[160px] object-cover rounded-lg mx-auto my-[20px]"
         />
         <div className="mx-7 text-center">
            <div className="font-semibold">{props.product.title}</div>
            <div className="text-blue-main font-bold">
               {props.product.price}
            </div>
            <div className="flex justify-between mt-4">
               <Link href={`/product/${props.product.id}`}>
                  <button className="w-[130px] h-[40px] text-white bg-blue-main rounded-lg hover:opacity-80 font-semibold text-sm">
                     Detail
                  </button>
               </Link>
               <button className=" h-[40px] w-[40px] text-white bg-blue-main rounded-lg hover:opacity-80 flex items-center justify-center text-lg">
                  <HiOutlineShoppingCart />
               </button>
            </div>
         </div>
      </div>
   );
};

export default ProductItem;
