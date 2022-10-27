import Image from "next/image";
import { useEffect, useState } from "react";
import API, { endpoints } from "../../../API";
import AdminLayoutDashboard from "../../../components/Dashboard/AdminLayoutDashboard";

const AgenciesAdminDashboard = () => {
   const [uncensored, setUncensored] = useState([]);

   const loadUncensoredNumber = async () => {
      const resUncensored = await API.get(endpoints["uncensored_agency"]);
      setUncensored(resUncensored.data.data);
   };
   useEffect(() => {
      loadUncensoredNumber();
   }, []);
   return (
      <AdminLayoutDashboard>
         <div className="w-[90%] mx-auto">
            <div className="flex justify-between my-10">
               <div className="font-semibold text-2xl">Uncensored Agencies</div>
            </div>
            <div className="grid grid-cols-4 gap-8">
               {uncensored.map((a) => (
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
                     <div className="text-green-600 font-semibold">Accept </div>
                  </div>
               ))}
            </div>
         </div>
      </AdminLayoutDashboard>
   );
};

export default AgenciesAdminDashboard;
