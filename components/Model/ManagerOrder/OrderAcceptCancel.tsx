/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from "react";
import API, { endpoints } from "../../../API";
import toast from "react-hot-toast";

const OrderAcceptCancel = ({
   IDUserRequest,
   setIDUserRequest,
   setIDOpenAcceptCancelModel,
   IDOpenAcceptCancelModel,
}) => {
   const wrapperRef = useRef(null);

   useEffect(() => {
      function handleClickOutside(event) {
         if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setIDOpenAcceptCancelModel(-1);
            setIDUserRequest(-1);
         }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [wrapperRef]);

   const handleAcceptRequest = async () => {
      try {
         const res = await API.patch(
            endpoints["cancel_order"](IDOpenAcceptCancelModel)
         );
         if (res.data.code === "200") {
            toast.success("Cancel order successful!");
            const resNotify = await API.post(endpoints["send_notify"], {
               details: `Your request to cancel order has been accepted by merchant`,
               image: "https://res.cloudinary.com/ngnohieu/image/upload/v1682768680/istockphoto-690051340-612x612_bp1xyy.jpg",
               recipientID: `user-${IDUserRequest}`,
               title: "Your order has accepted to cancel by merchant",
               type: "Order Processing",
            });
         } else {
            toast.error(res.data.message);
         }
         setIDOpenAcceptCancelModel(-1);
         setIDUserRequest(-1);
      } catch (error) {
         console.log(error);
      }
   };
   const handleDenyRequest = async () => {
      try {
         const res = await API.patch(
            endpoints["change_state"](IDOpenAcceptCancelModel, 2)
         );
         if (res.data.code === "200") {
            toast.success(
               "Denied successful! This order is changed to accept state"
            );
            const resNotify = await API.post(endpoints["send_notify"], {
               details: `Your request to cancel order has been denied by merchant`,
               image: "https://res.cloudinary.com/ngnohieu/image/upload/v1682768635/access-denied_illustration_fkvevm.jpg",
               recipientID: `user-${IDUserRequest}`,
               title: "Your order has denied to cancel by merchant",
               type: "Order Processing",
            });
         } else {
            toast.error(res.data.message);
         }
         setIDOpenAcceptCancelModel(-1);
         setIDUserRequest(-1);
      } catch (error) {
         console.log(error);
      }
   };

   return (
      <div
         className="dark:bg-neutral-800 bg-light-primary rounded-lg w-full h-full relative p-8 shadow-lg"
         ref={wrapperRef}
      >
         <div className="font-semibold text-xl text-center mb-6">
            User want to cancel this order
         </div>
         <div className="">
            <div className="mb-6">
               <button
                  onClick={() => {
                     handleAcceptRequest();
                  }}
                  className="py-2 w-full bg-primary-color rounded-lg hover:shadow-lg hover:shadow-primary-color text-white font-semibold"
               >
                  <div>Accept</div>
                  <div className=" text-sm font-medium">
                     (This order will be cancel)
                  </div>
               </button>
            </div>
            <div>
               <button
                  onClick={() => handleDenyRequest()}
                  className="py-2 w-full bg-red-500 rounded-lg hover:shadow-lg hover:shadow-red-500 text-white font-semibold"
               >
                  <div>Deny</div>
                  <div className="text-sm font-medium">
                     (Will be change to accept state)
                  </div>
               </button>
            </div>
         </div>
      </div>
   );
};

export default OrderAcceptCancel;
