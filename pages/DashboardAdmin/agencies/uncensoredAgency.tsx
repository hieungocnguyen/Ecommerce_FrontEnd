import Image from "next/image";
import { useEffect, useState } from "react";
import API, { authAxios, endpoints } from "../../../API";
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
   const handleAccept = async (id) => {
      const resAccept = await authAxios().patch(endpoints["accept_agency"](id));
      loadUncensoredNumber();
   };
   const handleDeny = async (id) => {
      const resDeny = await authAxios().patch(endpoints["deny_agency"](id));
      loadUncensoredNumber();
   };
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
                           src={a.agency.avatar}
                           alt=""
                           width={120}
                           height={120}
                           className="rounded-full"
                        />
                     </div>
                     <div className="text-lg font-semibold text-blue-main">
                        {a.agency.name}
                     </div>
                     <div className="">{a.agency.address}</div>
                     <div className="">{a.agency.hotline}</div>
                     <div className="flex gap-4 my-4">
                        <div
                           className="text-green-600 font-semibold bg-green-600 bg-opacity-30 p-2 rounded-lg cursor-pointer"
                           onClick={() => handleAccept(a.id)}
                        >
                           Accept
                        </div>
                        <div
                           className="text-red-600 font-semibold bg-red-600 bg-opacity-30 rounded-lg p-2 cursor-pointer"
                           onClick={() => handleDeny(a.id)}
                        >
                           Deny
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </AdminLayoutDashboard>
   );
};

export default AgenciesAdminDashboard;
