/* eslint-disable @next/next/no-img-element */
import React, { useContext, useEffect, useState } from "react";
import API, { authAxios, endpoints } from "../API";
import Layout from "../components/Layout/Layout";
import { Store } from "../utils/Store";
import Cookies from "js-cookie";
import axios from "axios";
import { BiTrash } from "react-icons/bi";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";

const Cart = () => {
   const { state, dispatch } = useContext(Store);
   const { userInfo, cart } = state;
   const [initialRenderComplete, setInitialRenderComplete] = useState(false);
   const [itemsInCart, setItemsInCart] = useState([]);
   const [totalPrice, setTotalPrice] = useState(0);
   const router = useRouter();

   useEffect(() => {
      const loadTotalCart = async () => {
         const resTotal = await API.get(endpoints["get_total"](userInfo.id));
         setTotalPrice(resTotal.data.data);
      };
      const loadItemsFromCart = async () => {
         const resItems = await API.get(
            endpoints["get_cart_by_id"](userInfo.id)
         );
         setItemsInCart(resItems.data.data.cartItemSet);
      };
      if (userInfo) {
         loadItemsFromCart();
         loadTotalCart();
      } else {
         router.push("/signin");
         toast.error("Login to view cart!", {
            position: "bottom-center",
         });
      }
      setInitialRenderComplete(true);
   }, [router, userInfo]);
   const handlePaymentbyCash = async () => {
      try {
         const resPayment = await authAxios().post(
            endpoints["payment_cart"](1)
         );
         console.log(resPayment.data);
         Cookies.remove("cartItems");
         setItemsInCart([]);
         setTotalPrice(0);
         toast.success("Payment successful!", {
            position: "bottom-center",
         });
      } catch (error) {}
   };
   const handleClearCart = async () => {
      try {
         const resClearCart = await authAxios().put(endpoints["clear_cart"]);
         Cookies.remove("cartItems");
         toast.success("Remove all successful!", {
            position: "bottom-center",
         });
         dispatch({
            type: "CART_REMOVE_ALL_ITEM",
            payload: {},
         });
         setItemsInCart([]);
         setTotalPrice(0);
      } catch (error) {}
   };
   const handleDelete = async (item) => {
      try {
         const resDelete = await authAxios().delete(
            endpoints["delete_item_in_cart"](item.itemPost.id)
         );
         console.log(resDelete.data);
         setItemsInCart(resDelete.data.data);
         dispatch({ type: "CART_REMOVE_ITEM", payload: item });
         toast.success(`Delete item "${item.itemPost.name}" successful!`, {
            position: "bottom-center",
         });
      } catch (error) {}
   };
   if (!initialRenderComplete) {
      return null;
   } else {
      return (
         <Layout title="Your Cart">
            <div className="font-semibold text-2xl pt-4 pb-10">Your Cart</div>
            <div className="grid grid-cols-6 dark:bg-dark-primary bg-light-primary h-16 items-center rounded-t-lg font-semibold">
               <div className="">Image</div>
               <div className="col-span-2">Title</div>
               <div>Quantity</div>
               <div>Price</div>
               <div>Remove</div>
            </div>
            {itemsInCart.map((i) => (
               <div
                  key={i.id}
                  className="grid grid-cols-6 items-center dark:bg-dark-primary bg-light-primary rounded-lg overflow-hidden my-4"
               >
                  <div className="flex justify-center">
                     <img
                        src={i.itemPost.avatar}
                        alt="avatar item"
                        className="w-20 h-20 m-4 rounded-lg col-span-1"
                     />
                  </div>
                  <div className="font-semibold col-span-2">
                     {i.itemPost.name}
                  </div>
                  <div className="col-span-1 ">{i.quantity}</div>
                  <div className="col-span-1 text-blue-main font-semibold">
                     {i.quantity * i.itemPost.unitPrice}
                  </div>
                  <button
                     className="col-span-1 flex items-center justify-center hover:opacity-80"
                     onClick={() => handleDelete(i)}
                  >
                     <div className="w-10 h-10 bg-blue-main text-white p-2 flex justify-center items-center text-xl rounded-lg">
                        <BiTrash />
                     </div>
                  </button>
               </div>
            ))}
            <button
               className="text-white bg-red-700 rounded-lg font-semibold h-10 flex items-center justify-center w-2/3 mx-auto my-4 hover:opacity-80"
               onClick={handleClearCart}
            >
               Remove all items in your cart
            </button>
            <div className="dark:bg-dark-primary bg-light-primary rounded-b-lg flex my-4 justify-around  items-center">
               <div className="text-2xl">
                  Total:{" "}
                  <span className="text-blue-main font-bold text-3xl">
                     {totalPrice}
                  </span>
               </div>
               <div className="flex flex-col my-4 w-1/3">
                  <button
                     className="w-full bg-blue-main font-semibold text-white my-2 h-[60px] rounded-lg hover:opacity-80"
                     onClick={handlePaymentbyCash}
                  >
                     Payment by cash
                  </button>
                  <button className="w-full bg-[#da2d8c] font-semibold text-white my-2 h-[60px] rounded-lg hover:opacity-80">
                     Payment by MoMo Wallet
                  </button>
               </div>
            </div>

            <Toaster />
         </Layout>
      );
   }
};

export default Cart;
