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

            <div className="rounded-lg dark:bg-dark-primary bg-light-primary overflow-hidden shadow-lg dark:shadow-dark-shadow shadow-light-primary mb-10">
               <ul className="grid grid-cols-12 p-5 dark:hover:bg-dark-spot hover:bg-light-spot items-center font-semibold">
                  <li className="col-span-1">Avatar</li>
                  <li className="col-span-3">Name</li>
                  <li className="col-span-2">Field</li>
                  <li className="col-span-2">Hotline</li>
                  <li className="col-span-4">Address</li>
               </ul>
               {agencies
                  .filter((agency) => agency.isCensored === 1)
                  .map((agency) => (
                     <Link
                        href={`/DashboardAdmin/agencies/${agency.id}`}
                        key={agency.id}
                     >
                        <ul className="grid grid-cols-12 p-5  items-center dark:hover:bg-dark-spot bg-light-spot cursor-pointer">
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
                     </Link>
                  ))}
            </div>
         </div>
      </AdminLayoutDashboard>
   );
};

export default AgenciesAdminDashboard;
