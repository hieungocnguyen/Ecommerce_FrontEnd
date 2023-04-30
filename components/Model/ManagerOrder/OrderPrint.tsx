import { useState } from "react";
import toast from "react-hot-toast";
import API, { endpoints } from "../../../API";

const OrderPrint = ({ setIDOpenOrderPrintModel, IDOpenOrderPrintModel }) => {
   const [sizeSelected, setSizeSelected] = useState(0);

   const printOrder = async () => {
      if (IDOpenOrderPrintModel > -1 && sizeSelected > 0) {
         try {
            const res = await API.get(
               `${endpoints["get_print_order"](
                  IDOpenOrderPrintModel
               )}?printSize=${sizeSelected}`
            );
            if (res.data.data.urlPrintOrder) {
               window.open(res.data.data.urlPrintOrder, "_blank").focus();
            }
            setIDOpenOrderPrintModel(-1);
         } catch (error) {
            toast.error(`${error.response.data.message}`, {
               position: "top-center",
            });
            setIDOpenOrderPrintModel(-1);
         }
      } else if (sizeSelected == 0) {
         toast.error("Please choose a size to print", {
            position: "top-center",
         });
      }
   };

   return (
      <div className="dark:bg-neutral-800 bg-light-primary rounded-lg p-8 w-full h-full shadow-lg">
         <div className="flex justify-between mb-4">
            <div className="font-semibold text-center items-center text-2xl">
               Print order
            </div>
            <button
               title="cancel"
               className="px-5 py-2 text-lg font-semibold rounded-lg bg-red-500 text-white hover:shadow-lg hover:shadow-red-500"
               onClick={() => setIDOpenOrderPrintModel(-1)}
            >
               Close
            </button>
         </div>

         <div className="grid grid-cols-3 gap-8">
            <div className="">
               <input
                  className="hidden orderstate"
                  id="print-size-1"
                  type="radio"
                  name="shiftradio"
               />
               <label
                  className="grid grid-rows-1 gap-1 p-4 border-[3px] border-gray-400 transition-all cursor-pointer rounded-lg"
                  htmlFor="print-size-1"
                  onClick={(e) => setSizeSelected(1)}
               >
                  <div className="w-10 mx-auto">
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 430.19 592.86"
                     >
                        <path
                           d="M26.31,592.86H323.87a11,11,0,0,0,7.67-3.18L427,494.22a0,0,0,0,1,0,0,10.65,10.65,0,0,0,2.09-3.1c.15-.33.24-.67.36-1a10.39,10.39,0,0,0,.58-2.86c0-.24.14-.44.14-.67V26.32A26.35,26.35,0,0,0,403.87,0H26.31A26.34,26.34,0,0,0,0,26.32V566.54A26.34,26.34,0,0,0,26.31,592.86Zm308.41-37v-53a5.42,5.42,0,0,1,5.42-5.42h53ZM21.69,26.32a4.64,4.64,0,0,1,4.62-4.63H403.87a4.64,4.64,0,0,1,4.63,4.63V475.7H340.14A27.14,27.14,0,0,0,313,502.81v68.36H26.31a4.64,4.64,0,0,1-4.62-4.63Z"
                           fill="#525ec1"
                        />
                        <path
                           d="M113.41,123h71.75a10.85,10.85,0,0,0,0-21.69H113.41a10.85,10.85,0,0,0,0,21.69Z"
                           fill="#525ec1"
                        />
                        <path
                           d="M113.41,491.58h71.75a10.85,10.85,0,0,0,0-21.69H113.41a10.85,10.85,0,0,0,0,21.69Z"
                           fill="#525ec1"
                        />
                        <path
                           d="M113.41,223H316.78a10.85,10.85,0,0,0,0-21.69H113.41a10.85,10.85,0,0,0,0,21.69Z"
                           fill="#525ec1"
                        />
                        <path
                           d="M113.41,272.5H316.78a10.85,10.85,0,0,0,0-21.69H113.41a10.85,10.85,0,0,0,0,21.69Z"
                           fill="#525ec1"
                        />
                        <path
                           d="M113.41,322H316.78a10.85,10.85,0,0,0,0-21.69H113.41a10.85,10.85,0,0,0,0,21.69Z"
                           fill="#525ec1"
                        />
                        <path
                           d="M113.41,371.51H316.78a10.85,10.85,0,0,0,0-21.69H113.41a10.85,10.85,0,0,0,0,21.69Z"
                           fill="#525ec1"
                        />
                     </svg>
                  </div>
                  <div className="font-bold text-lg text-center">A5</div>
                  <div className="text-center font-medium text-sm">
                     For large box
                  </div>
               </label>
            </div>

            <div className="">
               <input
                  className="hidden orderstate"
                  id="print-size-2"
                  type="radio"
                  name="shiftradio"
                  // checked=
               />
               <label
                  className="grid grid-rows-1 gap-1 p-4 border-[3px] border-gray-400 transition-all cursor-pointer rounded-lg"
                  htmlFor="print-size-2"
                  onClick={(e) => setSizeSelected(3)}
               >
                  <div className="w-10 mx-auto">
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 430.19 592.86"
                     >
                        <path
                           d="M26.31,592.86H323.87a11,11,0,0,0,7.67-3.18L427,494.22a0,0,0,0,1,0,0,10.65,10.65,0,0,0,2.09-3.1c.15-.33.24-.67.36-1a10.39,10.39,0,0,0,.58-2.86c0-.24.14-.44.14-.67V26.32A26.35,26.35,0,0,0,403.87,0H26.31A26.34,26.34,0,0,0,0,26.32V566.54A26.34,26.34,0,0,0,26.31,592.86Zm308.41-37v-53a5.42,5.42,0,0,1,5.42-5.42h53ZM21.69,26.32a4.64,4.64,0,0,1,4.62-4.63H403.87a4.64,4.64,0,0,1,4.63,4.63V475.7H340.14A27.14,27.14,0,0,0,313,502.81v68.36H26.31a4.64,4.64,0,0,1-4.62-4.63Z"
                           fill="#525ec1"
                        />
                        <path
                           d="M113.41,123h71.75a10.85,10.85,0,0,0,0-21.69H113.41a10.85,10.85,0,0,0,0,21.69Z"
                           fill="#525ec1"
                        />
                        <path
                           d="M113.41,491.58h71.75a10.85,10.85,0,0,0,0-21.69H113.41a10.85,10.85,0,0,0,0,21.69Z"
                           fill="#525ec1"
                        />
                        <path
                           d="M113.41,223H316.78a10.85,10.85,0,0,0,0-21.69H113.41a10.85,10.85,0,0,0,0,21.69Z"
                           fill="#525ec1"
                        />
                        <path
                           d="M113.41,272.5H316.78a10.85,10.85,0,0,0,0-21.69H113.41a10.85,10.85,0,0,0,0,21.69Z"
                           fill="#525ec1"
                        />
                        <path
                           d="M113.41,322H316.78a10.85,10.85,0,0,0,0-21.69H113.41a10.85,10.85,0,0,0,0,21.69Z"
                           fill="#525ec1"
                        />
                        <path
                           d="M113.41,371.51H316.78a10.85,10.85,0,0,0,0-21.69H113.41a10.85,10.85,0,0,0,0,21.69Z"
                           fill="#525ec1"
                        />
                     </svg>
                  </div>
                  <div className="font-bold text-lg text-center">80x80(mm)</div>
                  <div className="text-center font-medium text-sm">
                     For medium box
                  </div>
               </label>
            </div>

            <div className="">
               <input
                  className="hidden orderstate"
                  id="print-size-3"
                  type="radio"
                  name="shiftradio"
                  // checked=
               />
               <label
                  className="grid grid-rows-1 gap-1 p-4 border-[3px] border-gray-400 transition-all cursor-pointer rounded-lg"
                  htmlFor="print-size-3"
                  onClick={(e) => setSizeSelected(2)}
               >
                  <div className="w-10 mx-auto">
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 430.19 592.86"
                     >
                        <path
                           d="M26.31,592.86H323.87a11,11,0,0,0,7.67-3.18L427,494.22a0,0,0,0,1,0,0,10.65,10.65,0,0,0,2.09-3.1c.15-.33.24-.67.36-1a10.39,10.39,0,0,0,.58-2.86c0-.24.14-.44.14-.67V26.32A26.35,26.35,0,0,0,403.87,0H26.31A26.34,26.34,0,0,0,0,26.32V566.54A26.34,26.34,0,0,0,26.31,592.86Zm308.41-37v-53a5.42,5.42,0,0,1,5.42-5.42h53ZM21.69,26.32a4.64,4.64,0,0,1,4.62-4.63H403.87a4.64,4.64,0,0,1,4.63,4.63V475.7H340.14A27.14,27.14,0,0,0,313,502.81v68.36H26.31a4.64,4.64,0,0,1-4.62-4.63Z"
                           fill="#525ec1"
                        />
                        <path
                           d="M113.41,123h71.75a10.85,10.85,0,0,0,0-21.69H113.41a10.85,10.85,0,0,0,0,21.69Z"
                           fill="#525ec1"
                        />
                        <path
                           d="M113.41,491.58h71.75a10.85,10.85,0,0,0,0-21.69H113.41a10.85,10.85,0,0,0,0,21.69Z"
                           fill="#525ec1"
                        />
                        <path
                           d="M113.41,223H316.78a10.85,10.85,0,0,0,0-21.69H113.41a10.85,10.85,0,0,0,0,21.69Z"
                           fill="#525ec1"
                        />
                        <path
                           d="M113.41,272.5H316.78a10.85,10.85,0,0,0,0-21.69H113.41a10.85,10.85,0,0,0,0,21.69Z"
                           fill="#525ec1"
                        />
                        <path
                           d="M113.41,322H316.78a10.85,10.85,0,0,0,0-21.69H113.41a10.85,10.85,0,0,0,0,21.69Z"
                           fill="#525ec1"
                        />
                        <path
                           d="M113.41,371.51H316.78a10.85,10.85,0,0,0,0-21.69H113.41a10.85,10.85,0,0,0,0,21.69Z"
                           fill="#525ec1"
                        />
                     </svg>
                  </div>
                  <div className="font-bold text-lg text-center">52x70(mm)</div>
                  <div className="text-center font-medium text-sm">
                     For small box
                  </div>
               </label>
            </div>
         </div>
         <div className="mt-4 text-center">
            <button
               title="yes"
               className="px-5 py-3 text-lg font-semibold rounded-lg bg-primary-color text-white shadow-lg shadow-primary-color disabled:bg-gray-400 disabled:shadow-none transition-all"
               onClick={printOrder}
               disabled={sizeSelected == 0 ? true : false}
            >
               Print order
            </button>
         </div>
      </div>
   );
};

export default OrderPrint;
