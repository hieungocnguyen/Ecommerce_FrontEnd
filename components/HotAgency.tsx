import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiFillFire, AiFillHeart } from "react-icons/ai";
import API from "../API";

const HotAgency = ({ setLoading }) => {
   const [hotAgency, setHotAgency] = useState([]);
   const router = useRouter();

   const handleRouteAgency = (agencyID) => {
      router.push(`/agencyinfo/${agencyID}`);
   };

   useEffect(() => {
      const loadHotAagencies = async () => {
         try {
            const resHot = await API.get(
               "http://localhost:8080/ou-ecommerce/api/agency/top-agency/4"
            );
            setHotAgency(resHot.data.data);
         } catch (error) {
            console.log(error);
         }
      };
      loadHotAagencies();
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
                  <div className="grid grid-cols-4 gap-8">
                     {hotAgency.map((agency) => (
                        <div className="relative" key={agency[0].id}>
                           <div
                              className="dark:bg-dark-primary bg-light-primary rounded-lg p-6 cursor-pointer  hover:shadow-lg"
                              onClick={() => handleRouteAgency(agency[0].id)}
                           >
                              <div>
                                 <div className="relative">
                                    <div className="w-full aspect-square relative overflow-hidden rounded-2xl hover:scale-105 transition-all">
                                       <Image
                                          src={agency[0].avatar}
                                          alt="avatar"
                                          layout="fill"
                                          className="object-cover hover:shadow-lg"
                                       />
                                    </div>
                                    <div className="absolute -right-4 -bottom-4 rounded-tl-xl pt-2 pb-4 pl-4 pr-4 font-semibold uppercase bg-light-primary dark:bg-dark-primary dark:text-dark-text text-light-text text-2xl z-10 flex items-center justify-center gap-1">
                                       <div>{agency[1]}</div>
                                       <AiFillHeart className="text-2xl" />
                                    </div>
                                 </div>
                                 <div className="text-center font-bold text-xl uppercase mt-4 line-clamp-2 text-blue-main">
                                    {agency[0].name}
                                 </div>
                                 <div className="text-center font-semibold">
                                    {agency[0].field.name}
                                 </div>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
                  <div className="">See all agency</div>
               </div>
            </>
         ) : (
            <></>
         )}
      </div>
   );
};

export default HotAgency;
