import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import API, { endpoints } from "../../../API";
import AdminLayoutDashboard from "../../../components/Dashboard/AdminLayoutDashboard";

const AgenciesAdminDashboard = () => {
   const [agencies, setAgencies] = useState([]);
   const [numberUncensored, setNumberUncensored] = useState(0);
   const loadAgency = async () => {
      const resAgency = await API.get(endpoints["all_agency"]);
      setAgencies(resAgency.data.data);
      console.log(resAgency.data.data);
   };
   const loadUncensoredNumber = async () => {
      const resUncensored = await API.get(endpoints["uncensored_agency"]);
      setNumberUncensored(resUncensored.data.data.length);
   };
   useEffect(() => {
      loadAgency();
      loadUncensoredNumber();
   }, []);
   return (
      <AdminLayoutDashboard>
         <div className="w-[90%] mx-auto">
            <div className="flex justify-between my-10">
               <div className="font-semibold text-2xl">Agencies</div>
               <div className="relative">
                  {numberUncensored > 0 ? (
                     <div className="absolute right-[-5px] top-[-5px] bg-red-500 rounded-full w-6 h-6 flex justify-center items-center font-semibold"></div>
                  ) : (
                     <></>
                  )}

                  <Link href="/DashboardAdmin/agencies/uncensoredAgency">
                     <button className="p-4 bg-blue-main hover:bg-opacity-80 rounded-lg font-semibold ">
                        Uncensored Agency
                     </button>
                  </Link>
               </div>
            </div>
            <div className="grid grid-cols-4 gap-8">
               {agencies.map((a) => (
                  <div
                     key={a.id}
                     className="bg-neutral-800 rounded-lg flex flex-col items-center py-6"
                  >
                     <div className="flex justify-center my-2">
                        <Image
                           src={a.avatar}
                           alt=""
                           width={120}
                           height={120}
                           className="rounded-full"
                        />
                     </div>
                     <div className="text-lg font-semibold text-blue-main">
                        {a.name}
                     </div>
                     <div className="my-1 text-lg">{a.field.name}</div>
                     <div className="text-sm">{a.address}</div>
                     <div className="text-sm">{a.hotline}</div>
                  </div>
               ))}
            </div>
         </div>
      </AdminLayoutDashboard>
   );
};

export default AgenciesAdminDashboard;
