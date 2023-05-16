import { log } from "console";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import API, { endpoints } from "../../../API";
import AdminLayoutDashboard from "../../../components/Dashboard/AdminLayoutDashboard";
import ConfirmModel from "../../../components/Model/ConfirmModel";
import { toast } from "react-hot-toast";
import { BiMessageRounded } from "react-icons/bi";
import emptyBox from "../../../public/empty-box.png";

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
      const interval = setInterval(() => {
         fetchAgencies();
      }, 10000);

      return () => clearInterval(interval);
   }, []);

   const handleBanAgency = async (modelID) => {
      try {
         const res = await API.patch(endpoints["ban_agency"](modelID));
         fetchAgencies();
         toast.success("Ban agency successful", { position: "top-center" });
      } catch (error) {
         console.log(error);
         toast.error("Something wrong, please try again!");
      }
   };

   const handleUnbanAgency = async (modelID) => {
      try {
         const res = await API.patch(endpoints["unban_agency"](modelID));
         fetchAgencies();
         toast.success("Ban agency unsuccessful", { position: "top-center" });
      } catch (error) {
         console.log(error);
         toast.error("Something wrong, please try again!");
      }
   };

   return (
      <AdminLayoutDashboard title={"List Agency"}>
         <div className="w-[90%] mx-auto">
            <div className="flex justify-between my-10">
               <div className="font-semibold text-2xl">Agency List</div>
            </div>

            {agencies.length > 0 ? (
               <div className="rounded-lg dark:bg-dark-primary bg-light-primary overflow-hidden shadow-lg dark:shadow-dark-shadow shadow-light-primary mb-10">
                  <ul className="grid grid-cols-12 p-5 items-center font-semibold">
                     <li className="col-span-1">Avatar</li>
                     <li className="col-span-3">Name</li>
                     <li className="col-span-2">Field</li>
                     <li className="col-span-2">Hotline</li>
                     <li className="col-span-2">Address</li>
                     <li className="col-span-2"></li>
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
                              <li className="col-span-2">
                                 {agency.field.name}
                              </li>
                              <li className="col-span-2">{agency.hotline}</li>
                              <li className="col-span-2">{agency.address}</li>
                              <li className="col-span-2">
                                 {agency.isActive == 0 &&
                                    (agency.deactivatedByAdmin == 1 ? (
                                       <div className="text-red-500 flex gap-1 items-center text-sm font-medium pl-3 mb-1">
                                          <BiMessageRounded />
                                          Banned by Admin
                                       </div>
                                    ) : (
                                       <div className="text-red-500 flex gap-1 items-center text-sm font-medium pl-3 mb-1">
                                          <BiMessageRounded />
                                          Banned by Expired
                                       </div>
                                    ))}
                                 {agency.isActive == 1 ? (
                                    <div
                                       className=" bg-green-500 text-white px-4 py-2 w-full rounded-lg font-semibold text-center cursor-pointer hover:shadow-lg hover:shadow-green-500"
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
                                       className=" bg-red-500 text-white px-4 py-2 w-full rounded-lg font-semibold text-center cursor-pointer hover:shadow-lg hover:shadow-red-500"
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
                           content={"You will ban this merchant!"}
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
                           content={"You will unban this merchant!"}
                           isOpenConfirm={isOpenConfirmUnBan}
                           setIsOpenConfirm={setIsOpenConfirmUnBan}
                        />
                     </div>
                  </div>
               </div>
            ) : (
               <>
                  <div className="relative overflow-hidden aspect-square w-1/4 mx-auto">
                     <Image
                        src={emptyBox}
                        alt="empty"
                        layout="fill"
                        className="object-cover"
                     />
                  </div>
                  <div className="uppercase text-xl font-semibold text-center">
                     agency list is empty
                  </div>
               </>
            )}
         </div>
      </AdminLayoutDashboard>
   );
};

export default AgenciesAdminDashboard;
