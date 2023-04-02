import React, { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import API, { endpoints } from "../../../API";
import { Store } from "../../../utils/Store";

const OrderState = ({
   setIDOpenModelChangeState,
   IDOpenModelChangeState,
   stateCurrentID,
   setStateCurrentID,
}) => {
   const wrapperRef = useRef(null);

   useEffect(() => {
      function handleClickOutside(event) {
         if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setIDOpenModelChangeState(-1);
            setStateCurrentID(-1);
         }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [wrapperRef]);

   const handleSubmitState = async () => {
      try {
         const res = await API.patch(
            endpoints["change_state"](IDOpenModelChangeState, stateCurrentID)
         );
         if (res.data.code == "200") {
            setIDOpenModelChangeState(-1);
            setStateCurrentID(-1);
            toast.success("Change state successful", {
               position: "top-center",
            });
         }
      } catch (error) {
         toast.error("something wrong, try again!", {
            position: "top-center",
         });
         console.log(error);
      }
   };

   return (
      <div
         className="dark:bg-neutral-800 bg-light-primary rounded-lg p-8 w-full h-full shadow-lg"
         ref={wrapperRef}
      >
         <div className="flex justify-between items-center mb-4">
            <div className="font-semibold text-center text-2xl">
               Change state of order
            </div>
            <div className="">
               <button
                  title="close"
                  className="px-5 py-3 rounded-lg bg-blue-main text-white font-semibold
                hover:shadow-lg hover:shadow-blue-main"
                  onClick={() => {
                     setIDOpenModelChangeState(-1);
                     setStateCurrentID(-1);
                  }}
               >
                  Close
               </button>
            </div>
         </div>
         <div className="gap-4 grid grid-cols-5 font-medium">
            <div>
               <input
                  className="hidden orderstate"
                  id="radio1"
                  type="radio"
                  name="orderRadio"
                  checked={stateCurrentID === 1}
                  disabled={stateCurrentID === 4 ? true : false}
               />
               <label
                  className="grid grid-rows-2 gap-2 p-4 border-[3px] border-gray-400 transition-all cursor-pointer rounded-lg w-full h-32"
                  htmlFor="radio1"
                  onClick={(e) => {
                     if (stateCurrentID >= 4) {
                        toast.error(
                           "Can't change status while order is being shipped",
                           {
                              position: "top-center",
                           }
                        );
                     } else {
                        setStateCurrentID(1);
                     }
                  }}
               >
                  <div className="w-10 row-span-1">
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 184.39 174.61"
                     >
                        <path
                           d="M125.57,138.82a6.12,6.12,0,0,1-4.67-2.16L82.48,91.26a6.17,6.17,0,0,1-1.45-4V44.53a6.14,6.14,0,1,1,12.27,0V85.08l37,43.67a6.11,6.11,0,0,1-4.67,10.07Z"
                           fill="#525EC1"
                        />
                        <path
                           d="M87.31,174.61A87.3,87.3,0,1,1,174,77.35l.31,2.66h7.49a2.27,2.27,0,0,1,2.35,1.27c.6,1.43-.29,3.75-1.16,4.72l-.09.1-12.72,16.83a3,3,0,0,1-4.25,0L153.25,86.1,153.2,86a5.18,5.18,0,0,1-.4-4.42A2.54,2.54,0,0,1,155.28,80h7.42l-.48-3.42c-5.28-37.67-36.8-65-74.95-65a75.69,75.69,0,0,0,0,151.38h0Z"
                           fill="#525EC1"
                           fill-rule="evenodd"
                        />
                     </svg>
                  </div>
                  <div className="row-span-1">Wait for confirmation</div>
               </label>
            </div>
            <div>
               <input
                  className="hidden orderstate"
                  id="radio2"
                  type="radio"
                  name="orderRadio"
                  checked={stateCurrentID === 2}
                  disabled={stateCurrentID === 4 ? true : false}
               />
               <label
                  className="grid grid-rows-2 gap-2 w-full p-4 border-[3px] border-gray-400 transition-all cursor-pointer rounded-lg h-32"
                  htmlFor="radio2"
                  onClick={(e) => {
                     if (stateCurrentID >= 4) {
                        toast.error(
                           "Can't change status while order is being shipped",
                           {
                              position: "top-center",
                           }
                        );
                     } else {
                        setStateCurrentID(2);
                     }
                  }}
               >
                  <div className="w-8 row-span-1">
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 141.23 196.59"
                     >
                        <path
                           d="M92.8,74.47c11.24-6.73,18.68-18.41,18.68-31.71C111.48,21.91,93.18,5,70.61,5S29.74,21.91,29.74,42.76c0,13.3,7.44,25,18.68,31.71C23.11,84.85,5,112.48,5,144.94a84.85,84.85,0,0,0,1.23,14.47c15.54,19.71,38.63,32.18,64.38,32.18s48.84-12.47,64.39-32.18a84.85,84.85,0,0,0,1.23-14.47C136.23,112.48,118.12,84.85,92.8,74.47Z"
                           fill="none"
                           stroke="#525ec1"
                           stroke-linecap="round"
                           stroke-linejoin="round"
                           stroke-width="10"
                        />
                        <polyline
                           points="37.76 132.07 63.64 158.62 103.47 113.7"
                           fill="none"
                           stroke="#525ec1"
                           stroke-linecap="round"
                           stroke-linejoin="round"
                           stroke-width="10"
                        />
                     </svg>
                  </div>
                  <div className="row-span-1">Accepted</div>
               </label>
            </div>
            <div>
               <input
                  className="hidden orderstate"
                  id="radio3"
                  type="radio"
                  name="orderRadio"
                  checked={stateCurrentID === 3}
                  disabled={stateCurrentID === 4 ? true : false}
               />
               <label
                  className="grid grid-rows-2 gap-2 w-full p-4 border-[3px] border-gray-400 transition-all cursor-pointer rounded-lg h-32 "
                  htmlFor="radio3"
                  onClick={(e) => {
                     if (stateCurrentID >= 4) {
                        toast.error(
                           "Can't change status while order is being shipped",
                           {
                              position: "top-center",
                           }
                        );
                     } else {
                        setStateCurrentID(3);
                     }
                  }}
               >
                  <div className="w-10 row-span-1">
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 168.58 178.5"
                     >
                        <polyline
                           points="4.96 39.67 4.96 138.83 84.29 173.54 163.63 138.83 163.63 39.67"
                           fill="none"
                           stroke="#525ec1"
                           stroke-linecap="round"
                           stroke-linejoin="round"
                           stroke-width="9.92"
                        />
                        <polyline
                           points="4.96 39.67 84.29 74.38 163.63 39.67"
                           fill="none"
                           stroke="#525ec1"
                           stroke-linecap="round"
                           stroke-linejoin="round"
                           stroke-width="9.92"
                        />
                        <polyline
                           points="44.63 22.31 123.96 57.33 123.96 89.25"
                           fill="none"
                           stroke="#525ec1"
                           stroke-linecap="round"
                           stroke-linejoin="round"
                           stroke-width="9.92"
                        />
                        <polyline
                           points="4.96 39.67 84.29 4.96 163.63 39.67"
                           fill="none"
                           stroke="#525ec1"
                           stroke-linecap="round"
                           stroke-linejoin="round"
                           stroke-width="9.92"
                        />
                        <line
                           x1="84.29"
                           y1="74.38"
                           x2="84.29"
                           y2="173.54"
                           fill="none"
                           stroke="#525ec1"
                           stroke-linecap="round"
                           stroke-linejoin="round"
                           stroke-width="9.92"
                        />
                     </svg>
                  </div>
                  <div className="row-span-1">Packed</div>
               </label>
            </div>
            <div>
               <input
                  className="hidden orderstate"
                  id="radio4"
                  type="radio"
                  name="orderRadio"
                  checked={stateCurrentID === 4}
               />
               <label
                  className="grid grid-rows-2 gap-2 w-full p-4 border-[3px] border-gray-400 transition-all cursor-pointer rounded-lg h-32"
                  htmlFor="radio4"
                  onClick={(e) => setStateCurrentID(4)}
               >
                  <div className="w-12 row-span-1">
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 196.9 131.06"
                     >
                        <line
                           x1="51.03"
                           y1="107.24"
                           x2="27.8"
                           y2="107.24"
                           fill="none"
                           stroke="#525ec1"
                           stroke-linecap="round"
                           stroke-linejoin="round"
                           stroke-width="11.14"
                        />
                        <polyline
                           points="24.96 5.57 129.71 5.57 129.71 52.73 177.34 52.73 191.33 69.56 191.33 107.24 168.79 107.24"
                           fill="none"
                           stroke="#525ec1"
                           stroke-linecap="round"
                           stroke-linejoin="round"
                           stroke-width="11.14"
                        />
                        <line
                           x1="132.29"
                           y1="107.24"
                           x2="87.52"
                           y2="107.24"
                           fill="none"
                           stroke="#525ec1"
                           stroke-linecap="round"
                           stroke-linejoin="round"
                           stroke-width="11.14"
                        />
                        <line
                           x1="16.71"
                           y1="27.89"
                           x2="76.67"
                           y2="27.89"
                           fill="none"
                           stroke="#525ec1"
                           stroke-linecap="round"
                           stroke-linejoin="round"
                           stroke-width="11.14"
                        />
                        <line
                           x1="5.57"
                           y1="51.71"
                           x2="67.19"
                           y2="51.71"
                           fill="none"
                           stroke="#525ec1"
                           stroke-linecap="round"
                           stroke-linejoin="round"
                           stroke-width="11.14"
                        />
                        <line
                           x1="16.71"
                           y1="75.53"
                           x2="54.39"
                           y2="75.53"
                           fill="none"
                           stroke="#525ec1"
                           stroke-linecap="round"
                           stroke-linejoin="round"
                           stroke-width="11.14"
                        />
                        <polyline
                           points="129.71 17.42 161.47 17.42 177.34 52.73"
                           fill="none"
                           stroke="#525ec1"
                           stroke-linecap="round"
                           stroke-linejoin="round"
                           stroke-width="11.14"
                        />
                        <circle
                           cx="69.28"
                           cy="107.24"
                           r="18.25"
                           fill="none"
                           stroke="#525ec1"
                           stroke-linecap="round"
                           stroke-linejoin="round"
                           stroke-width="11.14"
                        />
                        <circle
                           cx="150.54"
                           cy="107.24"
                           r="18.25"
                           fill="none"
                           stroke="#525ec1"
                           stroke-linecap="round"
                           stroke-linejoin="round"
                           stroke-width="11.14"
                        />
                     </svg>
                  </div>
                  <div className="row-span-1">Shipped</div>
               </label>
            </div>
            <div>
               <input
                  className="hidden orderstate"
                  id="radio5"
                  type="radio"
                  name="orderRadio"
                  checked={stateCurrentID === 5}
               />
               <label
                  className="grid grid-rows-2 gap-2 w-full p-4 border-[3px] border-gray-400 transition-all cursor-pointer rounded-lg h-32"
                  htmlFor="radio5"
                  onClick={(e) => setStateCurrentID(5)}
               >
                  <div className="w-10 row-span-1">
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 180.7 180.7"
                     >
                        <path
                           d="M166.51,56.44A83.35,83.35,0,1,1,136,20.62"
                           fill="none"
                           stroke="#525ec1"
                           stroke-linecap="round"
                           stroke-linejoin="round"
                           stroke-width="14"
                        />
                        <polyline
                           points="52.32 55.47 89.36 107.64 173.7 16.75"
                           fill="none"
                           stroke="#525ec1"
                           stroke-linecap="round"
                           stroke-linejoin="round"
                           stroke-width="14"
                        />
                     </svg>
                  </div>
                  <div className="row-span-1">Completed</div>
               </label>
            </div>
         </div>
         <div className="flex justify-center mt-4">
            <button
               title="Save"
               className="px-5 py-3 rounded-lg bg-blue-main text-white font-semibold
                hover:shadow-lg hover:shadow-blue-main"
               onClick={handleSubmitState}
            >
               Save order state
            </button>
         </div>
      </div>
   );
};

export default OrderState;
