/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import API, { authAxios, endpoints } from "../API";
import Layout from "../components/Layout/Layout";
import { Store } from "../utils/Store";
import Cookies from "js-cookie";
import axios from "axios";

const Cart = () => {
   const { state, dispatch } = useContext(Store);
   const { userInfo } = state;
   const [initialRenderComplete, setInitialRenderComplete] = useState(false);
   const [itemsInCart, setItemsInCart] = useState([]);

   useEffect(() => {
      const loadItemsFromCart = async () => {
         const resItems = await API.get(
            endpoints["get_cart_by_id"](userInfo.id)
         );
         setItemsInCart(resItems.data.data.cartItemSet);
      };
      if (Cookies.get("accessToken")) {
         loadItemsFromCart();
      } else {
         console.log("dang nhap de xem");
      }
      setInitialRenderComplete(true);
   }, []);
   // if (itemsInCart) {
   //    console.log(itemsInCart);
   // } else {
   //    console.log("empty");
   // }
   if (!initialRenderComplete) {
      return null;
   } else {
      return (
         <Layout title="Your Cart">
            <div className="font-semibold text-2xl pt-4 pb-10">Your Cart</div>
            {itemsInCart.map((i) => (
               <div key={i.id}>
                  {i.itemPost.name} x{i.quantity}
               </div>
            ))}
         </Layout>
      );
   }
};

export default Cart;
