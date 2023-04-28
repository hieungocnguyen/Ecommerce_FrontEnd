import { useContext, useEffect, useState } from "react";
import AdminLayoutDashboard from "../../../components/Dashboard/AdminLayoutDashboard";
import API, { endpoints } from "../../../API";
import dynamic from "next/dynamic";
import { Store } from "../../../utils/Store";
import { Bar, Line, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import emptyvector from "../../../public/empty-box.png";
import Image from "next/image";

import {
   CategoryScale,
   LinearScale,
   BarElement,
   Title,
   PointElement,
   LineElement,
} from "chart.js";
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

const Renewal = () => {
   const [openTab, setOpenTab] = useState(1);
   const [historyRenewalList, setHistoryRenewalList] = useState<any>([]);

   const fetchRenewal = async () => {
      try {
         const res = await API.get(endpoints["get_all_renewal"]);
         setHistoryRenewalList(res.data.data);
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      fetchRenewal();
   }, []);

   return (
      <AdminLayoutDashboard title="Statistical Renewal">
         <div className="w-[90%] mx-auto my-10">
            <div className="font-semibold text-xl my-4">
               Statistical renewal
            </div>
            <div>
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
                                       ? "text-white bg-blue-main"
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
                                       ? "text-white bg-blue-main"
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
                                       ? "text-white bg-blue-main"
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
                                       <RevenueByMonth />
                                    </div>
                                 </div>
                                 <div
                                    className={
                                       openTab === 2 ? "block" : "hidden"
                                    }
                                    id="link2"
                                 >
                                    <div>
                                       <RevenueByQuarter />
                                    </div>
                                 </div>
                                 <div
                                    className={
                                       openTab === 3 ? "block" : "hidden"
                                    }
                                    id="link3"
                                 >
                                    <div>
                                       <RevenueByYear />
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div className="">
               <div className="font-semibold text-xl my-6">History renewal</div>
               <div className="grid grid-cols-12 px-6 py-2 font-bold">
                  <div className="col-span-2">Order date</div>
                  <div className="col-span-3">Agency</div>
                  <div className="col-span-3">Package name</div>
                  <div className="col-span-2">Price</div>
                  <div className="col-span-2">Number day available</div>
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
                                 className="grid grid-cols-12 font-medium mb-4 bg-light-primary dark:bg-dark-primary rounded-lg p-6 items-center"
                              >
                                 <div className="col-span-2">
                                    {new Date(
                                       item.createdDate
                                    ).toLocaleDateString("en-GB")}
                                 </div>
                                 <div className="col-span-3 flex gap-3 items-center">
                                    <div className="relative overflow-hidden w-12 aspect-square rounded-xl">
                                       <Image
                                          src={item.renewalManage.agency.avatar}
                                          alt="avt"
                                          layout="fill"
                                          className="object-cover"
                                       />
                                    </div>
                                    <div className="">
                                       {item.renewalManage.agency.name}
                                    </div>
                                 </div>
                                 <div className="col-span-3">
                                    {item.renewalPackage.packageName}
                                 </div>
                                 <div className="col-span-2">
                                    {item.price.toLocaleString("it-IT", {
                                       style: "currency",
                                       currency: "VND",
                                    })}
                                 </div>
                                 <div className="col-span-2 text-blue-main font-bold">
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
         </div>
      </AdminLayoutDashboard>
   );
};

// export default Renewal;
export default dynamic(() => Promise.resolve(Renewal), { ssr: false });

const RevenueByMonth = () => {
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
            endpoints["stat_renewal_by_month"](yearStatMonth)
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
            label: "Renewal",
            data: valuesRespondRevenueByMonth,
            borderColor: ["#F45050"],
            backgroundColor: ["#F45050"],
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
                        className="bg-blue-main text-white font-semibold py-4 px-6 rounded-lg"
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

const RevenueByQuarter = () => {
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
            endpoints["stat_renewal_by_quarter"](yearStatQuarter)
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
            label: "Renewal",
            data: valuesRespondRevenueByQuarter,
            borderColor: ["#ff9f1c", "#e71d36", "#662e9b", "#00509d"],
            backgroundColor: ["#ff9f1c", "#e71d36", "#662e9b", "#00509d"],
         },
      ],
   };
   return (
      <>
         <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
               <div className="dark:bg-dark-primary bg-light-primary rounded-lg p-8">
                  <Pie options={options} data={databyQuarter} />
               </div>
            </div>
            <div className="col-span-6">
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
                        className="bg-blue-main text-white font-semibold py-4 px-6 rounded-lg"
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

const RevenueByYear = () => {
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
            endpoints["stat_renewal_by_year"]
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
            label: "Renewal",
            data: valuesRespondRevenueByYear,
            borderColor: ["#ff9f1c", "#e71d36", "#662e9b", "#00509d"],
            backgroundColor: ["#ff9f1c", "#e71d36", "#662e9b", "#00509d"],
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
