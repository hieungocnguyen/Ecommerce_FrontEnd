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

const Revenue = () => {
   const [openTab, setOpenTab] = useState(1);
   const { state, dispatch } = useContext(Store);
   const { agencyInfo } = state;
   const [lablesRespondRevenueByYear, setLablesRespondRevenueByYear] = useState(
      []
   );
   const [valuesRespondRevenueByYear, setValuesRespondRevenueByYear] = useState(
      []
   );
   const [lablesRespondRevenueByMonth, setLablesRespondRevenueByMonth] =
      useState([]);
   const [valuesRespondRevenueByMonth, setValuesRespondRevenueByMonth] =
      useState([]);
   const [lablesRespondRevenueByQuarter, setLablesRespondRevenueByQuarter] =
      useState([]);
   const [valuesRespondRevenueByQuarter, setValuesRespondRevenueByQuarter] =
      useState([]);
   const [yearStatMonth, setYearStatMonth] = useState(2022);
   const [yearStatQuarter, setYearStatQuarter] = useState(2022);

   useEffect(() => {
      setLablesRespondRevenueByYear([]);
      setValuesRespondRevenueByYear([]);
      setLablesRespondRevenueByMonth([]);
      setValuesRespondRevenueByMonth([]);
      setLablesRespondRevenueByQuarter([]);
      setValuesRespondRevenueByQuarter([]);

      const loadRevenueByYear = async () => {
         const resRevenueByYear = await API.get(
            endpoints["revenue_by_year"](agencyInfo.id)
         );

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
      };
      const loadRevenueByMonth = async () => {
         const resRevenueByYear = await API.get(
            endpoints["revenue_by_month"](yearStatMonth, agencyInfo.id)
         );

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
      };
      const loadRevenueByQuarter = async () => {
         const resRevenueByQuarter = await API.get(
            endpoints["revenue_by_quarter"](yearStatQuarter, agencyInfo.id)
         );
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
      };
   }, []);
   const options = {
      responsive: true,
      plugins: {
         legend: {
            position: "top" as const,
         },
      },
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
                                       ? "text-white bg-blue-main"
                                       : "text-white bg-dark-spot")
                                 }
                                 onClick={(e) => {
                                    e.preventDefault();
                                    setOpenTab(1);
                                 }}
                                 data-toggle="tab"
                                 href="#link1"
                                 role="tablist"
                              >
                                 By year
                              </a>
                           </li>
                           <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                              <a
                                 className={
                                    "font-semibold p-3 shadow-lg rounded block leading-normal " +
                                    (openTab === 2
                                       ? "text-white bg-blue-main"
                                       : "text-white bg-dark-spot")
                                 }
                                 onClick={(e) => {
                                    e.preventDefault();
                                    setOpenTab(2);
                                 }}
                                 data-toggle="tab"
                                 href="#link2"
                                 role="tablist"
                              >
                                 Month by year
                              </a>
                           </li>
                           <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                              <a
                                 className={
                                    "font-semibold p-3 shadow-lg rounded block leading-normal " +
                                    (openTab === 3
                                       ? "text-white bg-blue-main"
                                       : "text-white bg-dark-spot")
                                 }
                                 onClick={(e) => {
                                    e.preventDefault();
                                    setOpenTab(3);
                                 }}
                                 data-toggle="tab"
                                 href="#link3"
                                 role="tablist"
                              >
                                 Quarter by year
                              </a>
                           </li>
                        </ul>
                        <div className="relative flex flex-col min-w-0 break-words bg-dark-primary w-full mb-6 shadow-lg rounded">
                           <div className="px-4 py-5 flex-auto">
                              <div className="tab-content tab-space">
                                 <div
                                    className={
                                       openTab === 1 ? "block" : "hidden"
                                    }
                                    id="link1"
                                 >
                                    <div>
                                       <div className="">
                                          <div className="dark:bg-dark-primary bg-light-primary rounded-lg p-8">
                                             <Bar
                                                options={options}
                                                data={databyYear}
                                             />
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                                 <div
                                    className={
                                       openTab === 2 ? "block" : "hidden"
                                    }
                                    id="link2"
                                 >
                                    <div>
                                       <div className=" gap-4">
                                          <div className="dark:bg-dark-primary bg-light-primary rounded-lg p-8">
                                             <Line
                                                options={options}
                                                data={databyMonth}
                                             />
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                                 <div
                                    className={
                                       openTab === 3 ? "block" : "hidden"
                                    }
                                    id="link3"
                                 >
                                    <div>
                                       <div className="gap-4">
                                          <div className="dark:bg-dark-primary bg-light-primary rounded-lg p-8">
                                             <Line
                                                options={options}
                                                data={databyQuarter}
                                             />
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
            </div>
         </div>
      </LayoutDashboardManager>
   );
};

export default Revenue;
