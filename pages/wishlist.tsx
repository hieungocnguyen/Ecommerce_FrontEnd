/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import API, { authAxios, endpoints } from "../API";
import Layout from "../components/Layout/Layout";
import { Store } from "../utils/Store";
import Cookies from "js-cookie";
import { BiX } from "react-icons/bi";
import toast, { Toaster } from "react-hot-toast";

const Wishlist = () => {
   const { state, dispatch } = useContext(Store);
   const { userInfo } = state;
   const router = useRouter();
   const [wishList, setWishList] = useState([]);

   const loadWishList = async () => {
      const resList = await API.get(endpoints["wishlist"](userInfo.id));
      setWishList(resList.data.data);
   };

   useEffect(() => {
      if (userInfo) {
         loadWishList();
      } else {
         router.push("/");
      }
   }, [router, userInfo]);

   const handleDeletePost = async (id) => {
      const resDeldete = await authAxios().get(endpoints["like_post"](id));
      if (resDeldete) {
         toast.success("Unlike successful", {
            position: "bottom-center",
         });
      }
      loadWishList();
   };
   return (
      <Layout title="Wishlist">
         <div className="grid grid-cols-7 items-center my-4 bg-dark-primary rounded-lg p-4 font-semibold">
            <div className="col-span-2">Name</div>
            <div>Price</div>
            <div>SellStatus</div>
            <div>Category</div>
            <div>Brand</div>
            <div></div>
         </div>
         {wishList.map((w) => (
            <div key={w.id}>
               <div className="grid grid-cols-7 items-center my-4 bg-dark-primary rounded-lg p-4">
                  <div className="col-span-2 flex gap-4 items-center">
                     <img
                        src={w.avatar}
                        alt=""
                        className="w-20 h-20 rounded-full"
                     />
                     <div className="text-left">{w.title}</div>
                  </div>
                  <div>
                     <div className="text-blue-main text-lg font-semibold">
                        {w.finalPrice.toLocaleString("it-IT", {
                           style: "currency",
                           currency: "VND",
                        })}
                     </div>
                     <div className="line-through">
                        {w.initialPrice.toLocaleString("it-IT", {
                           style: "currency",
                           currency: "VND",
                        })}
                     </div>
                  </div>
                  <div>{w.sellStatus.name}</div>
                  <div>{w.category.name}</div>
                  <div className="">{w.brand}</div>
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
         <Toaster />
      </Layout>
   );
};

export default Wishlist;
