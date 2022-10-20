/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import React, { useContext, useState } from "react";
import { endpoints } from "../../API";
import Layout from "../../components/Layout/Layout";

import Cookies from "js-cookie";
import { Store } from "../../utils/Store";
import { useRouter } from "next/router";
import { type } from "os";
type;

const ProductPage = (salePost) => {
   const { state, dispatch } = useContext(Store);
   const [quantityItems, setQuantityItems] = useState([]);
   const router = useRouter();
   const handleChangeQuantity = (item, quantity) => {
      var updatedList = [...quantityItems];
      var objItem = { id: item.id, quantity: quantity };
      if (quantity > 0) {
         updatedList = [...quantityItems, objItem];
      } else {
         updatedList.splice(quantityItems.indexOf(quantity), 1);
      }
      setQuantityItems(updatedList);
   };
   const handleAddToCart = () => {
      const addtoCart = async (i) => {
         const res = await axios.post(
            "http://localhost:8080/ou-ecommerce/api/cart/add-to-cart",
            {
               itemID: Number(i.id),
               quantity: i.quantity,
            },
            {
               headers: {
                  Authorization: `Bearer ${Cookies.get("accessToken")}`,
               },
            }
         );
         dispatch({
            type: "CART_ADD_ITEM",
            payload: { id: i.id, quantity: i.quantity },
         });
      };
      if (Cookies.get("accessToken")) {
         quantityItems.map((i) => {
            addtoCart(i);
         });
      } else {
         router.push("/signin");
      }
   };
   //function number input

   return (
      <Layout title="Detail">
         <div className="grid lg:grid-cols-3 grid-cols-1 gap-8 m-8 ">
            <div className="overflow-hidden aspect-square col-span-1">
               <img
                  src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8aGVhZHBob25lfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=1000&q=60"
                  alt="tai nghe"
                  className="w-full h-full object-cover rounded-lg"
               />
            </div>
            <div className="col-span-2">
               <div className="font-semibold text-3xl text-left">
                  {salePost.salePost.title}
               </div>
               <div>
                  <ul>
                     {salePost.salePost.itemPostSet.map((item) => (
                        <li
                           className="w-full rounded-t-lg border-b border-gray-200 dark:border-gray-600"
                           key={item.id}
                        >
                           <div className="grid grid-cols-3 items-center pl-3">
                              <label
                                 htmlFor={item.id}
                                 className="py-3 ml-2 w-full text-sm font-medium text-gray-900 dark:text-gray-300 text-left"
                              >
                                 {item.name}
                              </label>
                              {/* number input */}
                              {/* <div className="flex">
                                 <button onClick={DecreaseItem}>-</button>
                                 {numberItems ? (
                                    <div>{numberItems}</div>
                                 ) : (
                                    <div>0</div>
                                 )}
                                 <button onClick={IncrementItem}>+</button>
                              </div> */}
                              <input
                                 type="number"
                                 onChange={(e) =>
                                    handleChangeQuantity(item, e.target.value)
                                 }
                              />
                              <div>{item.unitPrice}</div>
                           </div>
                        </li>
                     ))}
                  </ul>
                  <div>
                     <button
                        className="bg-blue-main w-[70%] h-[60px] flex items-center justify-center rounded-lg mx-auto my-8 font-semibold hover:opacity-80 text-white"
                        onClick={handleAddToCart}
                     >
                        Add to your cart
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </Layout>
   );
};

export default ProductPage;
export const getStaticProps = async (context) => {
   // request salepost detail
   const id = context.params.id;
   const resSalePost = await axios.get(
      "http://localhost:8080/ou-ecommerce/api/sale-post/" + id
   );
   const salePost = await resSalePost.data.data;

   return { props: { salePost } };
};

export async function getStaticPaths() {
   if (process.env.SKIP_BUILD_STATIC_GENERATION) {
      return {
         paths: [],
         fallback: "blocking",
      };
   }
   const res = await axios.get(
      "http://localhost:8080/ou-ecommerce/api/sale-post/all"
   );
   const salePosts = await res.data.data;
   const paths = salePosts.map((salePost) => ({
      params: { id: salePost.id.toString() },
   }));
   return {
      paths,
      fallback: false, // can also be true or 'blocking'
   };
}
