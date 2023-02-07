import { log } from "console";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import API, { endpoints } from "../../../API";
import AdminLayoutDashboard from "../../../components/Dashboard/AdminLayoutDashboard";

const AgenciesAdminDashboard = () => {
   const [agencies, setAgencies] = useState([]);
   const loadAgency = async () => {
      const resAgency = await API.get(endpoints["all_agency"]);
      setAgencies(resAgency.data.data);
   };
   useEffect(() => {
      loadAgency();
   }, []);
   return (
      <AdminLayoutDashboard>
         <div className="w-[90%] mx-auto">
            <div className="flex justify-between my-10">
               <div className="font-semibold text-2xl">Agency List</div>
            </div>

            <div className="rounded-lg bg-dark-primary overflow-hidden shadow-2xl shadow-dark-shadow">
               <ul className="grid grid-cols-12 p-5 bg-dark-spot items-center font-semibold">
                  <li className="col-span-1">Avatar</li>
                  <li className="col-span-3">Name</li>
                  <li className="col-span-2">Field</li>
                  <li className="col-span-2">Hotline</li>
                  <li className="col-span-4">Address</li>
               </ul>
               {agencies
                  .filter((agency) => agency.isCensored === 1)
                  .map((agency) => (
                     <ul
                        className="grid grid-cols-12 p-5  items-center hover:bg-dark-spot cursor-pointer"
                        key={agency.id}
                     >
                        <li className="col-span-1">
                           <Image
                              src={agency.avatar}
                              alt=""
                              width={42}
                              height={42}
                              className="object-cover rounded-full"
                           />
                        </li>
                        <li className="col-span-3">{agency.name}</li>
                        <li className="col-span-2">{agency.field.name}</li>
                        <li className="col-span-2">{agency.hotline}</li>
                        <li className="col-span-4">{agency.address}</li>
                     </ul>
                  ))}
            </div>
         </div>
      </AdminLayoutDashboard>
   );
};

export default AgenciesAdminDashboard;
