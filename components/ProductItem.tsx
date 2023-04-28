/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import Layout from "./Layout/Layout";
import { HiOutlineShoppingCart } from "react-icons/hi";
import Link from "next/link";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { authAxios, endpoints } from "../API";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import moment from "moment";
import { BiCartAlt, BiGitCompare, BiShowAlt, BiUndo } from "react-icons/bi";
import { Store } from "../utils/Store";
import toast, { Toaster } from "react-hot-toast";
import QuickView from "./Model/QuickView";
import ItemsInPost from "./Model/ItemsInPost";
import Loading from "./Loading";

const ProductItem = ({ product, inCompare }) => {
   const [stateLike, setStateLike] = useState(false);
   const router = useRouter();
   const { state, dispatch } = useContext(Store);
   const [isOpenQuickViewModal, setIsOpenQuickViewModal] = useState(false);
   const [isOpenItemsModal, setIsOpenItemsModal] = useState(false);

   const handleAddToWishList = async () => {
      if (!Cookies.get("accessToken")) {
         // router.push("/signin");
         toast.error("You must sign in to add to wishlist!", {
            position: "top-center",
         });
      } else {
         try {
            const resAdd = await authAxios().get(
               endpoints["like_post"](product.id)
            );
            toast.success("Add to wishlist successful!", {
               position: "top-center",
            });
            loadLikeStatus();
         } catch (error) {
            console.log(error);
            toast.error("Something wrong, try it later!", {
               position: "top-center",
            });
         }
      }
   };
   const handleRemoveToWishList = async () => {
      try {
         const resRemove = await authAxios().get(
            endpoints["like_post"](product.id)
         );
         toast.success("Remove from wishlist successful!", {
            position: "top-center",
         });
         loadLikeStatus();
      } catch (error) {
         console.log(error);
      }
   };
   const handleAddCompare = () => {
      dispatch({
         type: "COMPARE_ADD_PRODUCT",
         payload: {
            id: product.id,
            avatar: product.avatar,
            title: product.title,
            finalPrice: product.finalPrice,
            initialPrice: product.initialPrice,
            category: product.category,
            sellStatus: product.sellStatus,
         },
      });
      toast.success(`Add to compare successful!`, {
         position: "top-center",
      });
   };
   const handleRemoveCompare = () => {
      dispatch({
         type: "COMPARE_REMOVE_PRODUCT",
         payload: {
            id: product.id,
         },
      });
      toast.success(`Remove compare successful!`, {
         position: "top-center",
      });
   };
   const loadLikeStatus = async () => {
      try {
         const resStatus = await authAxios().get(
            endpoints["check_like"](product.id)
         );
         setStateLike(resStatus.data.data);
      } catch (error) {
         console.log(error);
         toast.error("Something wrong, try it later!", {
            position: "top-center",
         });
      }
   };
   const handleDetailRoute = () => {
      router.push(`/sale_post/${product.id}`);
   };

   useEffect(() => {
      if (Cookies.get("accessToken")) {
         loadLikeStatus();
      }
      setStateLike(false);
   }, []);

   return (
      <div className="relative">
         <div
            className="dark:bg-dark-primary bg-light-primary rounded-lg p-6 cursor-pointer hover:shadow-lg"
            onClick={() => handleDetailRoute()}
         >
            <div className="relative">
               <div className="w-full aspect-square relative overflow-hidden rounded-2xl hover:scale-105 transition-all hover:sha">
                  <Image
                     src={product.avatar}
                     alt="avt"
                     layout="fill"
                     className="object-cover"
                  />
               </div>
               <div className="absolute -left-4 -bottom-4 rounded-tr-xl pt-2 pb-4 pr-4 pl-6 font-bold uppercase bg-light-primary dark:bg-dark-primary text-blue-main text-lg z-10">
                  {product.sellStatus.name}
               </div>
            </div>
            <div className="text-left font-bold text-xl uppercase mt-4 mb-2 line-clamp-2 h-14">
               {product.title}
            </div>
            <div className="text-left">
               <div className="text-2xl font-bold text-blue-main">
                  {product.finalPrice.toLocaleString("it-IT", {
                     style: "currency",
                     currency: "VND",
                  })}
               </div>
               <div className="line-through">
                  {product.initialPrice.toLocaleString("it-IT", {
                     style: "currency",
                     currency: "VND",
                  })}
               </div>
            </div>
            <div className="flex gap-4 mt-4">
               <button
                  className="w-24 h-14 rounded-2xl flex justify-center items-center text-white bg-primary-color hover:shadow-primary-color hover:shadow-lg text-3xl"
                  title="Show items"
                  onClick={(event) => {
                     event.stopPropagation();
                     setIsOpenItemsModal(true);
                     console.log(product);
                  }}
               >
                  <BiCartAlt />
               </button>
               <button
                  className="w-14 h-14 rounded-2xl flex justify-center items-center text-white bg-blue-main hover:shadow-blue-main hover:shadow-lg text-3xl"
                  title="Quick view"
                  onClick={(event) => {
                     event.stopPropagation();
                     setIsOpenQuickViewModal(true);
                  }}
               >
                  <BiShowAlt />
               </button>
               {inCompare ? (
                  <button
                     className="w-14 h-14 rounded-2xl flex justify-center items-center text-white bg-blue-main hover:shadow-blue-main  hover:shadow-lg text-3xl"
                     title="Remove compare"
                     onClick={(event) => {
                        event.stopPropagation();
                        handleRemoveCompare();
                     }}
                  >
                     <BiUndo />
                  </button>
               ) : (
                  <button
                     className="w-14 h-14 rounded-2xl flex justify-center items-center text-white bg-blue-main hover:shadow-blue-main hover:shadow-lg text-3xl"
                     title="Add compare"
                     onClick={(event) => {
                        event.stopPropagation();
                        handleAddCompare();
                     }}
                  >
                     <BiGitCompare />
                  </button>
               )}
            </div>

            <div className="absolute top-0 right-0">
               {!stateLike ? (
                  <button
                     className="text-primary-color w-12 h-12 rounded-lg bg-light-primary dark:bg-dark-primary text-3xl flex justify-center items-center hover:text-4xl transition-all"
                     title="like"
                     onClick={(event) => {
                        event.stopPropagation();
                        handleAddToWishList();
                     }}
                  >
                     <AiOutlineHeart />
                  </button>
               ) : (
                  <button
                     className=" text-primary-color w-12 h-12 rounded-lg bg-light-primary dark:bg-dark-primary text-3xl flex justify-center items-center hover:text-4xl transition-all"
                     title="unlike"
                     onClick={(event) => {
                        event.stopPropagation();
                        handleRemoveToWishList();
                     }}
                  >
                     <AiFillHeart />
                  </button>
               )}
            </div>
         </div>

         <div
            className={`fixed top-0 right-0 w-full h-screen backdrop-blur-sm items-center justify-center z-30 ${
               isOpenQuickViewModal ? "flex" : "hidden"
            }`}
         >
            {isOpenQuickViewModal && (
               <div className="w-1/2 h-fit">
                  <QuickView
                     postID={product.id}
                     setIsOpenQuickViewModal={setIsOpenQuickViewModal}
                  />
               </div>
            )}
         </div>
         <div
            className={`fixed top-0 right-0 w-full h-screen backdrop-blur-sm items-center justify-center z-30 ${
               isOpenItemsModal ? "flex" : "hidden"
            }`}
         >
            {isOpenItemsModal && (
               <div className="w-3/4 h-[34rem]">
                  <ItemsInPost
                     items={product.itemPostSet}
                     setIsOpenItemsModal={setIsOpenItemsModal}
                  />
               </div>
            )}
         </div>
      </div>
   );
};

export default ProductItem;
