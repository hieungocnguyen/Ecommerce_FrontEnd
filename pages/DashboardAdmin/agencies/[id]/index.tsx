/* eslint-disable react/jsx-key */
import { log } from "console";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import API, { endpoints } from "../../../../API";
import AdminLayoutDashboard from "../../../../components/Dashboard/AdminLayoutDashboard";
import Image from "next/image";
import axios from "axios";
import {
   BiLike,
   BiMap,
   BiMessageDetail,
   BiPhone,
   BiRadioCircle,
   BiUser,
} from "react-icons/bi";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {
   CategoryScale,
   LinearScale,
   BarElement,
   Title,
   PointElement,
   LineElement,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import Link from "next/link";
import ConfirmModel from "../../../../components/Model/ConfirmModel";
import toast from "react-hot-toast";
import emptyvector from "../../../../public/empty-box.png";
import Rating from "@mui/material/Rating";

ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.register(
   CategoryScale,
   LinearScale,
   BarElement,
   Title,
   Tooltip,
   Legend,
   LinearScale,
   PointElement,
   LineElement
);

const options = {
   responsive: true,
   plugins: {
      legend: {
         position: "top" as const,
      },
   },
};

const arrayYear = [];
for (let index = 0; index <= 10; index++) {
   arrayYear[index] = new Date().getFullYear() - 10 + index;
}

const AgencyPage = ({ agencyInfo }) => {
   const router = useRouter();
   const id = router.query.id;
   const [agency, setAgency] = useState<any>({});
   const [openTab, setOpenTab] = useState(1);
   const [isOpenConfirmBan, setIsOpenConfirmBan] = useState(false);
   const [isOpenConfirmUnBan, setIsOpenConfirmUnBan] = useState(false);

   const [expireDate, setExpireDate] = useState(0);
   const [countDown, setCountDown] = useState(0);
   const [historyRenewalList, setHistoryRenewalList] = useState<any>([]);
   const [stats, setStats] = useState<any>({});

   const fetchAgency = async () => {
      try {
         const resAgency = await API.get(endpoints["agency_info"](id));
         setAgency(resAgency.data.data);
      } catch (error) {
         console.log(error);
      }
   };

   const fetchRenewal = async () => {
      try {
         const res = await API.get(
            endpoints["get_list_renewal_manager_by_agencyID"](id)
         );
         setExpireDate(res.data.data.expireDate);
         setHistoryRenewalList(res.data.data.renewalOrderSet);
      } catch (error) {
         console.log(error);
      }
   };

   const fetchStat = async () => {
      try {
         const resStats = await API.get(endpoints["stats_agency"](id));
         setStats(resStats.data.data);
         console.log(resStats.data.data);
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      if (id) {
         fetchAgency();
         fetchRenewal();
         fetchStat();
      }
   }, [id]);

   useEffect(() => {
      if (expireDate > 0) {
         setCountDown(expireDate - new Date().getTime());
         const interval = setInterval(() => {
            setCountDown(expireDate - new Date().getTime());
         }, 1000);

         return () => clearInterval(interval);
      }
   }, [expireDate]);

   const handleBanAgency = async () => {
      try {
         const res = await API.patch(endpoints["ban_agency"](id));
         fetchAgency();
         toast.success("Ban merchant successful", { position: "top-center" });
      } catch (error) {
         console.log(error);
      }
   };

   const handleUnbanAgency = async () => {
      try {
         const res = await API.patch(endpoints["unban_agency"](id));
         fetchAgency();
         toast.success("Ban merchant unsuccessful", { position: "top-center" });
      } catch (error) {
         console.log(error);
      }
   };

   return (
      <AdminLayoutDashboard title="Detail">
         <div className="w-[90%] mx-auto my-10">
            <div className="">
               <div className="font-semibold text-2xl">Merchant</div>
               <div className="flex gap-2 mt-2 items-center text-sm font-medium">
                  <div className="opacity-60">Admin Dashboard</div>
                  <BiRadioCircle />
                  <Link href="/DashboardAdmin/agencies">
                     <div className="cursor-pointer">List</div>
                  </Link>
                  <BiRadioCircle />
                  <div className="opacity-60">Merchant</div>
               </div>
            </div>
            <div className="mb-10">
               <div className="grid grid-cols-12 gap-10">
                  <div className="col-span-6 dark:bg-dark-primary bg-light-primary p-6 flex items-end gap-4 rounded-lg">
                     <div className=" relative overflow-hidden w-40 h-40 rounded-2xl ">
                        <Image
                           src={agency.avatar}
                           alt="img"
                           layout="fill"
                           className="object-cover"
                        />
                     </div>
                     <div className="mb-2">
                        <div className="font-semibold text-2xl">
                           {agency.name}
                        </div>
                        <div className="font-medium opacity-80">
                           {agencyInfo.field.name}
                        </div>
                        <div className="text-sm font-medium">
                           Hotline: {agency.hotline}
                        </div>
                        <div className="text-sm font-medium">
                           Address: {agency.address}
                        </div>
                        <div className="flex">
                           <div className="font-medium text-sm">
                              Star average:{" "}
                           </div>
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
                              name="half-rating-read"
                              precision={0.2}
                              value={stats.averageStar}
                              readOnly
                           />
                           <div className="font-medium text-primary-color text-sm">
                              ({stats.averageStar.toFixed(2)})
                           </div>
                        </div>
                        <div className="flex gap-4">
                           <div className="flex gap-2">
                              <div className="font-medium text-sm">
                                 Follower(s):
                              </div>
                              <div className="text-primary-color flex items-center gap-1 font-medium">
                                 <span className="text-sm">
                                    {stats.numOfFollow}
                                 </span>
                                 <BiUser />
                              </div>
                           </div>
                        </div>
                        <div className="flex gap-4">
                           <div className="flex gap-2">
                              <div className="font-medium text-sm">
                                 Like(s):{" "}
                              </div>
                              <div className="text-primary-color flex items-center gap-1 font-medium">
                                 <span className="text-sm">
                                    {stats.numOfLike}
                                 </span>
                                 <BiLike />
                              </div>
                           </div>
                           <div className="flex gap-2">
                              <div className="font-medium text-sm">
                                 Review(s):
                              </div>
                              <div className="text-primary-color flex items-center gap-1 font-medium">
                                 <span className="text-sm">
                                    {stats.numOfComment}
                                 </span>
                                 <BiMessageDetail />
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="col-span-6">
                     <div className="w-full">
                        <div
                           className={`rounded-lg p-6 h-[210px] flex justify-around items-center ${
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
                                          {Math.floor(
                                             countDown / (1000 * 60 * 60 * 24)
                                          )}
                                       </div>
                                       <div className="text-base text-center mt-2 text-light-primary">
                                          Days
                                       </div>
                                    </div>
                                    <div>
                                       <div className="bg-light-primary w-20 py-6 text-center rounded-lg">
                                          {Math.floor(
                                             (countDown %
                                                (1000 * 60 * 60 * 24)) /
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
                                             (countDown % (1000 * 60 * 60)) /
                                                (1000 * 60)
                                          )}
                                       </div>
                                       <div className="text-base text-center mt-2 text-light-primary">
                                          Minutes
                                       </div>
                                    </div>
                                    <div>
                                       <div className="bg-light-primary w-20 py-6 text-center rounded-lg">
                                          {Math.floor(
                                             (countDown % (1000 * 60)) / 1000
                                          )}
                                       </div>
                                       <div className="text-base text-center mt-2 text-light-primary">
                                          Seconds
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           ) : (
                              <div className="text-white font-semibold text-lg ">
                                 Service plan of this merchant has expired
                              </div>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            {/* tabs reveane */}
            <div>
               <div className="font-semibold text-lg">
                  Revenue of this merchant
               </div>
               <div className="">
                  <div className="flex flex-wrap">
                     <div className="w-full">
                        <ul
                           className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row"
                           role="tablist"
                        >
                           <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                              <a
                                 className={
                                    "font-semibold p-3 shadow-lg rounded block leading-normal " +
                                    (openTab === 1
                                       ? "text-white bg-primary-color"
                                       : "dark:bg-dark-primary bg-light-primary")
                                 }
                                 onClick={(e) => {
                                    e.preventDefault();
                                    setOpenTab(1);
                                 }}
                                 data-toggle="tab"
                                 href="#link1"
                                 role="tablist"
                              >
                                 Month by year
                              </a>
                           </li>
                           <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                              <a
                                 className={
                                    "font-semibold p-3 shadow-lg rounded block leading-normal " +
                                    (openTab === 2
                                       ? "text-white bg-primary-color"
                                       : "dark:bg-dark-primary bg-light-primary")
                                 }
                                 onClick={(e) => {
                                    e.preventDefault();
                                    setOpenTab(2);
                                 }}
                                 data-toggle="tab"
                                 href="#link2"
                                 role="tablist"
                              >
                                 Quarter by year
                              </a>
                           </li>
                           <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                              <a
                                 className={
                                    "font-semibold p-3 shadow-lg rounded block leading-normal " +
                                    (openTab === 3
                                       ? "text-white bg-primary-color"
                                       : "dark:bg-dark-primary bg-light-primary")
                                 }
                                 onClick={(e) => {
                                    e.preventDefault();
                                    setOpenTab(3);
                                 }}
                                 data-toggle="tab"
                                 href="#link3"
                                 role="tablist"
                              >
                                 By year
                              </a>
                           </li>
                        </ul>
                        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded">
                           <div className="px-4 py-5 flex-auto">
                              <div className="tab-content tab-space">
                                 <div
                                    className={
                                       openTab === 1 ? "block" : "hidden"
                                    }
                                    id="link1"
                                 >
                                    <div>
                                       <RevenueByMonth
                                          agencyInfoID={agencyInfo.id}
                                       />
                                    </div>
                                 </div>
                                 <div
                                    className={
                                       openTab === 2 ? "block" : "hidden"
                                    }
                                    id="link2"
                                 >
                                    <div>
                                       <RevenueByQuarter
                                          agencyInfoID={agencyInfo.id}
                                       />
                                    </div>
                                 </div>
                                 <div
                                    className={
                                       openTab === 3 ? "block" : "hidden"
                                    }
                                    id="link3"
                                 >
                                    <div>
                                       <RevenueByYear
                                          agencyInfoID={agencyInfo.id}
                                       />
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               <div
                  className={`fixed top-0 right-0 w-full h-screen backdrop-blur-sm items-center justify-center z-20 ${
                     isOpenConfirmBan ? "flex" : "hidden"
                  }`}
               >
                  <div className="w-1/3  h-fit">
                     <ConfirmModel
                        functionConfirm={() => handleBanAgency()}
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
                        functionConfirm={() => handleUnbanAgency()}
                        content={"You will unban this merchant!"}
                        isOpenConfirm={isOpenConfirmUnBan}
                        setIsOpenConfirm={setIsOpenConfirmUnBan}
                     />
                  </div>
               </div>
            </div>
            {/* history renewal */}
            <div className="">
               <div className="font-semibold text-xl my-6">History renewal</div>
               <div className="grid grid-cols-12 text-center mb-2 font-bold">
                  <div className="col-span-3">Order date</div>
                  <div className="col-span-3">Package name</div>
                  <div className="col-span-3">Price</div>
                  <div className="col-span-3">Number of day available</div>
               </div>
               <div
                  className={` overflow-auto ${
                     historyRenewalList.length > 5 ? "h-[500px]" : "h-fit"
                  }`}
               >
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
                                    {new Date(
                                       item.createdDate
                                    ).toLocaleDateString("en-GB")}
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
            <div className="mt-10 w-1/2 mx-auto">
               {agency.isActive == 1 ? (
                  <div
                     className=" bg-red-500 text-white p-4 w-full rounded-lg font-bold text-lg text-center cursor-pointer hover:shadow-lg hover:shadow-red-500"
                     onClick={() => setIsOpenConfirmBan(true)}
                  >
                     Ban this merchant
                  </div>
               ) : (
                  <div
                     className=" bg-primary-color text-white p-4 w-full rounded-lg font-bold text-lg text-center cursor-pointer hover:shadow-lg hover:shadow-primary-color"
                     onClick={() => setIsOpenConfirmUnBan(true)}
                  >
                     Unban this merchant
                  </div>
               )}
            </div>
         </div>
      </AdminLayoutDashboard>
   );
};

export default AgencyPage;

export const getServerSideProps = async (context) => {
   const id = context.params.id;
   const resAgency = await API.get(endpoints["agency_info"](id));
   const agencyInfo = await resAgency.data.data;
   return { props: { agencyInfo } };
};

const RevenueByMonth = ({ agencyInfoID }) => {
   const [yearStatMonth, setYearStatMonth] = useState(2023);
   const [lablesRespondRevenueByMonth, setLablesRespondRevenueByMonth] =
      useState([]);
   const [valuesRespondRevenueByMonth, setValuesRespondRevenueByMonth] =
      useState([]);
   const [dataRevenueByMonth, setDataRevenueByMonth] = useState<any>([]);

   const loadRevenueByMonth = async () => {
      try {
         setLablesRespondRevenueByMonth([]);
         setValuesRespondRevenueByMonth([]);
         const resRevenueByYear = await API.get(
            endpoints["revenue_by_month"](yearStatMonth, agencyInfoID)
         );
         setDataRevenueByMonth(resRevenueByYear.data.data);
         resRevenueByYear.data.data.map((r) => {
            setLablesRespondRevenueByMonth((lablesRespondRevenueByMonth) => [
               ...lablesRespondRevenueByMonth,
               r[0],
            ]);
            setValuesRespondRevenueByMonth((valuesRespondRevenueByMonth) => [
               ...valuesRespondRevenueByMonth,
               r[1],
            ]);
         });
      } catch (error) {
         console.log(error);
      }
   };
   const databyMonth = {
      labels: lablesRespondRevenueByMonth,
      datasets: [
         {
            label: "Revenue",
            data: valuesRespondRevenueByMonth,
            borderColor: "#525EC1",
            backgroundColor: "white",
         },
      ],
   };
   useEffect(() => {
      setLablesRespondRevenueByMonth([]);
      setValuesRespondRevenueByMonth([]);
      loadRevenueByMonth();
   }, []);

   return (
      <>
         <div className="grid grid-cols-12 gap-4">
            <div className="col-span-8 ">
               <div className="dark:bg-dark-primary bg-light-primary rounded-lg p-8">
                  <Line options={options} data={databyMonth} />
               </div>
            </div>
            <div className="col-span-4">
               <div className="flex gap-6 items-center mb-4">
                  <select
                     name=""
                     id=""
                     defaultValue={new Date().getFullYear()}
                     className="p-4 font-medium rounded-lg bg-light-primary dark:bg-dark-primary"
                     onChange={(e) => setYearStatMonth(Number(e.target.value))}
                  >
                     {arrayYear.map((year) => (
                        <option value={year} key={year.id}>
                           {year}
                        </option>
                     ))}
                  </select>
                  <div className="">
                     <button
                        className="bg-primary-color text-white font-semibold py-4 px-6 rounded-lg"
                        onClick={() => {
                           loadRevenueByMonth();
                        }}
                     >
                        Apply selected year
                     </button>
                  </div>
               </div>
               <div className="text-center font-medium">
                  <table className="w-full">
                     <tr className="border-b-2">
                        <td className="border-r-2">Month</td>
                        <td>Revenue</td>
                     </tr>
                     {dataRevenueByMonth.map((item) => (
                        <tr key={item.id} className="border-b-2">
                           <td className="border-r-2">{item[0]}</td>
                           <td className="text-right">
                              {item[1].toLocaleString("it-IT", {
                                 style: "currency",
                                 currency: "VND",
                              })}
                           </td>
                        </tr>
                     ))}
                  </table>
               </div>
            </div>
         </div>
      </>
   );
};

const RevenueByQuarter = ({ agencyInfoID }) => {
   const [lablesRespondRevenueByQuarter, setLablesRespondRevenueByQuarter] =
      useState([]);
   const [valuesRespondRevenueByQuarter, setValuesRespondRevenueByQuarter] =
      useState([]);
   const [dataRevenueByQuarter, setDataRevenueByQuarter] = useState<any>([]);
   const [yearStatQuarter, setYearStatQuarter] = useState(2023);

   const loadRevenueByQuarter = async () => {
      setLablesRespondRevenueByQuarter([]);
      setValuesRespondRevenueByQuarter([]);
      try {
         const resRevenueByQuarter = await API.get(
            endpoints["revenue_by_quarter"](yearStatQuarter, agencyInfoID)
         );
         setDataRevenueByQuarter(resRevenueByQuarter.data.data);
         resRevenueByQuarter.data.data.map((r) => {
            setLablesRespondRevenueByQuarter(
               (lablesRespondRevenueByQuarter) => [
                  ...lablesRespondRevenueByQuarter,
                  r[0],
               ]
            );
            setValuesRespondRevenueByQuarter(
               (valuesRespondRevenueByQuarter) => [
                  ...valuesRespondRevenueByQuarter,
                  r[1],
               ]
            );
         });
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      setLablesRespondRevenueByQuarter([]);
      setValuesRespondRevenueByQuarter([]);
      loadRevenueByQuarter();
   }, []);

   const databyQuarter = {
      labels: lablesRespondRevenueByQuarter,
      datasets: [
         {
            label: "Revenue",
            data: valuesRespondRevenueByQuarter,
            borderColor: "#525EC1",
            backgroundColor: "white",
         },
      ],
   };
   return (
      <>
         <div className="grid grid-cols-12 gap-4">
            <div className="col-span-8 ">
               <div className="dark:bg-dark-primary bg-light-primary rounded-lg p-8">
                  <Line options={options} data={databyQuarter} />
               </div>
            </div>
            <div className="col-span-4">
               <div className="flex gap-6 items-center mb-4">
                  <select
                     name=""
                     id=""
                     defaultValue={new Date().getFullYear()}
                     className="p-4 font-medium rounded-lg bg-light-primary dark:bg-dark-primary"
                     onChange={(e) =>
                        setYearStatQuarter(Number(e.target.value))
                     }
                  >
                     {arrayYear.map((year) => (
                        <option value={year} key={year.id}>
                           {year}
                        </option>
                     ))}
                  </select>
                  <div className="">
                     <button
                        className="bg-primary-color text-white font-semibold py-4 px-6 rounded-lg"
                        onClick={() => loadRevenueByQuarter()}
                     >
                        Apply selected year
                     </button>
                  </div>
               </div>
               <div className="text-center font-medium">
                  <table className="w-full">
                     <tr className="border-b-2">
                        <td className="border-r-2">Quarter</td>
                        <td>Revenue</td>
                     </tr>
                     {dataRevenueByQuarter.map((item) => (
                        <tr key={item.id} className="border-b-2">
                           <td className="border-r-2">{item[0]}</td>
                           <td className="text-right">
                              {item[1].toLocaleString("it-IT", {
                                 style: "currency",
                                 currency: "VND",
                              })}
                           </td>
                        </tr>
                     ))}
                  </table>
               </div>
            </div>
         </div>
      </>
   );
};

const RevenueByYear = ({ agencyInfoID }) => {
   const [lablesRespondRevenueByYear, setLablesRespondRevenueByYear] = useState(
      []
   );
   const [valuesRespondRevenueByYear, setValuesRespondRevenueByYear] = useState(
      []
   );
   const [dataRevenueByYear, setDataRevenueByYear] = useState<any>([]);

   const loadRevenueByYear = async () => {
      try {
         const resRevenueByYear = await API.get(
            endpoints["revenue_by_year"](agencyInfoID)
         );
         setDataRevenueByYear(resRevenueByYear.data.data);
         resRevenueByYear.data.data.map((r) => {
            setLablesRespondRevenueByYear((lablesRespondRevenueByYear) => [
               ...lablesRespondRevenueByYear,
               r[0],
            ]);
            setValuesRespondRevenueByYear((valuesRespondRevenueByYear) => [
               ...valuesRespondRevenueByYear,
               r[1],
            ]);
         });
      } catch (error) {
         console.log(error);
      }
   };
   const databyYear = {
      labels: lablesRespondRevenueByYear,
      datasets: [
         {
            label: "Revenue",
            data: valuesRespondRevenueByYear,

            backgroundColor: "#525EC1",
         },
      ],
   };
   useEffect(() => {
      setLablesRespondRevenueByYear([]);
      setValuesRespondRevenueByYear([]);
      loadRevenueByYear();
   }, []);
   return (
      <>
         <div className="grid grid-cols-12 gap-4">
            <div className="col-span-8 ">
               <div className="dark:bg-dark-primary bg-light-primary rounded-lg p-8">
                  <Bar options={options} data={databyYear} />
               </div>
            </div>
            <div className="col-span-4">
               <div className="text-center font-medium">
                  <table className="w-full">
                     <tr className="border-b-2">
                        <td className="border-r-2">Year</td>
                        <td>Revenue</td>
                     </tr>
                     {dataRevenueByYear.map((item) => (
                        <tr key={item.id} className="border-b-2">
                           <td className="border-r-2">{item[0]}</td>
                           <td className="text-right">
                              {item[1].toLocaleString("it-IT", {
                                 style: "currency",
                                 currency: "VND",
                              })}
                           </td>
                        </tr>
                     ))}
                  </table>
               </div>
            </div>
         </div>
      </>
   );
};
