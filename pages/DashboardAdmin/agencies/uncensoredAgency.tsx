import Image from "next/image";
import { useEffect, useState } from "react";
import { BiCheck, BiX } from "react-icons/bi";
import API, { authAxios, endpoints } from "../../../API";
import AdminLayoutDashboard from "../../../components/Dashboard/AdminLayoutDashboard";
import emptyvector from "../../../public/empty-box.png";

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
            {uncensored.length > 0 ? (
               <div className="rounded-lg bg-dark-primary overflow-hidden shadow-2xl shadow-dark-shadow">
                  <ul className="grid grid-cols-12 p-5 bg-dark-spot items-center font-semibold">
                     <li className="col-span-1">Avatar</li>
                     <li className="col-span-3">Name</li>
                     <li className="col-span-2">Field</li>
                     <li className="col-span-2">Hotline</li>
                     <li className="col-span-3">Address</li>
                  </ul>
                  {uncensored.map((agency) => (
                     <ul
                        className="grid grid-cols-12 p-5  items-center hover:bg-dark-spot cursor-pointer relative"
                        key={agency.id}
                     >
                        <li className="col-span-1">
                           <Image
                              src={agency.agency.avatar}
                              alt=""
                              width={42}
                              height={42}
                              className="object-cover rounded-full"
                           />
                        </li>
                        <li className="col-span-3">{agency.agency.name}</li>
                        <li className="col-span-2">
                           {agency.agency.field.name}
                        </li>
                        <li className="col-span-2">{agency.agency.hotline}</li>
                        <li className="col-span-3">{agency.agency.address}</li>
                        <li className="flex gap-5 text-3xl absolute right-5">
                           <div
                              className="p-1 rounded-lg bg-[#36b37e] text-[#86e8ab] hover:text-white"
                              onClick={() => handleAccept(agency.id)}
                           >
                              <BiCheck />
                           </div>
                           <div
                              className="p-1 rounded-lg bg-[#ff5630] text-[#ffac82] hover:text-white"
                              onClick={() => handleDeny(agency.id)}
                           >
                              <BiX />
                           </div>
                        </li>
                     </ul>
                  ))}
               </div>
            ) : (
               <div className="relative w-80 h-80 rounded-md overflow-hidden mx-auto">
                  <Image
                     src={emptyvector}
                     alt="Empty"
                     layout="fill"
                     objectFit="cover"
                  ></Image>
               </div>
            )}
         </div>
      </AdminLayoutDashboard>
   );
};

export default AgenciesAdminDashboard;
