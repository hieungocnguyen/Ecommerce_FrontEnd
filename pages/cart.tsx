/* eslint-disable @next/next/no-img-element */
import React, { useContext, useEffect, useState } from "react";
import API, { authAxios, endpoints } from "../API";
import Layout from "../components/Layout/Layout";
import { Store } from "../utils/Store";
import Cookies from "js-cookie";
import axios from "axios";
import { BiTrash, BiTrashAlt } from "react-icons/bi";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../components/Loader";
import Image from "next/image";
import { AiOutlineClear } from "react-icons/ai";
import emptyBox from "../public/empty-box.png";

const Cart = () => {
   const { state, dispatch } = useContext(Store);
   const { userInfo } = state;
   const [initialRenderComplete, setInitialRenderComplete] = useState(false);
   const [itemsInCart, setItemsInCart] = useState([]);
   const [totalPrice, setTotalPrice] = useState(0);
   const [loading, setLoading] = useState(false);
   const router = useRouter();

   const loadTotalCart = async () => {
      const resTotal = await API.get(endpoints["get_total"](userInfo.id));
      setTotalPrice(resTotal.data.data);
   };
   const loadItemsFromCart = async () => {
      const resItems = await API.get(endpoints["get_cart_by_id"](userInfo.id));
      setItemsInCart(resItems.data.data.cartItemSet);
   };
   useEffect(() => {
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
         loadItemsFromCart();
         loadTotalCart();
      } catch (error) {
         console.log(error);
      }
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

   const handleChangeQuantity = (item: any, quantity: number) => {
      const fetchUpdateCart = async () => {
         const res = await authAxios().patch(endpoints["update_cart"], {
            itemID: item.itemPost.id,
            quantity: quantity,
         });
         toast.success("Update quantity successful!", {
            position: "top-center",
            duration: 700,
         });
      };
      fetchUpdateCart();
   };

   const handleRouteCheckout = () => {
      setTimeout(() => setLoading(true));
      router.push("/checkout/payment");
      setLoading(false);
   };

   if (!initialRenderComplete) {
      return null;
   } else {
      return (
         <Layout title="Cart">
            <div className="flex justify-between pt-8 pb-4 px-12 mx-8">
               <div className="font-semibold text-3xl text-left">Your Cart</div>
               {itemsInCart.length > 0 ? (
                  <div>
                     <button
                        className="bg-blue-main px-8 py-3 rounded-lg font-semibold hover:shadow-md hover:shadow-blue-main transition-all flex items-center gap-1 text-white"
                        onClick={handleClearCart}
                     >
                        <AiOutlineClear className="text-xl" />
                        <div>Clear cart</div>
                     </button>
                  </div>
               ) : (
                  <></>
               )}
            </div>
            {itemsInCart.length > 0 ? (
               <>
                  <div className="grid grid-cols-12 h-16 items-center rounded-t-lg font-bold text-left p-6">
                     <div className="col-span-1">Image</div>
                     <div className="col-span-4">Title</div>
                     <div className="col-span-2">Quantity</div>
                     <div className="col-span-2">Unit Price</div>
                     <div className="col-span-2">Price</div>
                     <div className="col-span-1"></div>
                  </div>
               </>
            ) : (
               <></>
            )}

            {itemsInCart
               .sort((a, b) => (a.id < b.id ? 1 : -1))
               .map((i) => (
                  <div
                     key={i.id}
                     className="grid grid-cols-12 items-center dark:bg-dark-primary bg-light-primary rounded-lg overflow-hidden mb-4 p-4 text-left"
                  >
                     <div className="col-span-1 relative overflow-hidden rounded-lg w-16 h-16">
                        <Image
                           src={i.itemPost.avatar}
                           alt="avatar item"
                           layout="fill"
                           className="object-cover"
                        />
                     </div>
                     <div className="col-span-4 font-semibold">
                        {i.itemPost.name} - {i.itemPost.description}
                     </div>
                     <div className="col-span-2 font-semibold">
                        <input
                           type="number"
                           className="p-3 rounded-lg"
                           defaultValue={i.quantity}
                           min={0}
                           max={i.itemPost.inventory}
                           step={1}
                           onKeyDown={(e) => {
                              ["e", "E", "+", "-"].includes(e.key) &&
                                 e.preventDefault();
                           }}
                           onChange={(e) => {
                              if (e.target.value > i.itemPost.inventory) {
                                 e.target.value = i.itemPost.inventory;
                                 e.preventDefault();
                              }
                              if (Number(e.target.value) > 0) {
                                 handleChangeQuantity(
                                    i,
                                    Number(e.target.value)
                                 );
                              } else {
                                 handleDelete(i);
                              }
                           }}
                        />
                     </div>
                     <div className="col-span-2  font-semibold">
                        {i.itemPost.unitPrice.toLocaleString("it-IT", {
                           style: "currency",
                           currency: "VND",
                        })}
                     </div>
                     <div className="col-span-2 text-blue-main font-semibold text-lg">
                        {(i.quantity * i.itemPost.unitPrice).toLocaleString(
                           "it-IT",
                           {
                              style: "currency",
                              currency: "VND",
                           }
                        )}
                     </div>
                     <button
                        className="col-span-1 flex items-center justify-center hover:opacity-80"
                        onClick={() => handleDelete(i)}
                     >
                        <div className="w-10 h-10 bg-blue-main text-white p-2 flex justify-center items-center text-xl rounded-lg hover:shadow-md hover:shadow-blue-main transition-all">
                           <BiTrashAlt />
                        </div>
                     </button>
                  </div>
               ))}
            {itemsInCart.length > 0 ? (
               <>
                  <div className="dark:bg-dark-primary bg-light-primary rounded-lg flex my-4 justify-between items-center mx-20 py-8 px-16">
                     <div className="text-left">
                        <div className="text-2xl">
                           Subtotal:{" "}
                           <span className="text-blue-main font-bold text-3xl">
                              {totalPrice.toLocaleString("it-IT", {
                                 style: "currency",
                                 currency: "VND",
                              })}
                           </span>
                        </div>
                        <div className="text-lg">
                           Total item: {itemsInCart.length}
                        </div>
                     </div>
                     {/* <div className="flex flex-col my-4 w-1/3">
                  <button
                     className="w-full bg-blue-main font-semibold text-white my-2 h-[60px] rounded-lg hover:opacity-80"
                     onClick={handlePaymentbyCash}
                  >
                     Payment by cash
                  </button>
                  <button className="w-full bg-[#da2d8c] font-semibold text-white my-2 h-[60px] rounded-lg hover:opacity-80">
                     Payment by MoMo Wallet
                  </button>
               </div> */}
                     <button
                        className="py-4 px-12 bg-blue-main font-semibold rounded-lg text-lg hover:shadow-md hover:shadow-blue-main transition-all text-white"
                        onClick={handleRouteCheckout}
                     >
                        Checkout
                     </button>
                  </div>
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
                  <div className="uppercase text-2xl font-semibold">
                     your cart is empty
                  </div>
               </>
            )}

            {loading ? <Loader /> : <></>}
            <Toaster />
         </Layout>
      );
   }
};

export default Cart;
