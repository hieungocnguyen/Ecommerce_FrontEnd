import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import API, { endpoints } from "../../../API";
import { ClipLoader } from "react-spinners";

const OrderReview = ({
   IDOpenOrderReviewModel,
   setIDOpenOrderReviewModel,
   orderInfo,
}) => {
   const wrapperRef = useRef(null);
   const [reviewInfor, setReviewInfo] = useState<any>({});

   const fetchReviewOrder = async () => {
      try {
         const res = await API.get(
            endpoints["get_review_info_order"](IDOpenOrderReviewModel)
         );
         setReviewInfo(res.data.data);
      } catch (error) {
         toast.error(error.response.data.message, { position: "top-center" });
         setIDOpenOrderReviewModel(-1);
      }
   };

   useEffect(() => {
      if (IDOpenOrderReviewModel > -1) {
         fetchReviewOrder();
      }

      function handleClickOutside(event) {
         if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setIDOpenOrderReviewModel(-1);
            setReviewInfo({});
         }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [IDOpenOrderReviewModel]);

   return (
      <div
         className="dark:bg-neutral-800 bg-light-primary rounded-lg p-8 w-full h-full shadow-lg"
         ref={wrapperRef}
      >
         <div className="font-semibold text-center text-2xl mb-3">
            Review Order
         </div>
         {reviewInfor.content ? (
            <>
               <div className="bg-dark-text dark:bg-dark-bg rounded-xl p-3 my-3">
                  <div className="font-semibold text-lg">Customer Info:</div>
                  <div className="mx-4 mt-1 mb-2">
                     <div className="grid-cols-3 grid">
                        <div className="font-semibold">Name of Recipient </div>
                        <div className="col-span-2">
                           {reviewInfor.customerName}
                        </div>
                     </div>
                     <div className="grid-cols-3 grid">
                        <div className="font-semibold">Phone number: </div>
                        <div className="col-span-2">
                           {reviewInfor.customerPhone}
                        </div>
                     </div>
                     <div className="grid-cols-3 grid">
                        <div className="font-semibold">Address: </div>
                        <div className="col-span-2">
                           {orderInfo.deliveryInfo.fullAddress}
                        </div>
                     </div>
                  </div>
               </div>
               <div className="bg-dark-text dark:bg-dark-bg rounded-xl p-3 my-3">
                  <div className="font-semibold text-lg">Order Info:</div>
                  <div className="mx-4  mt-1 mb-2">
                     <div className="grid-cols-3 grid">
                        <div className="font-semibold">Items: </div>
                        <div className="col-span-2">{reviewInfor.content}</div>
                     </div>
                     <div className="grid-cols-3 grid">
                        <div className="font-semibold">Amount COD: </div>
                        <div className="col-span-2">
                           {reviewInfor.amountCOD.toLocaleString("it-IT", {
                              style: "currency",
                              currency: "VND",
                           })}
                        </div>
                     </div>
                     <div className="grid-cols-3 grid">
                        <div className="font-semibold">Payment type: </div>
                        <div className="col-span-2">
                           {reviewInfor.paymentType}
                        </div>
                     </div>
                     <div className="grid-cols-3 grid">
                        <div className="font-semibold">Order date: </div>
                        <div className="col-span-2">
                           {reviewInfor.orderDate
                              ? `${"["}
                           ${new Date(reviewInfor.orderDate).getHours()}
                           ${":"}
                           ${new Date(reviewInfor.orderDate).getMinutes()}
                           ${"] | "}
                           ${new Date(reviewInfor.orderDate).toLocaleDateString(
                              "en-US"
                           )}`
                              : ""}
                        </div>
                     </div>
                     <div className="grid-cols-3 grid">
                        <div className="font-semibold">Order status: </div>
                        <div className="col-span-2 uppercase">
                           {reviewInfor.orderStatus}
                        </div>
                     </div>
                  </div>
               </div>
               <div className="bg-dark-text dark:bg-dark-bg rounded-xl p-3 my-3">
                  <div className="font-semibold text-lg">Delivery Info:</div>
                  <div className="mx-4 mt-1 mb-2">
                     <div className="mb-1">
                        <span className="font-semibold">Pick Up Shift: </span>
                        <span className="">
                           {reviewInfor.pickUpShift.from_time
                              ? `from ${"["}
                           ${new Date(
                              reviewInfor.pickUpShift.from_time
                           ).getHours()}
                           ${":"}
                           ${new Date(
                              reviewInfor.pickUpShift.from_time
                           ).getMinutes()}
                           ${"] "}to${" ["}
                           ${new Date(
                              reviewInfor.pickUpShift.to_time
                           ).getHours()}
                           ${":"}
                           ${new Date(
                              reviewInfor.pickUpShift.to_time
                           ).getMinutes()}
                           ${"] "} ${"  |  "}
                           ${new Date(
                              reviewInfor.pickUpShift.to_time
                           ).toLocaleDateString("en-GB")}`
                              : "This order not selected pickup shift"}
                        </span>
                     </div>
                     {/* <div className="mb-1">
                        <span className="font-semibold">
                           pickUpTimeOfShipper:{" "}
                        </span>
                        <span className="">
                           {reviewInfor.pickUpTimeOfShipper
                              ? `${"["}
                           ${new Date(
                              reviewInfor.pickUpTimeOfShipper
                           ).getHours()}
                           ${":"}
                           ${new Date(
                              reviewInfor.pickUpTimeOfShipper
                           ).getMinutes()}
                           ${"] | "}
                           ${new Date(
                              reviewInfor.pickUpTimeOfShipper
                           ).toLocaleDateString("en-US")}`
                              : "This order not selected pickup shift"}
                        </span>
                     </div> */}
                     <div className="mb-1">
                        <span className="font-semibold">
                           Expected Delivery Time:{" "}
                        </span>
                        <span className="">
                           {"["}
                           {new Date(
                              reviewInfor.expectedDeliveryTime
                           ).getHours()}
                           {":"}
                           {new Date(
                              reviewInfor.expectedDeliveryTime
                           ).getMinutes()}
                           {"] | "}
                           {new Date(
                              reviewInfor.expectedDeliveryTime
                           ).toLocaleDateString("en-GB")}
                        </span>
                     </div>
                     <div className="">
                        <span className="font-semibold">Note: </span>
                        <span className="">{reviewInfor.note}</span>
                     </div>
                  </div>
               </div>
            </>
         ) : (
            <>
               <div className="flex justify-center my-8">
                  <ClipLoader size={35} color="#FF8500" />
               </div>
            </>
         )}
      </div>
   );
};

export default OrderReview;
