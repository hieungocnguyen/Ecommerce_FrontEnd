/* eslint-disable react/jsx-key */
/* eslint-disable react-hooks/exhaustive-deps */
import { SyntheticEvent, useContext, useEffect, useState } from "react";
import API, { endpoints } from "../../API";
import LayoutDashboard from "../../components/Dashboard/LayoutDashboardManager";
import { Store } from "../../utils/Store";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {
   CategoryScale,
   LinearScale,
   BarElement,
   Title,
   PointElement,
   LineElement,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Bar, Line } from "react-chartjs-2";

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

const AgencyHome = () => {
   const { state, dispatch } = useContext(Store);
   const { userInfo, agencyInfo } = state;
   const [countPosts, setCountPosts] = useState(0);
   const [countOrders, setCountOrders] = useState(0);
   const [dataStatCategory, setDataStatCategory] = useState([]);
   const [category, setCategory] = useState([]);
   const [respondCateStat, setRespondCateStat] = useState([]);
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
      setCategory([]);
      setDataStatCategory([]);
      setRespondCateStat([]);
      setLablesRespondRevenueByYear([]);
      setValuesRespondRevenueByYear([]);
      setLablesRespondRevenueByMonth([]);
      setValuesRespondRevenueByMonth([]);
      setLablesRespondRevenueByQuarter([]);
      setValuesRespondRevenueByQuarter([]);

      const loadCount = async () => {
         const resPosts = await API.post(endpoints["search_salePost"], {
            nameOfAgency: agencyInfo.name,
         });
         setCountPosts(resPosts.data.data.listResult.length);
         const resOrders = await API.get(
            endpoints["order_agency"](agencyInfo.id)
         );
         setCountOrders(resOrders.data.data.length);
      };
      const loadDataCate = async () => {
         const resDataCate = await API.get(endpoints["stat_post_category"]);
         resDataCate.data.data.map((c) => {
            setCategory((category) => [...category, c[0]]);
            setDataStatCategory((dataStatCategory) => [
               ...dataStatCategory,
               c[1],
            ]);
         });
         setRespondCateStat(resDataCate.data.data);
      };
      const loadRevenueByYear = async () => {
         const resRevenueByYear = await API.get(
            endpoints["revenue_by_year"](agencyInfo.id)
         );
         console.log(resRevenueByYear.data.data);

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
         console.log(resRevenueByYear.data.data);

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

      loadCount();
      loadDataCate();
      loadRevenueByYear();
      loadRevenueByMonth();
      loadRevenueByQuarter();
   }, []);

   const dataCate = {
      labels: category,
      datasets: [
         {
            label: "Number post",
            data: dataStatCategory,
            backgroundColor: [
               "rgba(255, 99, 132, 0.2)",
               "rgba(54, 162, 235, 0.2)",
               "rgba(255, 206, 86, 0.2)",
               "rgba(75, 192, 192, 0.2)",
               "rgba(153, 102, 255, 0.2)",
               "rgba(255, 159, 64, 0.2)",
               "rgba(255, 159, 64, 0.2)",
               "rgba(75, 192, 192, 0.2)",
               "rgba(153, 102, 255, 0.2)",
               "rgba(255, 159, 150, 0.2)",
               "rgba(14, 159, 64, 0.2)",
               "rgba(153, 102, 255, 0.2)",
               "rgba(255, 159, 150, 0.2)",
               "rgba(14, 159, 64, 0.2)",
            ],
            borderColor: [
               "rgba(255, 99, 132, 1)",
               "rgba(54, 162, 235, 1)",
               "rgba(255, 206, 86, 1)",
               "rgba(75, 192, 192, 1)",
               "rgba(153, 102, 255, 1)",
               "rgba(255, 159, 64, 1)",
               "rgba(255, 159, 64, 1)",
               "rgba(75, 192, 192, 1)",
               "rgba(153, 102, 255, 1)",
               "rgba(255, 159, 150, 1)",
               "rgba(14, 159, 64, 1)",
               "rgba(153, 102, 255, 1)",
               "rgba(255, 159, 150, 1)",
               "rgba(14, 159, 64, 1)",
            ],
            borderWidth: 2,
         },
      ],
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
   const options = {
      responsive: true,
      plugins: {
         legend: {
            position: "top" as const,
         },
      },
   };
   return (
      <>
         <LayoutDashboard>
            <div className="w-[90%] mx-auto">
               <div>
                  <div className="font-semibold text-2xl my-10">
                     Hi {agencyInfo ? agencyInfo.name : ""}, Welcome back!
                  </div>
                  <div className="grid grid-cols-3 gap-8 mt-10">
                     <div className="bg-neutral-800 flex flex-col justify-center items-center h-32 rounded-lg text-2xl font-semibold">
                        <div>Follow</div>
                        <div>0</div>
                     </div>
                     <div className="bg-neutral-800 flex flex-col justify-center items-center h-32 rounded-lg text-2xl font-semibold">
                        <div>Post</div>
                        <div>{countPosts}</div>
                     </div>
                     <div className="bg-neutral-800 flex flex-col justify-center items-center h-32 rounded-lg text-2xl font-semibold">
                        <div>Order</div>
                        <div>{countOrders}</div>
                     </div>
                  </div>
               </div>
               <div className="my-8">
                  <div className="font-semibold text-2xl my-10">
                     Statistical
                  </div>
                  <div>
                     <div className="font-semibold text-xl my-4">
                        Statistical by category
                     </div>
                     <div className="grid grid-cols-5 gap-4">
                        <div className="col-span-3 bg-dark-primary rounded-lg p-8">
                           <Doughnut data={dataCate} />
                        </div>
                        <div className="col-span-2 bg-dark-primary rounded-lg p-8">
                           <div className="grid grid-cols-3 font-semibold text-lg border-b-2 pb-2">
                              <div className="col-span-2">Category</div>
                              <div className="">Posts</div>
                           </div>
                           <div className="">
                              {respondCateStat.map((c) => (
                                 <div
                                    key={c[0]}
                                    className="py-2 grid grid-cols-3 border-b-2 "
                                 >
                                    <div className="col-span-2">{c[0]}</div>
                                    <div className="">{c[1]}</div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>
                  <div>
                     <div className="font-semibold text-xl my-4">
                        Statistical revenue
                     </div>
                     <div>
                        <div className="font-semibold my-4">
                           Revenue by year
                        </div>
                        <div className="grid grid-cols-5 gap-4">
                           <div className="col-span-3 bg-dark-primary rounded-lg p-8">
                              <Bar options={options} data={databyYear} />
                           </div>
                           <div className=" col-span-2 grid grid-cols-2 bg-dark-primary rounded-lg p-8 ">
                              <div className="">
                                 <div className="text-lg font-semibold">
                                    Year
                                 </div>
                                 {lablesRespondRevenueByYear.map((l) => (
                                    <div className="pb-3 border-b-2">{l}</div>
                                 ))}
                              </div>
                              <div className="">
                                 <div className="text-lg font-semibold">
                                    Revenue
                                 </div>
                                 {valuesRespondRevenueByYear.map((l) => (
                                    <div className="pb-3 border-b-2">
                                       {l.toLocaleString("en-US", {
                                          style: "currency",
                                          currency: "VND",
                                       })}
                                    </div>
                                 ))}
                              </div>
                           </div>
                        </div>
                     </div>
                     <div>
                        <div className="font-semibold my-4">
                           Revenue month by year
                        </div>
                        <div className="grid grid-cols-5 gap-4">
                           <div className="col-span-3 bg-dark-primary rounded-lg p-8">
                              <Line options={options} data={databyMonth} />
                           </div>
                           <div className=" col-span-2 grid grid-cols-2 bg-dark-primary rounded-lg p-8">
                              <div className="">
                                 <div className="text-lg font-semibold">
                                    Year
                                 </div>
                                 {lablesRespondRevenueByMonth.map((l) => (
                                    <div className="pb-2 border-b-2">{l}</div>
                                 ))}
                              </div>
                              <div className="font-semiboldpb-2">
                                 <div className="text-lg font-semibold">
                                    Revenue
                                 </div>
                                 {valuesRespondRevenueByMonth.map((l) => (
                                    <div className="pb-2 border-b-2">
                                       {l.toLocaleString("en-US", {
                                          style: "currency",
                                          currency: "VND",
                                       })}
                                    </div>
                                 ))}
                              </div>
                           </div>
                        </div>
                     </div>
                     <div>
                        <div className="font-semibold my-4">
                           Revenue quarter by year
                        </div>
                        <div className="grid grid-cols-5 gap-4">
                           <div className="col-span-3 bg-dark-primary rounded-lg p-8">
                              <Line options={options} data={databyQuarter} />
                           </div>
                           <div className=" col-span-2 grid grid-cols-2 bg-dark-primary rounded-lg p-8">
                              <div className="">
                                 <div className="text-lg font-semibold">
                                    Quarter (2022)
                                 </div>
                                 {lablesRespondRevenueByQuarter.map((l) => (
                                    <div className="pb-2 border-b-2">{l}</div>
                                 ))}
                              </div>
                              <div className="font-semiboldpb-2">
                                 <div className="text-lg font-semibold">
                                    Revenue
                                 </div>
                                 {valuesRespondRevenueByQuarter.map((l) => (
                                    <div className="pb-2 border-b-2 ">
                                       {l.toLocaleString("en-US", {
                                          style: "currency",
                                          currency: "VND",
                                       })}
                                    </div>
                                 ))}
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </LayoutDashboard>
      </>
   );
};

export default AgencyHome;
