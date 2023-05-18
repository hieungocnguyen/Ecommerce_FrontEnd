import { useEffect, useRef, useState } from "react";
import { useGeolocated } from "react-geolocated";
import API, { endpoints } from "../../API";
import { ClipLoader } from "react-spinners";
import { BiCaretLeft, BiRotateLeft } from "react-icons/bi";
import { toast } from "react-hot-toast";
import useTrans from "../../hook/useTrans";

const GeoLocationAddress = ({
   setIsOpenModelGeoLocation,
   setAddress,
   setIsOpenAddressSelect,
}) => {
   const wrapperRef = useRef(null);
   const { coords, isGeolocationAvailable, isGeolocationEnabled, getPosition } =
      useGeolocated({
         positionOptions: {
            enableHighAccuracy: false,
         },
         userDecisionTimeout: 9000,
         isOptimisticGeolocationEnabled: true,
         watchPosition: false,
      });
   const [location, setLocation] = useState<string>("");
   const [street, setStreet] = useState<string>("");
   const trans = useTrans();

   useEffect(() => {
      function handleClickOutside(event) {
         if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setIsOpenModelGeoLocation(false);
         }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [wrapperRef]);

   const fetchLocation = async () => {
      try {
         const res = await API.get(
            endpoints["get_nearest_location"](coords.latitude, coords.longitude)
         );
         setLocation(res.data.data);
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      if (coords) {
         fetchLocation();
      }
   }, [coords]);

   return (
      <div
         className="dark:bg-neutral-800 bg-light-primary rounded-lg p-8"
         ref={wrapperRef}
      >
         <div className="flex justify-between items-center mb-6">
            <div className="text-xl font-semibold">
               {trans.profile.edit_profile.address_model.select_auto}
            </div>
            <div
               className="flex gap-1 cursor-pointer"
               onClick={() => {
                  setIsOpenModelGeoLocation(false);
                  setIsOpenAddressSelect(true);
               }}
            >
               <div>
                  <BiCaretLeft className="text-xl text-primary-color" />
               </div>
               <div className="font-medium">
                  {trans.profile.edit_profile.address_model.switch_manual}
               </div>
            </div>
         </div>
         <div>
            {!isGeolocationAvailable ? (
               <div>{trans.profile.edit_profile.address_model.not_support}</div>
            ) : isGeolocationEnabled ? (
               coords ? (
                  <div className="">
                     <div className="text-left mb-1">
                        <div className="font-semibold text-sm pl-1">
                           {trans.profile.edit_profile.address_model.current}
                        </div>
                        <div className="bg-light-bg dark:bg-dark-bg p-4 rounded-lg w-full font-medium">
                           {location}
                        </div>
                     </div>
                     <div className="text-left mb-3">
                        <div>
                           <label
                              htmlFor="street"
                              className="font-semibold text-sm pl-1"
                           >
                              {trans.profile.edit_profile.address_model.street}
                           </label>
                           <input
                              id="street"
                              name="street"
                              required
                              type="text"
                              placeholder={
                                 trans.profile.edit_profile.address_model.street
                              }
                              className="bg-light-bg dark:bg-dark-bg p-4 rounded-lg w-full font-medium focus:outline-primary-color disabled:bg-light-bg disabled:cursor-not-allowed"
                              onChange={(e) => setStreet(e.target.value)}
                           />
                        </div>
                     </div>
                     <div className="w-full flex justify-center">
                        <button
                           className="px-4 py-3 bg-primary-color rounded-lg text-white font-semibold hover:shadow-lg transition-all hover:shadow-primary-color"
                           onClick={() => {
                              setAddress(`${street}, ${location} `);
                              setIsOpenModelGeoLocation(false);
                           }}
                        >
                           {trans.profile.edit_profile.address_model.submit}
                        </button>
                     </div>

                     <div className="text-secondary-color text-sm font-medium mt-4">
                        {trans.profile.edit_profile.address_model.if}
                     </div>
                  </div>
               ) : (
                  <div>
                     <div className="flex justify-center my-8">
                        <ClipLoader size={35} color="#FF8500" />
                     </div>
                     <div>
                        {trans.profile.edit_profile.address_model.getting}
                     </div>
                  </div>
               )
            ) : (
               <div>
                  <div className="font-medium text-lg text-red-600">
                     {trans.profile.edit_profile.address_model.uneabled}
                  </div>
               </div>
            )}
         </div>
      </div>
   );
};

export default GeoLocationAddress;
