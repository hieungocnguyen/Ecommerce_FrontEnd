import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import API, { endpoints } from "../../API";
import { ClipLoader } from "react-spinners";

const OrderView = ({
   orderInfo,
   orderAgencyID,
   setOrderAgencyID,
   setOrderInfo,
}) => {
   const wrapperRef = useRef(null);
   const [detailOrders, setDetailOrders] = useState<any>();

   const fetchDetailOrder = async () => {
      try {
         const res = await API.get(
            endpoints["get_order_detail"](orderAgencyID)
         );
         setDetailOrders(res.data.data);
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      if (orderAgencyID !== 0) {
         fetchDetailOrder();
      }

      function handleClickOutside(event) {
         if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setOrderAgencyID(0);
            setDetailOrders(undefined);
         }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [wrapperRef, orderAgencyID]);
   return (
      <div
         className="dark:bg-neutral-800 bg-light-primary rounded-lg p-8 w-full h-full relative shadow-lg shadow-blue-main"
         ref={wrapperRef}
      >
         {detailOrders ? (
            <>
               <div className="">
                  {detailOrders.map((order) => (
                     <div
                        key={order.id}
                        className="grid grid-cols-12 items-center gap-2 my-3 text-left p-3 bg-light-spot rounded-lg"
                     >
                        <div className="col-span-1 w-full relative overflow-hidden rounded-xl aspect-square">
                           <Image
                              src={order.itemPost.avatar}
                              alt="avatar"
                              layout="fill"
                              className="object-cover"
                           />
                        </div>
                        <div className="col-span-4">
                           {order.itemPost.name} - {order.itemPost.description}
                        </div>
                        <div className="col-span-3">
                           {order.itemPost.unitPrice.toLocaleString("it-IT", {
                              style: "currency",
                              currency: "VND",
                           })}
                        </div>
                        <div className="col-span-1">x{order.quantity}</div>
                        <div className="col-span-3 text-blue-main font-semibold text-lg">
                           {(
                              order.quantity * order.itemPost.unitPrice
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
            <div>
               <div className="flex justify-center my-8">
                  <ClipLoader size={35} color="#FF8500" />
               </div>
            </div>
         )}
         {/* <div className="grid grid-cols-12 gap-6">
            <div className="col-span-6 text-left h-fit">
               <div className="relative overflow-hidden w-full aspect-square rounded-xl mb-4">
                  <Image
                     src={detailOrder.itemPost.avatar}
                     alt="avatar"
                     layout="fill"
                     className="object-cover"
                  />
               </div>
               <div className="mb-2">
                  <div className="font-semibold text-xl">
                     {detailOrder.itemPost.name}
                  </div>
                  <div className="">
                     {detailOrder.itemPost.description}
                  </div>
               </div>
               <div className="text-xl text-blue-main font-semibold">
                  {detailOrder.itemPost.unitPrice.toLocaleString(
                     "it-IT",
                     {
                        style: "currency",
                        currency: "VND",
                     }
                  )}
               </div>
               <div className="">Quantity: {detailOrder.quantity}</div>
               <div className="h-[1px] w-full bg-light-text my-2"></div>
               <div className="text-2xl text-blue-main font-bold">
                  {orderInfo.totalPrice.toLocaleString("it-IT", {
                     style: "currency",
                     currency: "VND",
                  })}
               </div>
            </div>
            <div className="col-span-6 h-fit">
               <div className="mb-4 text-xl font-semibold">
                  Delivery information
               </div>
               <div className="text-left">
                  <div className="">
                     Name: {orderInfo.deliveryInfo.customer.firstName}{" "}
                     {orderInfo.deliveryInfo.customer.lastName}
                  </div>
                  <div className="">
                     Email: {orderInfo.deliveryInfo.customer.email}
                  </div>
                  <div className="">
                     Address Type: {orderInfo.deliveryInfo.addressType}
                  </div>
                  <div className="">
                     Address: {orderInfo.deliveryInfo.fullAddress}
                  </div>
                  <div className="">
                     Phone: {orderInfo.deliveryInfo.deliveryPhone}
                  </div>
                  <div className="">
                     Description: {orderInfo.deliveryInfo.description}
                  </div>
               </div>
               <Link href={`/agencyinfo/${orderInfo.agency.id}`}>
                  <div className="flex items-center gap-2 cursor-pointer bg-light-spot p-2 rounded-lg mt-4">
                     <div className="relative overflow-hidden w-16 rounded-xl aspect-square">
                        <Image
                           src={orderInfo.agency.avatar}
                           alt="avatar"
                           layout="fill"
                        />
                     </div>
                     <div className="text-left">
                        <div className="font-semibold">
                           {orderInfo.agency.name}
                        </div>
                        <div className="text-sm">
                           {orderInfo.agency.address}
                        </div>
                     </div>
                  </div>
               </Link>
            </div>
         </div> */}
      </div>
   );
};

export default OrderView;
