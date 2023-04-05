/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import API, { authAxios, endpoints } from "../API";
import Layout from "../components/Layout/Layout";
import { Store } from "../utils/Store";
import Cookies from "js-cookie";
import { BiArrowBack, BiX } from "react-icons/bi";
import toast, { Toaster } from "react-hot-toast";
import emptyBox from "../public/empty-box.png";
import Image from "next/image";

const Wishlist = () => {
   const { state, dispatch } = useContext(Store);
   const { userInfo } = state;
   const router = useRouter();
   const [wishList, setWishList] = useState([]);

   const loadWishList = async () => {
      try {
         const resList = await API.get(endpoints["wishlist"](userInfo.id));
         setWishList(resList.data.data);
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      if (userInfo) {
         loadWishList();
      } else {
         router.push("/");
      }
   }, [router, userInfo]);

   const handleDeletePost = async (id) => {
      try {
         const resDeldete = await authAxios().get(endpoints["like_post"](id));
         if (resDeldete) {
            toast.success("Unlike successful", {
               position: "bottom-center",
            });
         }
         loadWishList();
      } catch (error) {
         console.log(error);
      }
   };
   return (
      <Layout title="Wishlist">
         <div className="flex gap-4 items-center m-6">
            <div
               className="bg-blue-main text-white p-3 text-2xl rounded-lg cursor-pointer hover:shadow-lg hover:shadow-blue-main"
               onClick={() => router.back()}
            >
               <BiArrowBack />
            </div>
            <div className="font-semibold text-2xl">/ Wishlist</div>
         </div>
         <div className="grid grid-cols-12 dark:bg-dark-primary bg-light-primary rounded-lg font-semibold p-4 mb-2 text-left">
            <div className="col-span-1">Avatar</div>
            <div className="col-span-3">Name</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Price</div>
            <div className="col-span-2">Brand</div>
            <div className="col-span-1">SellStatus</div>
            <div></div>
         </div>
         {wishList.length > 0 ? (
            <>
               {wishList.map((w) => (
                  <div key={w.id}>
                     <div className="grid grid-cols-12 gap-2 items-center dark:bg-dark-primary bg-light-primary rounded-lg p-4 text-left font-medium">
                        <div className="col-span-1 flex gap-4 items-center overflow-hidden relative w-16 aspect-square">
                           <Image
                              src={w.avatar}
                              alt=""
                              layout="fill"
                              className="object-cover rounded-lg"
                           />
                        </div>
                        <div className="col-span-3">{w.title}</div>
                        <div className="col-span-2">{w.category.name}</div>

                        <div className="col-span-2">
                           <div className="text-blue-main text-lg font-semibold">
                              {w.finalPrice.toLocaleString("it-IT", {
                                 style: "currency",
                                 currency: "VND",
                              })}
                           </div>
                           <div className="line-through text-sm">
                              {w.initialPrice.toLocaleString("it-IT", {
                                 style: "currency",
                                 currency: "VND",
                              })}
                           </div>
                        </div>
                        <div className="col-span-2">{w.brand}</div>
                        <div className="col-span-1">{w.sellStatus.name}</div>
                        <div className="flex justify-end items-center mr-8">
                           <div
                              className="w-10 h-10 bg-red-600 text-white p-2 text-2xl rounded-lg items-center flex justify-center hover:bg-opacity-80 cursor-pointer"
                              onClick={() => handleDeletePost(w.id)}
                           >
                              <BiX />
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </>
         ) : (
            <>
               <div className="relative overflow-hidden aspect-square w-1/4 mx-auto">
                  <Image
                     src={emptyBox}
                     alt="empty"
                     layout="fill"
                     className="object-cover"
                  />
               </div>
               <div className="uppercase text-2xl font-semibold mb-4">
                  your wishlist is empty
               </div>
            </>
         )}

         <Toaster />
      </Layout>
   );
};

export default Wishlist;
