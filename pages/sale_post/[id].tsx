/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import React, { useContext, useState } from "react";
import { endpoints } from "../../API";
import Layout from "../../components/Layout/Layout";

import Cookies from "js-cookie";
import { Store } from "../../utils/Store";

const ProductPage = (salePost) => {
   const { state, dispatch } = useContext(Store);
   const [checkedItems, setCheckedItems] = useState([]);
   const handleChecked = (e) => {
      var updatedList = [...checkedItems];
      if (e.target.checked) {
         updatedList = [...checkedItems, e.target.value];
      } else {
         updatedList.splice(checkedItems.indexOf(e.target.value), 1);
      }
      setCheckedItems(updatedList);
   };
   const handleAddToCart = () => {
      const addtoCart = async (id) => {
         const res = await axios.post(
            "http://localhost:8080/ou-ecommerce/api/cart/add-to-cart",
            {
               itemID: Number(id),
               quantity: 1,
            },
            {
               headers: {
                  Authorization: `Bearer ${Cookies.get("accessToken")}`,
               },
            }
         );
         dispatch({ type: "CART_ADD_ITEM", payload: { id } });
      };
      checkedItems.map((i) => {
         addtoCart(i);
      });
   };

   return (
      <Layout title="Detail">
         <div className="grid lg:grid-cols-2 grid-cols-1 gap-8 m-8 ">
            <div className="overflow-hidden aspect-square">
               <img
                  src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8aGVhZHBob25lfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=1000&q=60"
                  alt="tai nghe"
                  className="w-full h-full object-cover rounded-lg"
               />
            </div>
            <div>
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
                           <div className="flex items-center pl-3">
                              <input
                                 id={item.id}
                                 type="checkbox"
                                 value={item.id}
                                 className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                 onChange={handleChecked}
                              ></input>
                              <label
                                 htmlFor={item.id}
                                 className="py-3 ml-2 w-full text-sm font-medium text-gray-900 dark:text-gray-300"
                              >
                                 {item.name}
                              </label>
                              <div>{item.unitPrice}</div>
                           </div>
                        </li>
                     ))}
                  </ul>
                  <div>
                     <button
                        className="bg-blue-main w-[80%] h-[60px] flex items-center justify-center rounded-lg mx-auto my-8 font-semibold hover:opacity-80"
                        onClick={handleAddToCart}
                     >
                        Add checked item to your cart
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
