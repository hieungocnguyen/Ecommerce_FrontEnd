import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BiHappyHeartEyes, BiHeartCircle } from "react-icons/bi";
import API from "../API";

const HotAgency = () => {
   const [hotAgency, setHotAgency] = useState([]);
   useEffect(() => {
      const loadHotAagencies = async () => {
         const resHot = await API.get(
            "http://localhost:8080/ou-ecommerce/api/agency/top-agency/4"
         );
         setHotAgency(resHot.data.data);
      };
      loadHotAagencies();
   }, []);
   return (
      <div>
         <h1 className="text-center font-bold text-2xl my-5">Hot Agency</h1>
         <div className="grid grid-cols-4 gap-8">
            {hotAgency.map((agency) => (
               <Link href={`/agencyinfo/${agency[0].id}`} key={agency.id}>
                  <div className="bg-dark-primary rounded-lg flex items-center gap-4 p-4 cursor-pointer">
                     <div className="relative overflow-hidden w-20 h-20 rounded-xl">
                        <Image
                           src={agency[0].avatar}
                           alt="avatar"
                           layout="fill"
                        />
                     </div>
                     <div className="text-left">
                        <div className="font-semibold text-lg ">
                           {agency[0].name}
                        </div>
                        <div className="font-medium opacity-90 text-sm">
                           {agency[0].field.name}
                        </div>
                        <div className="flex items-center gap-1">
                           <div className="font-medium ">{agency[1]}</div>
                           <BiHeartCircle className="text-llg" />
                        </div>
                     </div>
                  </div>
               </Link>
            ))}
         </div>
      </div>
   );
};

export default HotAgency;
