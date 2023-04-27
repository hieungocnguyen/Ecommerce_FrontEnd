import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiFillFire, AiFillHeart } from "react-icons/ai";
import API, { endpoints } from "../API";
import dynamic from "next/dynamic";

// import AgencyCard from "./AgencyCard";
const AgencyCard = dynamic(import("./AgencyCard"));

const HotAgency = () => {
   const [hotAgency, setHotAgency] = useState([]);

   const fetchHotAgencies = async () => {
      try {
         const resHot = await API.get(`${endpoints["get_top_agency"]}/4`);
         setHotAgency(resHot.data.data);
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      fetchHotAgencies();
   }, []);

   return (
      <div>
         {hotAgency.length > 0 ? (
            <>
               <div>
                  <div className="flex justify-center items-center gap-1 font-bold text-2xl my-5">
                     <span>
                        <AiFillFire className="text-xl" />
                     </span>
                     Hot Agency
                  </div>
                  <div className="grid grid-cols-4 gap-10">
                     {hotAgency.map((agency) => (
                        <AgencyCard
                           agency={agency[0]}
                           key={agency[0].id}
                           likeNumber={agency[1]}
                        />
                     ))}
                  </div>
                  <Link href="/allagency">
                     <div className="mt-10 text-lg px-5 py-3 rounded-lg border-2 border-blue-main inline-block hover:bg-blue-main hover:text-white font-semibold cursor-pointer hover:shadow-lg hover:shadow-blue-main">
                        See all agency
                     </div>
                  </Link>
               </div>
            </>
         ) : (
            <></>
         )}
      </div>
   );
};

export default HotAgency;
