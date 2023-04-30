import { Bar, Line } from "react-chartjs-2";
import LayoutDashboardManager from "../../../components/Dashboard/LayoutDashboardManager";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {
   CategoryScale,
   LinearScale,
   BarElement,
   Title,
   PointElement,
   LineElement,
} from "chart.js";
import { useContext, useEffect, useState } from "react";
import API, { endpoints } from "../../../API";
import { Store } from "../../../utils/Store";
import dynamic from "next/dynamic";

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

const Revenue = () => {
   const [openTab, setOpenTab] = useState(1);
   const { state, dispatch } = useContext(Store);
   const { agencyInfo } = state;

   return (
      <LayoutDashboardManager title="Revenue Stat">
         <div className="w-[90%] mx-auto mt-10">
            <div className="font-semibold text-xl my-4">
               Statistical revenue
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
                                       {agencyInfo && (
                                          <RevenueByMonth
                                             agencyInfoID={agencyInfo.id}
                                          />
                                       )}
                                    </div>
                                 </div>
                                 <div
                                    className={
                                       openTab === 2 ? "block" : "hidden"
                                    }
                                    id="link2"
                                 >
                                    <div>
                                       {agencyInfo && (
                                          <RevenueByQuarter
                                             agencyInfoID={agencyInfo.id}
                                          />
                                       )}
                                    </div>
                                 </div>
                                 <div
                                    className={
                                       openTab === 3 ? "block" : "hidden"
                                    }
                                    id="link3"
                                 >
                                    <div>
                                       {agencyInfo && (
                                          <RevenueByYear
                                             agencyInfoID={agencyInfo.id}
                                          />
                                       )}
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </LayoutDashboardManager>
   );
};

// export default Revenue;
export default dynamic(() => Promise.resolve(Revenue), { ssr: false });

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
