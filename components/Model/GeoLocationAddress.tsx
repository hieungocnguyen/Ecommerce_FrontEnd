import { useEffect, useRef, useState } from "react";
import { useGeolocated } from "react-geolocated";
import API from "../../API";
import { ClipLoader } from "react-spinners";
import { BiCaretLeft, BiRotateLeft } from "react-icons/bi";
import { toast } from "react-hot-toast";

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
            `http://localhost:8080/ou-ecommerce/api/location/get-nearest-location?latitude=${coords.latitude}&longitude=${coords.longitude}`
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
               Get your current location by GPS
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
               <div className="font-medium">Switch to input manually</div>
            </div>
         </div>
         <div>
            {!isGeolocationAvailable ? (
               <div>Your browser does not support Geolocation.</div>
            ) : isGeolocationEnabled ? (
               coords ? (
                  <div className="">
                     <div className="text-left mb-1">
                        <div className="font-semibold text-sm pl-1">
                           Your current location
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
                              Street
                           </label>
                           <input
                              id="street"
                              name="street"
                              required
                              type="text"
                              placeholder="Street"
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
                           Submit this address
                        </button>
                     </div>

                     <div className="text-secondary-color text-sm font-medium mt-4">
                        If the returned address is incorrect please check the
                        location service and try again
                     </div>
                  </div>
               ) : (
                  <div>
                     <div className="flex justify-center my-8">
                        <ClipLoader size={35} color="#FF8500" />
                     </div>
                     <div>Getting the location data&hellip;</div>
                  </div>
               )
            ) : (
               <div>
                  <div className="font-medium text-lg text-red-600">
                     Geolocation is not enabled.
                  </div>
               </div>
            )}
         </div>
      </div>
   );
};

export default GeoLocationAddress;
