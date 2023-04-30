import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import API, { endpoints } from "../../../API";

const OrderPickShift = ({
   IDOpenOrderPickShiftModel,
   setIDOpenOrderPickShiftModel,
}) => {
   const wrapperRef = useRef(null);
   const [listShift, setListShift] = useState<any>([]);
   const [IDShift, setIDShift] = useState(-1);

   const fetchListShift = async () => {
      try {
         const res = await API.get(endpoints["get_pick_shift_order"]);
         setListShift(res.data.data.listPickShift);
      } catch (error) {
         console.log(error);
      }
   };
   useEffect(() => {
      if (IDOpenOrderPickShiftModel > -1) {
         fetchListShift();
      }

      function handleClickOutside(event) {
         if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setIDOpenOrderPickShiftModel(-1);
         }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [IDOpenOrderPickShiftModel]);

   const handleSelectShift = async () => {
      if (IDShift > -1) {
         try {
            const res = await API.get(
               endpoints["set_pick_shift_order"](
                  IDOpenOrderPickShiftModel,
                  IDShift
               )
            );
            if (res.data.code == "200") {
               toast.success("selected pick up shift successful", {
                  position: "top-center",
               });
            }
            setIDOpenOrderPickShiftModel(-1);
         } catch (error) {}
      } else {
         toast.error("No selected pick up shift", { position: "top-center" });
      }
   };

   return (
      <div
         className="dark:bg-neutral-800 bg-light-primary rounded-lg p-8 w-full h-full shadow-lg"
         ref={wrapperRef}
      >
         <div className="font-semibold text-center text-2xl mb-3">
            Select shift to shipper pick up the order
         </div>
         {listShift.length > 0 ? (
            <>
               <div className="grid grid-cols-3 gap-2 font-semibold">
                  {listShift.map((shift) => (
                     <div key={shift.id}>
                        <div className="">
                           <input
                              className="hidden pick-shift-radio"
                              id={`shiftradio ${shift.id}`}
                              type="radio"
                              name="shiftradio"
                              checked={IDShift === shift.id}
                           />
                           <label
                              className="grid grid-rows-1 gap-2 p-4 border-[3px] border-gray-400 transition-all cursor-pointer rounded-lg"
                              htmlFor={`shiftradio ${shift.id}`}
                              onClick={(e) => setIDShift(shift.id)}
                           >
                              {shift.title}
                           </label>
                        </div>
                     </div>
                  ))}
               </div>
               <div className="flex justify-center mt-4">
                  <button
                     title="Save"
                     className="px-5 py-3 rounded-lg bg-primary-color text-white font-semibold
                hover:shadow-lg hover:shadow-primary-color"
                     onClick={handleSelectShift}
                  >
                     Save
                  </button>
               </div>
            </>
         ) : (
            <></>
         )}
         <div className=""></div>
      </div>
   );
};

export default OrderPickShift;
