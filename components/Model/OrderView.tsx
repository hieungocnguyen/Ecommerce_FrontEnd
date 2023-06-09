import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import API, { endpoints } from "../../API";
import { ClipLoader } from "react-spinners";
import useTrans from "../../hook/useTrans";

const OrderView = ({
   orderInfo,
   setOrderInfo,
   orderAgencyID,
   setOrderAgencyID,
}) => {
   const wrapperRef = useRef(null);
   const [detailOrders, setDetailOrders] = useState<any>();
   const trans = useTrans();

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
         className="dark:bg-neutral-800 bg-light-primary rounded-lg p-8 w-full h-full relative shadow-lg"
         ref={wrapperRef}
      >
         {detailOrders ? (
            <>
               <div className="text-center font-bold text-xl mb-2">
                  {trans.order.detail_order.title}
               </div>
               <div className="grid grid-cols-2 gap-6 mb-2">
                  <div className="text-left">
                     <div className="text-lg text-center font-semibold mb-2">
                        {trans.order.detail_order.from_merchant}
                     </div>
                     <div className="p-4 rounded-xl bg-dark-text dark:bg-dark-spot">
                        <div>
                           <span className="font-semibold">
                              {trans.order.detail_order.merchant}:
                           </span>{" "}
                           {orderInfo.agency.name}
                        </div>
                        <div>
                           <span className="font-semibold">
                              {trans.order.detail_order.field}:
                           </span>{" "}
                           {orderInfo.agency.field.name}
                        </div>
                        <div>
                           <span className="font-semibold">
                              {trans.order.detail_order.hotline}:
                           </span>{" "}
                           {orderInfo.agency.hotline}
                        </div>
                        <div>
                           <span className="font-semibold">
                              {trans.order.detail_order.address}:
                           </span>{" "}
                           {orderInfo.agency.fromAddress}
                        </div>
                     </div>
                  </div>
                  <div className="text-left">
                     <div className="text-lg text-center font-semibold mb-2">
                        {trans.order.detail_order.to_customer}
                     </div>
                     <div className="p-4 rounded-xl bg-dark-text dark:bg-dark-spot">
                        <div>
                           <span className="font-semibold">
                              {trans.order.detail_order.customer_name}
                           </span>{" "}
                           {orderInfo.deliveryInfo.customerName}
                        </div>
                        <div>
                           <span className="font-semibold">
                              {trans.order.detail_order.phone}:
                           </span>{" "}
                           {orderInfo.deliveryInfo.deliveryPhone}
                        </div>
                        <div>
                           <span className="font-semibold">
                              {trans.order.detail_order.type_address}:
                           </span>{" "}
                           {orderInfo.deliveryInfo.addressType}
                        </div>
                        <div>
                           <span className="font-semibold">
                              {trans.order.detail_order.address}:
                           </span>{" "}
                           {orderInfo.deliveryInfo.fullAddress}
                        </div>
                     </div>
                  </div>
               </div>
               <div className="">
                  <div className="text-lg font-semibold text-center">
                     {trans.order.detail_order.items_in_order}
                  </div>
                  <div
                     className={`overflow-auto ${
                        detailOrders.length > 2 ? "h-52" : "h-fit"
                     } `}
                  >
                     {detailOrders.map((order) => (
                        <div
                           key={order.id}
                           className="grid grid-cols-12 items-center gap-2 my-3 text-left p-3 bg-dark-text dark:bg-dark-spot rounded-lg"
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
                              {order.itemPost.name} -{" "}
                              {order.itemPost.description}
                           </div>
                           <div className="col-span-3">
                              {order.itemPost.unitPrice.toLocaleString(
                                 "it-IT",
                                 {
                                    style: "currency",
                                    currency: "VND",
                                 }
                              )}
                           </div>
                           <div className="col-span-1">x{order.quantity}</div>
                           <div className="col-span-3 text-primary-color font-semibold text-lg">
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
               </div>
               <div className="bg-dark-text dark:bg-dark-spot rounded-xl p-4 grid grid-cols-2 mt-3 px-8">
                  <div className=" text-left">
                     <div>
                        {orderInfo.expectedDeliveryTime ? (
                           <>
                              <div className="">
                                 <span className="font-semibold">
                                    {trans.order.detail_order.delivery_expeted}:
                                 </span>{" "}
                                 {new Date(
                                    orderInfo.expectedDeliveryTime
                                 ).toLocaleDateString("en-GB")}
                              </div>
                           </>
                        ) : (
                           <></>
                        )}
                     </div>
                     <div className="">
                        <span className="font-semibold">
                           {trans.order.detail_order.payment_type}:{" "}
                        </span>
                        {orderInfo.orders.paymentType.name}
                     </div>
                  </div>
                  <div className="">
                     <div className="text-right">
                        <div className=" text-lg font-semibold">
                           {(
                              orderInfo.totalPrice +
                              orderInfo.reductionAmountVoucher
                           ).toLocaleString("it-IT", {
                              style: "currency",
                              currency: "VND",
                           })}
                        </div>
                        {orderInfo.shipFee ? (
                           <>
                              <div className="text-secondary-color font-semibold">
                                 {trans.order.detail_order.ship_fee}
                                 {": "}
                                 {orderInfo.shipFee.toLocaleString("it-IT", {
                                    style: "currency",
                                    currency: "VND",
                                 })}
                              </div>
                           </>
                        ) : (
                           <></>
                        )}
                        {orderInfo.reductionAmountVoucher > 0 && (
                           <div className="text-green-500 font-semibold">
                              Discount:{" -"}
                              {orderInfo.reductionAmountVoucher.toLocaleString(
                                 "it-IT",
                                 {
                                    style: "currency",
                                    currency: "VND",
                                 }
                              )}
                           </div>
                        )}

                        <div className="font-semibold text-xl text-primary-color">
                           {"= "}
                           {(
                              orderInfo.totalPrice + orderInfo.shipFee
                           ).toLocaleString("it-IT", {
                              style: "currency",
                              currency: "VND",
                           })}
                        </div>
                     </div>
                  </div>
               </div>
            </>
         ) : (
            <div>
               <div className="flex justify-center my-8">
                  <ClipLoader size={35} color="#FF8500" />
               </div>
            </div>
         )}
      </div>
   );
};

export default OrderView;
