import { useEffect, useRef } from "react";
import { BiCurrentLocation, BiPen } from "react-icons/bi";
import useTrans from "../../hook/useTrans";

const WayToSelectAddress = ({
   setIsOpenModelWaySelectAddress,
   setIsOpenAddressSelect,
   setIsOpenModelGeoLocation,
}) => {
   const wrapperRef = useRef(null);
   const trans = useTrans();

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
            {trans.profile.edit_profile.address_model.what_method}
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
               <div>
                  {trans.profile.edit_profile.address_model.select_manual}
               </div>
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
               <div>{trans.profile.edit_profile.address_model.auto_by_GPS}</div>
            </div>
         </div>
      </div>
   );
};

export default WayToSelectAddress;
