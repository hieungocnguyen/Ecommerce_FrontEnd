import axios from "axios";
import Image from "next/image";
import router from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { Store } from "../../utils/Store";

const ItemsInPost = ({ items, setIsOpenItemsModal }) => {
   const wrapperRef = useRef(null);
   const [subTotal, setSubTotal] = useState(0);
   const [quantityItems, setQuantityItems] = useState([]);
   const { state, dispatch } = useContext(Store);

   const handleChangeQuantity = (item: any, quantity: number) => {
      var updatedList = quantityItems;
      var objItem = {
         id: item.id,
         unitPrice: item.unitPrice,
         quantity: quantity,
      };

      if (
         quantity === 0 &&
         quantityItems.findIndex((i) => i.id === item.id) > -1
      ) {
         updatedList.splice(
            quantityItems.findIndex((i) => i.id === item.id),
            1
         );
      } else {
         if (quantity > 0) {
            if (quantityItems.findIndex((i) => i.id === item.id) >= 0) {
               updatedList[
                  quantityItems.findIndex((i) => i.id === item.id)
               ].quantity = quantity;
            } else {
               updatedList = [...quantityItems, objItem];
            }
         }
      }
      setQuantityItems(updatedList);

      let tempTotal = 0;
      updatedList.map((i) => (tempTotal += i.unitPrice * i.quantity));
      setSubTotal(tempTotal);
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
         toast.success("Add to cart successfully !", {
            position: "bottom-center",
         });
         setIsOpenItemsModal(false);
      } else {
         router.push("/signin");
      }
   };

   useEffect(() => {
      function handleClickOutside(event) {
         if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setIsOpenItemsModal(false);
         }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [wrapperRef]);

   return (
      <div
         className="dark:bg-neutral-800 bg-light-bg rounded-lg p-8 w-full h-full relative"
         ref={wrapperRef}
      >
         <div className="mb-8 font-semibold text-2xl">Choose item</div>
         <div className="overflow-auto p-4 h-[340px]  rounded-lg dark:bg-dark-primary bg-light-spot">
            <div className="grid grid-cols-12 gap-4 items-center font-semibold mb-4">
               <div className="col-span-5">Item</div>
               <div className="col-span-2">Unit price</div>
               <div className="col-span-2">In stock</div>
               <div className="col-span-3">Quantity</div>
            </div>
            {items.map((i) => (
               <div
                  key={i.id}
                  className="grid grid-cols-12 gap-4 items-center mb-4 "
               >
                  <div
                     className={`col-span-5 p-3 text-left rounded-lg flex items-center gap-4 ${
                        i.inventory > 0
                           ? "dark:bg-dark-spot bg-light-primary"
                           : "bg-red-200"
                     }`}
                  >
                     <div className="overflow-hidden rounded-lg relative w-12 h-12">
                        <Image
                           src={i.avatar}
                           alt="avatar"
                           layout="fill"
                           className="object-cover"
                        />
                     </div>
                     <div className="font-semibold">
                        {i.name} - {i.description}
                     </div>
                  </div>
                  <div className="col-span-2 font-semibold">
                     {i.unitPrice.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                     })}
                  </div>
                  <div
                     className={`col-span-2 font-semibold ${
                        i.inventory > 0 ? "" : "text-xl text-red-600"
                     }`}
                  >
                     {i.inventory}
                  </div>
                  <div className="col-span-3">
                     <input
                        type="number"
                        name="quantity"
                        id="quantity"
                        min="0"
                        max={i.inventory}
                        step="1"
                        defaultValue={0}
                        disabled={i.inventory > 0 ? false : true}
                        className="p-4 rounded-lg font-semibold resetvalue bg-light-primary dark:bg-dark-spot disabled:cursor-not-allowed"
                        onKeyDown={(e) => {
                           ["e", "E", "+", "-", ".", ","].includes(e.key) &&
                              e.preventDefault();
                        }}
                        onChange={(e) => {
                           if (e.target.value > i.inventory) {
                              e.target.value = i.inventory;
                              e.preventDefault();
                           }
                           handleChangeQuantity(i, Number(e.target.value));
                        }}
                     />
                  </div>
               </div>
            ))}
         </div>
         <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-8 items-center">
            <div className="text-blue-main text-2xl font-semibold">
               <span className="text-dark-text text-lg">Subtotal: </span>
               {subTotal.toLocaleString("it-IT", {
                  style: "currency",
                  currency: "VND",
               })}
            </div>
            <button
               className="bg-blue-main py-4 px-6 text-dark-text font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-main"
               onClick={handleAddToCart}
            >
               Add to your cart
            </button>
         </div>
      </div>
   );
};

export default ItemsInPost;
