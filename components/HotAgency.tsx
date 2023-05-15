import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiFillFire, AiFillHeart } from "react-icons/ai";
import API, { endpoints } from "../API";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import useTrans from "../hook/useTrans";

// import AgencyCard from "./AgencyCard";
const AgencyCard = dynamic(import("./AgencyCard"));

const HotAgency = () => {
   const [hotAgency, setHotAgency] = useState([]);

   const trans = useTrans();

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
                  <div className="flex justify-center items-center gap-1 font-bold text-2xl my-4">
                     <span>
                        <AiFillFire className="text-xl" />
                     </span>
                     {trans.home.hotAgency}
                  </div>
                  <div className="grid sm:grid-cols-4 grid-cols-2 sm:gap-10 gap-4">
                     {hotAgency.map((agency) => (
                        <AgencyCard
                           agency={agency[0]}
                           key={agency[0].id}
                           likeNumber={agency[1]}
                        />
                     ))}
                  </div>
                  <Link href="/allagency">
                     <div className="sm:mt-6 mt-4 text-lg px-5 py-3 rounded-lg border-2 border-primary-color inline-block hover:bg-primary-color hover:text-white font-semibold cursor-pointer hover:shadow-lg hover:shadow-primary-color">
                        {trans.home.seeAllAgency}
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
