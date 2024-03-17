import AdminLayoutDashboard from "../../components/Dashboard/AdminLayoutDashboard";
import React, { useContext, useEffect, useState } from "react";
import { Store } from "../../utils/Store";
import API, { endpoints } from "../../API";
import TopSeller from "../../components/TopSeller";
import { Bar, Doughnut } from "react-chartjs-2";
import Image from "next/image";
import {
   Chart as ChartJS,
   CategoryScale,
   LinearScale,
   ArcElement,
   BarElement,
   Title,
   Tooltip,
   Legend,
} from "chart.js";
import Link from "next/link";
ChartJS.register(
   CategoryScale,
   ArcElement,
   LinearScale,
   BarElement,
   Title,
   Tooltip,
   Legend
);
import emptyBox from "../../public/empty-box.png";

const options = {
   responsive: true,
   plugins: {
      legend: {
         position: "top" as const,
      },
   },
};

const AdminHome = () => {
   const { state } = useContext(Store);
   const [items, setItems] = useState<any>([]);
   const [dataStatItem, setDataStatItem] = useState([]);
   const [dataStatMerchant, setDataStatMerchant] = useState([]);
   const [numberTop, setNumberTop] = useState(6);
   const { userInfo } = state;
   const [itemsHot, setItemsHot] = useState<any>([]);
   const [stats, setStats] = useState<any>({});

   const fetchItemsBestSeller = async () => {
      try {
         const res = await API.get(endpoints["items_best_seller"](6));
         setItemsHot(res.data.data);
      } catch (error) {
         console.log(error);
      }
   };

   const fetchData = async () => {
      try {
         setItems([]);
         setDataStatItem([]);
         const res = await API.get(endpoints["items_best_seller"](numberTop));
         res.data.data.map((item) => {
            setItems((items) => [...items, item[2]]);
            setDataStatItem((dataStatItem) => [...dataStatItem, item[4]]);
         });
      } catch (error) {
         console.log(error);
      }
   };

   const fetchStat = async () => {
      try {
         const res = await API.get(endpoints["general_stats_view_admin"]);
         setStats(res.data.data);
         setDataStatMerchant([
            res.data.data.numOfActiveAgency,
            res.data.data.numOfBannedByAdmin,
            res.data.data.numOfBannedByExpired,
            res.data.data.numOfUncensoredAgency,
         ]);
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      fetchItemsBestSeller();
      fetchData();
      fetchStat();
   }, []);

   const data = {
      labels: items,
      datasets: [
         {
            label: "Best seller",
            data: dataStatItem,
            borderColor: ["#ff9f1c", "#e71d36", "#662e9b", "#00509d"],
            backgroundColor: ["#ff9f1c", "#e71d36", "#662e9b", "#00509d"],
            borderWidth: 2,
         },
      ],
   };

   const dataMerchant = {
      labels: [
         "Active Merchant",
         "Banned by admin",
         "Banned by expired",
         "Uncensored",
      ],
      datasets: [
         {
            label: "Merchant",
            data: dataStatMerchant,
            borderColor: ["#2ccd59", "#4f4f50", "#116ad0", "#fb3e9c"],
            backgroundColor: ["#2ccd59", "#4f4f50", "#116ad0", "#fb3e9c"],
            borderWidth: 2,
         },
      ],
   };

   return (
      <AdminLayoutDashboard title="General">
         <div className="w-[95%] mx-auto">
            <div className="font-semibold text-2xl my-6">
               ✨Hello Administrator
            </div>
            <div className="text-center font-semibold text-xl mb-2">
               Merchant statistical
            </div>
            <div className="grid grid-cols-5 gap-4 mb-4">
               <div className="dark:bg-dark-primary bg-light-primary grid grid-cols-3 items-center rounded-lg font-medium p-2">
                  <div className="relative overflow-hidden w-2/3 aspect-square mx-auto">
                     <Image
                        src="https://res.cloudinary.com/dec25/image/upload/v1710665630/vecteezy_3d-rendering-green-tick-icon-isolated_9369014_ggz7t2.png"
                        alt="img"
                        layout="fill"
                        className="object-cover"
                     />
                  </div>
                  <div className="col-span-2">
                     <div>Active</div>
                     <div className="text-xl text-primary-color">
                        {stats.numOfActiveAgency}
                     </div>
                  </div>
               </div>
               <div className="dark:bg-dark-primary bg-light-primary grid grid-cols-3 items-center rounded-lg font-medium p-2">
                  <div className="relative overflow-hidden w-2/3 aspect-square mx-auto">
                     <Image
                        src="https://res.cloudinary.com/dec25/image/upload/v1710665789/2389859_eam5e6.webp"
                        alt="img"
                        layout="fill"
                        className="object-cover"
                     />
                  </div>
                  <div className="col-span-2">
                     <div>Deactivate</div>
                     <div className="text-xl text-primary-color">
                        {stats.numOfDeactivateAgency}
                     </div>
                  </div>
               </div>
               <div className="dark:bg-dark-primary bg-light-primary grid grid-cols-3 items-center  rounded-lg font-medium p-2">
                  <div className="relative overflow-hidden w-2/3 aspect-square mx-auto">
                     <Image
                        src="https://res.cloudinary.com/dec25/image/upload/v1710665724/expired-time-warning-3d-render-icon-illustration-with-transparent-background-empty-state-png_agmebr.png"
                        alt="img"
                        layout="fill"
                        className="object-cover"
                     />
                  </div>
                  <div className="col-span-2">
                     <div>Expired</div>
                     <div className="text-xl text-primary-color">
                        {stats.numOfBannedByExpired}
                     </div>
                  </div>
               </div>
               <div className="dark:bg-dark-primary bg-light-primary grid grid-cols-3 items-center  rounded-lg font-medium p-2">
                  <div className="relative overflow-hidden w-2/3 aspect-square mx-auto">
                     <Image
                        src="https://res.cloudinary.com/dec25/image/upload/v1710665600/3d-realistic-cross-check-mark-button-icon-red-circle-with-white-cancel-tick-floating-on-transparent-symbol-no-wrong-negative-decline-danger-concept-cartoon-icon-minimal-style-3d-rendering-free-png_erzzde.webp"
                        alt="img"
                        layout="fill"
                        className="object-cover"
                     />
                  </div>
                  <div className="col-span-2">
                     <div>Banned</div>
                     <div className="text-xl text-primary-color">
                        {stats.numOfBannedByAdmin}
                     </div>
                  </div>
               </div>
               <div className="dark:bg-dark-primary bg-light-primary grid grid-cols-3 items-center  rounded-lg font-medium p-2">
                  <div className="relative overflow-hidden w-2/3 aspect-square mx-auto">
                     <Image
                        src="https://res.cloudinary.com/dec25/image/upload/v1710665947/4665720_htwjwo.webp"
                        alt="img"
                        layout="fill"
                        className="object-cover"
                     />
                  </div>
                  <div className="col-span-2">
                     <div>Uncensored</div>
                     <div className="text-xl text-primary-color">
                        {stats.numOfUncensoredAgency}
                     </div>
                  </div>
               </div>
            </div>
            <div className="grid grid-cols-12 gap-6">
               <div className="col-span-8">
                  <div className="text-xl font-semibold text-center mb-2">
                     Statistical hot items
                  </div>
                  <div className=" dark:bg-dark-primary bg-light-primary rounded-lg p-8 h-fit">
                     <Bar options={options} data={data} />
                  </div>
               </div>
               <div className="col-span-4">
                  <div className="text-xl font-semibold text-center mb-2">
                     Statistical merchant
                  </div>
                  <div className=" dark:bg-dark-primary bg-light-primary rounded-lg p-8 h-fit">
                     <Doughnut options={options} data={dataMerchant} />
                  </div>
               </div>
            </div>
            <div className="">
               <div className="text-xl font-semibold text-center my-2">
                  Best selling items
               </div>
               <div className="grid grid-cols-6 gap-4">
                  {itemsHot.length > 0 &&
                     itemsHot.map((item) => (
                        <Link href={`/sale_post/${item[1].id}`} key={item.id}>
                           <div className="bg-light-primary dark:bg-dark-primary rounded-lg p-3 cursor-pointer hover:shadow-lg text-center">
                              <div className="relative overflow-hidden w-3/4 aspect-square mx-auto rounded-xl">
                                 <Image
                                    src={item[6]}
                                    alt="item"
                                    layout="fill"
                                    className="object-cover"
                                 />
                              </div>
                              <div className="font-semibold mt-2 line-clamp-1">
                                 {item[2]}
                              </div>
                              <div className="font-semibold text-sm opacity-75 line-clamp-1">
                                 {item[5]}
                              </div>
                              <div className="text-primary-color font-bold mt-1 text-lg">
                                 {item[3].toLocaleString("it-IT", {
                                    style: "currency",
                                    currency: "VND",
                                 })}
                              </div>
                              <div className="font-semibold text-sm opacity-75 line-clamp-1">
                                 Sold: {item[4]}
                              </div>
                           </div>
                        </Link>
                     ))}
                  {itemsHot.length == 0 && (
                     <div className="col-span-4 relative overflow-hidden w-1/2 aspect-square mx-auto">
                        <Image
                           src={emptyBox}
                           alt="img"
                           className="object-cover"
                           layout="fill"
                        />
                     </div>
                  )}
               </div>
            </div>
         </div>
      </AdminLayoutDashboard>
   );
};

export default AdminHome;
