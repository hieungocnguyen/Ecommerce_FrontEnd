/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from "react";
import API, { endpoints } from "../../../API";
import toast from "react-hot-toast";

const OrderAcceptCancel = ({
   setIDOpenAcceptCancelModel,
   IDOpenAcceptCancelModel,
}) => {
   const wrapperRef = useRef(null);

   useEffect(() => {
      function handleClickOutside(event) {
         if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setIDOpenAcceptCancelModel(-1);
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
         } else {
            toast.error(res.data.message);
         }
         setIDOpenAcceptCancelModel(-1);
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
         } else {
            toast.error(res.data.message);
         }
         setIDOpenAcceptCancelModel(-1);
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
                  className="py-2 w-full bg-blue-main rounded-lg hover:shadow-lg hover:shadow-blue-main text-white font-semibold"
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
