import { useContext, useEffect, useState } from "react";
import API, { endpoints } from "../../API";
import LayoutDashboard from "../../components/Dashboard/LayoutDashboardManager";
import { Store } from "../../utils/Store";
import dynamic from "next/dynamic";
import Image from "next/image";
import emptyBox from "../../public/empty-box.png";
import Link from "next/link";
import { Bar } from "react-chartjs-2";
import {
   Chart as ChartJS,
   CategoryScale,
   LinearScale,
   BarElement,
   Title,
   Tooltip,
   Legend,
} from "chart.js";
import Rating from "@mui/material/Rating";
ChartJS.register(
   CategoryScale,
   LinearScale,
   BarElement,
   Title,
   Tooltip,
   Legend
);

const options = {
   responsive: true,
   plugins: {
      legend: {
         position: "top" as const,
      },
   },
};

const AgencyHome = () => {
   const { state } = useContext(Store);
   const { agencyInfo } = state;
   const [countPosts, setCountPosts] = useState(0);
   const [countOrders, setCountOrders] = useState(0);
   const [countFollow, setCountFollow] = useState(0);
   const [itemsHot, setItemsHot] = useState<any>([]);
   const [items, setItems] = useState<any>([]);
   const [dataStatItem, setDataStatItem] = useState([]);
   const [numberTop, setNumberTop] = useState(4);
   const [stats, setStats] = useState<any>({});
   const [star, setStar] = useState(0);

   const loadCount = async () => {
      try {
         const resPosts = await API.get(
            endpoints["get_all_post_by_agencyID"](agencyInfo.id)
         );
         setCountPosts(resPosts.data.data.length);

         const resOrders = await API.get(
            endpoints["order_agency"](agencyInfo.id)
         );
         setCountOrders(resOrders.data.data.length);

         const resFollow = await API.get(
            endpoints["count_follow_agency"](agencyInfo.id)
         );
         setCountFollow(resFollow.data.data);
      } catch (error) {
         console.log(error);
      }
   };

   const fetchStats = async () => {
      try {
         const resStats = await API.get(
            endpoints["stats_agency"](agencyInfo.id)
         );
         setStats(resStats.data.data);
         setStar(resStats.data.data.averageStar);
      } catch (error) {
         console.log(error);
      }
   };
   const fetchData = async () => {
      try {
         setItems([]);
         setDataStatItem([]);
         const res = await API.get(
            endpoints["item_best_seller_by_agency"](numberTop, agencyInfo.id)
         );
         res.data.data.map((item) => {
            setItems((items) => [...items, item[2]]);
            setDataStatItem((dataStatItem) => [...dataStatItem, item[4]]);
         });
      } catch (error) {
         console.log(error);
      }
   };

   const fetchHotItems = async () => {
      try {
         const res = await API.get(
            endpoints["item_best_seller_by_agency"](4, agencyInfo?.id)
         );
         setItemsHot(res.data.data);
      } catch (error) {
         console.log(error);
      }
   };
   useEffect(() => {
      loadCount();
      fetchStats();
      fetchHotItems();
      fetchData();
   }, [agencyInfo]);

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

   return (
      <>
         <LayoutDashboard title="Homepage">
            <div className=" mx-auto my-8">
               <div className="grid grid-cols-12 gap-8 h-24">
                  <div className="col-span-7 bg-light-primary rounded-lg p-6">
                     <div className="font-semibold text-xl">
                        Hi {agencyInfo ? agencyInfo.name : ""}!
                     </div>
                     <div>
                        {agencyInfo && agencyInfo.isActive === 0 ? (
                           <>
                              <div className="text-xl font-semibold text-red-600">
                                 Your merchant has banned!
                              </div>
                           </>
                        ) : (
                           <></>
                        )}
                     </div>
                  </div>
                  <div className="col-span-5 bg-light-primary rounded-lg relative">
                     {agencyInfo && (
                        <div className="relative w-full h-full rounded-lg overflow-hidden opacity-20">
                           <Image
                              src={agencyInfo?.avatar}
                              alt=""
                              layout="fill"
                              className="object-cover"
                           />
                        </div>
                     )}
                  </div>
               </div>
               <div className="grid grid-cols-5 gap-8 mt-6 h-24">
                  <div className="dark:bg-dark-primary bg-light-primary flex flex-col justify-center items-center  rounded-lg text-xl font-semibold">
                     <div>Average star</div>
                     <div className="flex gap-1 justify-center">
                        <Rating
                           size="small"
                           sx={{
                              "& .MuiRating-iconFilled": {
                                 color: "#2065d1",
                              },
                              "& .MuiRating-iconEmpty": {
                                 color: "#2065d1",
                              },
                           }}
                           precision={0.5}
                           value={star}
                           // value={stats.averageStar?.toFixed(2)}
                           readOnly
                        />
                        <div className="font-medium text-primary-color text-sm">
                           ({stats.averageStar?.toFixed(2)}/5)
                        </div>
                     </div>
                  </div>
                  <div className="dark:bg-dark-primary bg-light-primary grid grid-cols-3 items-center  rounded-lg text-lg font-medium px-2">
                     <div className="relative overflow-hidden w-2/3 aspect-square mx-auto">
                        <Image
                           src="https://res.cloudinary.com/ngnohieu/image/upload/v1685823927/thumb-up_litsz7.png"
                           alt="img"
                           layout="fill"
                           className="object-cover"
                        />
                     </div>
                     <div className="col-span-2">
                        <div>Like(s)</div>
                        <div className="text-xl text-primary-color">
                           {stats.numOfLike}
                        </div>
                     </div>
                  </div>
                  <div className="dark:bg-dark-primary bg-light-primary grid grid-cols-3 items-center  rounded-lg text-lg font-medium px-2">
                     <div className="relative overflow-hidden w-2/3 aspect-square mx-auto">
                        <Image
                           src="https://res.cloudinary.com/ngnohieu/image/upload/v1685823927/follow_ujed1n.png"
                           alt="img"
                           layout="fill"
                           className="object-cover"
                        />
                     </div>
                     <div className="col-span-2">
                        <div>Follower(s)</div>
                        <div className="text-xl text-primary-color">
                           {stats.numOfFollow}
                        </div>
                     </div>
                  </div>
                  <div className="dark:bg-dark-primary bg-light-primary grid grid-cols-3 items-center  rounded-lg text-lg font-medium px-2">
                     <div className="relative overflow-hidden w-2/3 aspect-square mx-auto">
                        <Image
                           src="https://res.cloudinary.com/ngnohieu/image/upload/v1685823927/shelves_nyzik1.png"
                           alt="img"
                           layout="fill"
                           className="object-cover"
                        />
                     </div>
                     <div className="col-span-2">
                        <div>Product(s)</div>
                        <div className="text-xl text-primary-color">
                           {countPosts}
                        </div>
                     </div>
                  </div>
                  <div className="dark:bg-dark-primary bg-light-primary grid grid-cols-3 items-center  rounded-lg text-lg font-medium px-2">
                     <div className="relative overflow-hidden w-2/3 aspect-square mx-auto">
                        <Image
                           src="https://res.cloudinary.com/ngnohieu/image/upload/v1685823928/shopping_szg7a4.png"
                           alt="img"
                           layout="fill"
                           className="object-cover"
                        />
                     </div>
                     <div className="col-span-2">
                        <div>Order(s)</div>
                        <div className="text-xl text-primary-color">
                           {countOrders}
                        </div>
                     </div>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="text-center text-xl font-semibold col-span-2">
                        Hot Items
                     </div>
                     {itemsHot.length > 0 &&
                        itemsHot.map((item) => (
                           <Link
                              href={`/sale_post/${item[1].id}`}
                              key={item.id}
                           >
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
                  <div className="">
                     <div className="text-center text-xl font-semibold col-span-2 mb-4">
                        Statistical Hot Items
                     </div>
                     <div className="dark:bg-dark-primary bg-light-primary rounded-lg p-8">
                        <Bar options={options} data={data} />
                     </div>
                  </div>
               </div>
            </div>
         </LayoutDashboard>
      </>
   );
};

// export default AgencyHome;
export default dynamic(() => Promise.resolve(AgencyHome), { ssr: false });
