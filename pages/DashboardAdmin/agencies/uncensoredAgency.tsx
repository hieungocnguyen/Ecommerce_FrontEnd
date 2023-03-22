import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { BiCheck, BiShowAlt, BiX } from "react-icons/bi";
import API, { authAxios, endpoints } from "../../../API";
import AdminLayoutDashboard from "../../../components/Dashboard/AdminLayoutDashboard";
import emptyvector from "../../../public/empty-box.png";

const AgenciesAdminDashboard = () => {
   const [uncensored, setUncensored] = useState([]);
   const loadUncensoredNumber = async () => {
      try {
         const resUncensored = await API.get(endpoints["uncensored_agency"]);
         setUncensored(resUncensored.data.data);
      } catch (error) {
         console.log(error);
      }
   };
   useEffect(() => {
      loadUncensoredNumber();
   }, []);
   const handleAccept = async (id) => {
      try {
         const resAccept = await authAxios().patch(
            endpoints["accept_agency"](id)
         );
         loadUncensoredNumber();
         toast.success("Accepted agency successful!", {
            position: "top-center",
         });
      } catch (error) {
         toast.error("Something wrong, try it later!", {
            position: "top-center",
         });
         console.log(error);
      }
   };
   const handleDeny = async (id) => {
      try {
         const resDeny = await authAxios().patch(endpoints["deny_agency"](id));
         loadUncensoredNumber();
         toast.success("Denied agency successful!", { position: "top-center" });
      } catch (error) {
         toast.error("Something wrong, try it later!", {
            position: "top-center",
         });
         console.log(error);
      }
   };
   return (
      <AdminLayoutDashboard>
         <div className="w-[90%] mx-auto">
            <div className="flex justify-between my-10">
               <div className="font-semibold text-2xl">Uncensored Agencies</div>
            </div>
            {uncensored.length > 0 ? (
               <div className="rounded-lg dark:bg-dark-primary bg-light-spot overflow-hidden shadow-2xl dark:shadow-dark-shadow shadow-light-spot">
                  <ul className="grid grid-cols-12 p-5 dark:bg-dark-spot bg-light-primary items-center font-semibold">
                     <li className="col-span-1">Avatar</li>
                     <li className="col-span-3">Name</li>
                     <li className="col-span-2">Field</li>
                     <li className="col-span-2">Hotline</li>
                     <li className="col-span-3">Address</li>
                  </ul>
                  {uncensored.map((agency) => (
                     <ul
                        className="grid grid-cols-12 p-5  items-center dark:hover:bg-dark-spot hover:bg-light-spot cursor-pointer relative"
                        key={agency.id}
                     >
                        <li className="col-span-1">
                           <Image
                              src={agency.agency.avatar}
                              alt=""
                              width={42}
                              height={42}
                              className="object-cover rounded-lg"
                           />
                        </li>
                        <li className="col-span-3">{agency.agency.name}</li>
                        <li className="col-span-2">
                           {agency.agency.field.name}
                        </li>
                        <li className="col-span-2">{agency.agency.hotline}</li>
                        <li className="col-span-3">{agency.agency.address}</li>
                        <li className="flex gap-5 text-3xl absolute right-5">
                           <div className="p-2 rounded-lg bg-blue-main text-white shadow-lg hover:shadow-blue-main transition-all">
                              <BiShowAlt />
                           </div>
                           <div
                              className="p-2 rounded-lg bg-green-600 text-white shadow-lg hover:shadow-green-600 transition-all"
                              onClick={() => handleAccept(agency.id)}
                           >
                              <BiCheck />
                           </div>
                           <div
                              className="p-2 rounded-lg bg-red-600 text-white  shadow-lg hover:shadow-red-600 transition-all"
                              onClick={() => handleDeny(agency.id)}
                           >
                              <BiX />
                           </div>
                        </li>
                     </ul>
                  ))}
               </div>
            ) : (
               <div>
                  <div className="relative w-80 h-80 rounded-md overflow-hidden mx-auto">
                     <Image
                        src={emptyvector}
                        alt="Empty"
                        layout="fill"
                        objectFit="cover"
                     ></Image>
                  </div>
                  <div className="uppercase text-xl font-semibold text-center">
                     There are no registrations yet
                  </div>
               </div>
            )}
         </div>
      </AdminLayoutDashboard>
   );
};

export default AgenciesAdminDashboard;
