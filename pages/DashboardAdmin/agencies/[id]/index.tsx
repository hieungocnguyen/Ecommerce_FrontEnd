/* eslint-disable react/jsx-key */
import { log } from "console";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import API, { endpoints } from "../../../../API";
import AdminLayoutDashboard from "../../../../components/Dashboard/AdminLayoutDashboard";
import Image from "next/image";
import axios from "axios";
import { BiMap, BiPhone, BiRadioCircle } from "react-icons/bi";
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

const AgencyPage = ({ agencyInfo }) => {
   const router = useRouter();
   const id = router.query.id;
   const [agency, setAgency] = useState<any>({});
   const [openTab, setOpenTab] = useState(1);
   const [countPosts, setCountPosts] = useState(0);
   const [countOrders, setCountOrders] = useState(0);
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

      loadCount();
      loadRevenueByYear();
      loadRevenueByMonth();
      loadRevenueByQuarter();
   }, []);

   useEffect(() => {
      const fetchAgency = async () => {
         const resAgency = await API.get(endpoints["agency_info"](id));
         setAgency(resAgency.data.data);
      };
      if (id) {
         fetchAgency();
      }
   }, [id]);

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

   const handleBanAgency = async () => {
      const res = await API.patch(endpoints["ban_agency"](id));
   };

   const handleUnbanAgency = async () => {
      const res = await API.patch(endpoints["unban_agency"](id));
   };

   return (
      <AdminLayoutDashboard>
         <div className="w-[90%] mx-auto">
            <div className="my-10">
               <div className="font-semibold text-2xl">Agency</div>
               <div className="flex gap-2 mt-2 items-center text-sm font-medium">
                  <div className="opacity-60">Admin Dashboard</div>
                  <BiRadioCircle />
                  <Link href="/DashboardAdmin/agencies">
                     <div className="cursor-pointer">List</div>
                  </Link>
                  <BiRadioCircle />
                  <div className="opacity-60">Agency</div>
               </div>
            </div>
            <div className="mb-10">
               <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-6 bg-dark-primary p-6 flex items-end gap-4 rounded-lg">
                     <div className=" relative overflow-hidden w-40 h-40 rounded-2xl ">
                        <Image src={agency.avatar} alt="" layout="fill" />
                     </div>
                     <div className="mb-4">
                        <div className="font-semibold text-2xl">
                           {agency.name}
                        </div>
                        <div className="font-medium opacity-80">
                           {agencyInfo.field.name}
                        </div>
                     </div>
                  </div>
                  <div className="col-span-6 grid grid-flow-row grid-rows-2">
                     <div className="bg-dark-primary rounded-lg p-6 row-span-1">
                        <div className="flex gap-2 items-center font-medium mb-2">
                           <BiPhone className="text-xl" />
                           Hotline {agency.hotline}
                        </div>
                        <div className="flex gap-2 items-center font-medium">
                           <BiMap className="text-xl" /> Address{" "}
                           {agency.address}
                        </div>
                     </div>
                     <div className=" row-span-1 flex justify-center items-center">
                        {agency.isActive == 1 ? (
                           <div
                              className=" bg-[#ff5630] text-[#ffe4d6] p-4 w-full rounded-lg font-bold text-lg text-center cursor-pointer"
                              onClick={handleBanAgency}
                           >
                              Ban {agency.name}
                           </div>
                        ) : (
                           <div
                              className=" bg-[#37d571] text-[#e5ffd6] p-4 w-full rounded-lg font-bold text-lg text-center cursor-pointer"
                              onClick={handleUnbanAgency}
                           >
                              Unban {agency.name}
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            </div>
            {/* tabs reveane */}
            <div className="font-semibold text-xl">Revenue</div>
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
                                 className={openTab === 1 ? "block" : "hidden"}
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
                                 className={openTab === 2 ? "block" : "hidden"}
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
                                 className={openTab === 3 ? "block" : "hidden"}
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
      </AdminLayoutDashboard>
   );
};

export default AgencyPage;

export const getStaticProps = async (context) => {
   const id = context.params.id;
   const resAgency = await API.get(endpoints["agency_info"](id));
   const agencyInfo = await resAgency.data.data;
   return { props: { agencyInfo } };
};
export async function getStaticPaths() {
   if (process.env.SKIP_BUILD_STATIC_GENERATION) {
      return {
         paths: [],
         fallback: "blocking",
      };
   }
   const res = await axios.get(
      "http://localhost:8080/ou-ecommerce/api/agency/all"
   );
   const agencys = await res.data.data;
   const paths = agencys.map((agency) => ({
      params: { id: agency.id.toString() },
   }));
   return {
      paths,
      fallback: false, // can also be true or 'blocking'
   };
}
