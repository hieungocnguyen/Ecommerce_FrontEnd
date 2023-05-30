import { useContext, useEffect, useState } from "react";
import LayoutDashboardManager from "../../../components/Dashboard/LayoutDashboardManager";
import { Store } from "../../../utils/Store";
import API, { endpoints } from "../../../API";
import renewalBackground from "../../../public/renewal.png";
import Image from "next/image";
import Link from "next/link";
import emptyvector from "../../../public/empty-box.png";

const Renewal = () => {
   const { state } = useContext(Store);
   const { agencyInfo } = state;

   const [expireDate, setExpireDate] = useState(0);
   const [countDown, setCountDown] = useState(0);
   const [historyRenewalList, setHistoryRenewalList] = useState<any>([]);

   const fetchRenewal = async () => {
      try {
         const res = await API.get(
            endpoints["get_list_renewal_manager_by_agencyID"](agencyInfo.id)
         );
         setExpireDate(res.data.data.expireDate);
         setHistoryRenewalList(res.data.data.renewalOrderSet);
      } catch (error) {
         console.log(error);
      }
   };
   useEffect(() => {
      fetchRenewal();
   }, []);

   useEffect(() => {
      if (expireDate > 0) {
         setCountDown(expireDate - new Date().getTime());
         const interval = setInterval(() => {
            setCountDown(expireDate - new Date().getTime());
         }, 1000);

         return () => clearInterval(interval);
      }
   }, [expireDate]);

   return (
      <LayoutDashboardManager title="Renewal">
         <div className="w-[90%] mx-auto my-8">
            <div className="font-semibold text-2xl mb-6">Renewal Service</div>
            <div className="grid grid-cols-2 gap-10">
               <div
                  className={`rounded-lg p-6 h-[210px] ${
                     countDown > 0 ? "bg-primary-color" : "bg-red-500"
                  }`}
               >
                  {countDown > 0 ? (
                     <div>
                        <div className="text-center text-lg text-white font-semibold mb-4">
                           Remaining time until service expiration
                        </div>
                        <div className="flex justify-around items-center gap-8 text-3xl font-semibold">
                           <div>
                              <div className="bg-light-primary w-20 py-6 text-center rounded-lg">
                                 {Math.floor(countDown / (1000 * 60 * 60 * 24))}
                              </div>
                              <div className="text-base text-center mt-2 text-light-primary">
                                 Days
                              </div>
                           </div>
                           <div>
                              <div className="bg-light-primary w-20 py-6 text-center rounded-lg">
                                 {Math.floor(
                                    (countDown % (1000 * 60 * 60 * 24)) /
                                       (1000 * 60 * 60)
                                 )}
                              </div>
                              <div className="text-base text-center mt-2 text-light-primary">
                                 Hours
                              </div>
                           </div>
                           <div>
                              <div className="bg-light-primary w-20 py-6 text-center rounded-lg">
                                 {Math.floor(
                                    (countDown % (1000 * 60 * 60)) / (1000 * 60)
                                 )}
                              </div>
                              <div className="text-base text-center mt-2 text-light-primary">
                                 Minutes
                              </div>
                           </div>
                           <div>
                              <div className="bg-light-primary w-20 py-6 text-center rounded-lg">
                                 {Math.floor((countDown % (1000 * 60)) / 1000)}
                              </div>
                              <div className="text-base text-center mt-2 text-light-primary">
                                 Seconds
                              </div>
                           </div>
                        </div>
                     </div>
                  ) : (
                     <div className="text-white font-semibold text-lg flex justify-around items-center">
                        Your service plan has expired
                     </div>
                  )}
               </div>
               <div className="relative rounded-lg overflow-hidden">
                  <div className="relative  w-full h-full">
                     <Image
                        src={renewalBackground}
                        alt="img"
                        layout="fill"
                        className="object-cover"
                     />
                  </div>
                  <div className="absolute left-0 top-0 bg-dark-primary opacity-30 w-full h-full"></div>
                  <div className="absolute right-8 top-6 text-white text-3xl font-bold text-right">
                     Service plan for your agent
                     <br /> with special offer
                  </div>
                  <Link href={"/DashboardManager/renewal/serviceplan"}>
                     <div className="absolute right-8 bottom-6 bg-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-white cursor-pointer">
                        Renewal now
                     </div>
                  </Link>
               </div>
            </div>
            <div className="">
               <div className="font-semibold text-xl my-6">History renewal</div>
               {historyRenewalList.length > 0 ? (
                  <div className="">
                     {historyRenewalList
                        .sort((a, b) =>
                           a.createdDate < b.createdDate ? 1 : -1
                        )
                        .map((item) => (
                           <div
                              key={item.id}
                              className="grid grid-cols-12 font-medium text-center mb-4 bg-light-primary dark:bg-dark-primary rounded-lg py-8"
                           >
                              <div className="col-span-3">
                                 {new Date(item.createdDate).toLocaleDateString(
                                    "en-GB"
                                 )}
                              </div>
                              <div className="col-span-3">
                                 {item.renewalPackage.packageName}
                              </div>
                              <div className="col-span-3">
                                 {item.price.toLocaleString("it-IT", {
                                    style: "currency",
                                    currency: "VND",
                                 })}
                              </div>
                              <div className="col-span-3 text-primary-color font-bold">
                                 + {item.numberOfDaysAvailable} days
                              </div>
                           </div>
                        ))}
                  </div>
               ) : (
                  <div>
                     <div className="relative w-52 h-52 rounded-md overflow-hidden mx-auto">
                        <Image
                           src={emptyvector}
                           alt="Empty"
                           layout="fill"
                           objectFit="cover"
                        ></Image>
                     </div>
                     <div className="uppercase text-xl font-semibold text-center">
                        You have not renewed any package yet
                     </div>
                  </div>
               )}
            </div>
         </div>
      </LayoutDashboardManager>
   );
};

export default Renewal;
