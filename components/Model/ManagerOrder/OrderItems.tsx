import { useEffect, useRef, useState } from "react";
import API, { endpoints } from "../../../API";
import Image from "next/image";

const OrderItems = ({ setIDOpenModelOrderItems, IDOpenModalOrderItems }) => {
   const wrapperRef = useRef(null);
   const [items, setItems] = useState<any>([]);

   const fetchItemsOrder = async (OrderID: number) => {
      try {
         const res = await API.get(endpoints["get_order_detail"](OrderID));
         setItems(res.data.data);
      } catch (error) {}
   };

   useEffect(() => {
      if (IDOpenModalOrderItems > -1) {
         fetchItemsOrder(IDOpenModalOrderItems);
      }

      function handleClickOutside(event) {
         if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setIDOpenModelOrderItems(-1);
         }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [wrapperRef, IDOpenModalOrderItems]);

   return (
      <div
         className="dark:bg-neutral-800 bg-light-primary rounded-lg p-6 w-full h-full shadow-lg"
         ref={wrapperRef}
      >
         <div className="font-semibold text-center text-2xl mb-3">
            Items of Order
         </div>
         {items.length > 0 ? (
            <>
               <div className="">
                  {items.map((item) => (
                     <div
                        key={item.id}
                        className="grid grid-cols-12 items-center gap-2 text-left p-3 bg-light-spot rounded-lg font-medium"
                     >
                        <div className="col-span-1 w-full relative overflow-hidden rounded-xl aspect-square">
                           <Image
                              src={item.itemPost.avatar}
                              alt="avatar"
                              layout="fill"
                              className="object-cover"
                           />
                        </div>
                        <div className="col-span-4">
                           {item.itemPost.name} - {item.itemPost.description}
                        </div>
                        <div className="col-span-3">
                           {item.itemPost.unitPrice.toLocaleString("it-IT", {
                              style: "currency",
                              currency: "VND",
                           })}
                        </div>
                        <div className="col-span-1">x{item.quantity}</div>
                        <div className="col-span-3 text-primary-color font-semibold text-lg">
                           {(
                              item.quantity * item.itemPost.unitPrice
                           ).toLocaleString("it-IT", {
                              style: "currency",
                              currency: "VND",
                           })}
                        </div>
                     </div>
                  ))}
               </div>
            </>
         ) : (
            <></>
         )}
      </div>
   );
};

export default OrderItems;
