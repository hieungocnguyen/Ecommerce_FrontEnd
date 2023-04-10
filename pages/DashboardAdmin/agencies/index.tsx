import { log } from "console";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import API, { endpoints } from "../../../API";
import AdminLayoutDashboard from "../../../components/Dashboard/AdminLayoutDashboard";
import ConfirmModel from "../../../components/Model/ConfirmModel";
import { toast } from "react-hot-toast";

const AgenciesAdminDashboard = () => {
   const [agencies, setAgencies] = useState([]);
   const [isOpenConfirmBan, setIsOpenConfirmBan] = useState(false);
   const [isOpenConfirmUnBan, setIsOpenConfirmUnBan] = useState(false);
   const [modelID, setModelID] = useState(-1);

   const fetchAgencies = async () => {
      try {
         const resAgency = await API.get(endpoints["all_agency"]);
         setAgencies(resAgency.data.data);
      } catch (error) {
         console.log(error);
      }
   };
   useEffect(() => {
      fetchAgencies();
   }, []);

   const handleBanAgency = async (modelID) => {
      try {
         const res = await API.patch(endpoints["ban_agency"](modelID));
         fetchAgencies();
         toast.success("Ban agency successful", { position: "top-center" });
      } catch (error) {
         console.log(error);
      }
   };

   const handleUnbanAgency = async (modelID) => {
      try {
         const res = await API.patch(endpoints["unban_agency"](modelID));
         fetchAgencies();
         toast.success("Ban agency unsuccessful", { position: "top-center" });
      } catch (error) {
         console.log(error);
      }
   };

   return (
      <AdminLayoutDashboard>
         <div className="w-[90%] mx-auto">
            <div className="flex justify-between my-10">
               <div className="font-semibold text-2xl">Agency List</div>
            </div>

            <div className="rounded-lg dark:bg-dark-primary bg-light-primary overflow-hidden shadow-lg dark:shadow-dark-shadow shadow-light-primary mb-10">
               <ul className="grid grid-cols-12 p-5 items-center font-semibold">
                  <li className="col-span-1">Avatar</li>
                  <li className="col-span-3">Name</li>
                  <li className="col-span-2">Field</li>
                  <li className="col-span-2">Hotline</li>
                  <li className="col-span-3">Address</li>
                  <li className=""></li>
               </ul>
               {agencies
                  .filter((agency) => agency.isCensored === 1)
                  .map((agency) => (
                     <Link
                        href={`/DashboardAdmin/agencies/${agency.id}`}
                        key={agency.id}
                     >
                        <ul className="grid grid-cols-12 p-5 items-center dark:bg-dark-spot dark:hover:bg-dark-primary bg-light-spot hover:bg-light-primary cursor-pointer font-medium">
                           <li className="col-span-1">
                              <Image
                                 src={agency.avatar}
                                 alt=""
                                 width={42}
                                 height={42}
                                 className="object-cover rounded-xl"
                              />
                           </li>
                           <li className="col-span-3">{agency.name}</li>
                           <li className="col-span-2">{agency.field.name}</li>
                           <li className="col-span-2">{agency.hotline}</li>
                           <li className="col-span-3">{agency.address}</li>
                           <li className="col-span-1">
                              {agency.isActive == 1 ? (
                                 <div
                                    className=" bg-primary-color text-white p-4 w-full rounded-lg font-semibold text-center cursor-pointer hover:shadow-lg hover:shadow-primary-color"
                                    onClick={(event) => {
                                       event.stopPropagation();
                                       setIsOpenConfirmBan(true);
                                       setModelID(agency.id);
                                    }}
                                 >
                                    Ban
                                 </div>
                              ) : (
                                 <div
                                    className=" bg-blue-main text-white p-4 w-full rounded-lg font-semibold text-center cursor-pointer hover:shadow-lg hover:shadow-blue-main"
                                    onClick={(event) => {
                                       event.stopPropagation();
                                       setIsOpenConfirmUnBan(true);
                                       setModelID(agency.id);
                                    }}
                                 >
                                    Unban
                                 </div>
                              )}
                           </li>
                        </ul>
                     </Link>
                  ))}
               <div
                  className={`fixed top-0 right-0 w-full h-screen backdrop-blur-sm items-center justify-center z-20 ${
                     isOpenConfirmBan ? "flex" : "hidden"
                  }`}
               >
                  <div className="w-1/3  h-fit">
                     <ConfirmModel
                        functionConfirm={() => handleBanAgency(modelID)}
                        content={"You will ban this agency!"}
                        isOpenConfirm={isOpenConfirmBan}
                        setIsOpenConfirm={setIsOpenConfirmBan}
                     />
                  </div>
               </div>
               <div
                  className={`fixed top-0 right-0 w-full h-screen backdrop-blur-sm items-center justify-center z-20 ${
                     isOpenConfirmUnBan ? "flex" : "hidden"
                  }`}
               >
                  <div className="w-1/3  h-fit">
                     <ConfirmModel
                        functionConfirm={() => handleUnbanAgency(modelID)}
                        content={"You will unban this agency!"}
                        isOpenConfirm={isOpenConfirmUnBan}
                        setIsOpenConfirm={setIsOpenConfirmUnBan}
                     />
                  </div>
               </div>
            </div>
         </div>
      </AdminLayoutDashboard>
   );
};

export default AgenciesAdminDashboard;
