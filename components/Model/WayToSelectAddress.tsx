import { useEffect, useRef } from "react";
import { BiCurrentLocation, BiPen } from "react-icons/bi";

const WayToSelectAddress = ({
   setIsOpenModelWaySelectAddress,
   setIsOpenAddressSelect,
   setIsOpenModelGeoLocation,
}) => {
   const wrapperRef = useRef(null);

   useEffect(() => {
      function handleClickOutside(event) {
         if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setIsOpenModelWaySelectAddress(false);
         }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [wrapperRef]);

   return (
      <div
         className="dark:bg-neutral-800 bg-light-primary rounded-lg p-8"
         ref={wrapperRef}
      >
         <div className="text-xl font-semibold mb-4">
            What method do you use to select the address?
         </div>
         <div className="flex justify-center gap-8">
            <div
               className="px-4 py-3 rounded-xl bg-primary-color text-white font-semibold cursor-pointer flex items-center gap-1"
               onClick={() => {
                  setIsOpenAddressSelect(true);
                  setIsOpenModelWaySelectAddress(false);
               }}
            >
               <div>
                  <BiPen className="text-2xl" />
               </div>
               <div>Select address manual</div>
            </div>
            <div
               className="px-4 py-3 rounded-xl bg-primary-color text-white font-semibold cursor-pointer flex items-center gap-1"
               onClick={() => {
                  setIsOpenModelGeoLocation(true);
                  setIsOpenModelWaySelectAddress(false);
               }}
            >
               <div>
                  <BiCurrentLocation className="text-2xl" />
               </div>
               <div>Use GPS to get current location</div>
            </div>
         </div>
      </div>
   );
};

export default WayToSelectAddress;
