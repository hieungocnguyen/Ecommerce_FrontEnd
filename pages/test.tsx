import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useGeolocated } from "react-geolocated";
import API from "../API";

const Demo = () => {
   const {
      coords,
      isGeolocationAvailable,
      isGeolocationEnabled,
      positionError,
   } = useGeolocated({
      positionOptions: {
         enableHighAccuracy: false,
      },
      userDecisionTimeout: 9000,
      isOptimisticGeolocationEnabled: true,
   });
   const [location, setLocation] = useState<string>("");

   useEffect(() => {
      const fetchLocation = async () => {
         const res = await API.get(
            `http://localhost:8080/ou-ecommerce/api/location/get-nearest-location?latitude=${coords.latitude}&longitude=${coords.longitude}`
         );
         setLocation(res.data.data);
      };
      if (coords) {
         fetchLocation();
      }
      console.log(isGeolocationEnabled);
   }, [coords]);

   return (
      <div>
         {!isGeolocationAvailable ? (
            <div>Your browser does not support Geolocation.</div>
         ) : isGeolocationEnabled ? (
            coords ? (
               <div>
                  <div>Latitude: {coords.latitude}</div>
                  <div>Longitude: {coords.longitude}</div>
                  <div className="">Location: {location}</div>
               </div>
            ) : (
               <div>Getting the location data&hellip;</div>
            )
         ) : (
            <div>Geolocation is not enabled.</div>
         )}
      </div>
   );
};

// export default Demo;
export default dynamic(() => Promise.resolve(Demo), { ssr: false });
