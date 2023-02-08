import { log } from "console";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import API, { endpoints } from "../../../../API";
import AdminLayoutDashboard from "../../../../components/Dashboard/AdminLayoutDashboard";
import Image from "next/image";
import axios from "axios";
import { BiMap, BiPhone } from "react-icons/bi";

const AgencyPage = ({ agencyInfo }) => {
   const router = useRouter();
   const id = router.query.id;
   const [agency, setAgency] = useState<any>({});
   const [openTab, setOpenTab] = useState(1);
   const color = "red";

   useEffect(() => {
      const fetchAgency = async () => {
         const resAgency = await API.get(endpoints["agency_info"](id));
         setAgency(resAgency.data.data);
      };
      if (id) {
         fetchAgency();
      }
   }, [id]);
   return (
      <AdminLayoutDashboard>
         <div className="w-[90%] mx-auto">
            <div className="flex justify-between my-10">
               <div className="font-semibold text-2xl">Agency</div>
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
                        <div className=" bg-[#ff5630] text-[#ffe4d6] p-4 w-full rounded-lg font-bold text-center cursor-pointer">
                           Ban {agency.name}
                        </div>
                     </div>
                  </div>
               </div>
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
                              Profile
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
                              Settings
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
                              Options
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
                                 <p>
                                    Collaboratively administrate empowered
                                    markets via plug-and-play networks.
                                    Dynamically procrastinate B2C users after
                                    installed base benefits.
                                    <br />
                                    <br /> Dramatically visualize customer
                                    directed convergence without revolutionary
                                    ROI.
                                 </p>
                              </div>
                              <div
                                 className={openTab === 2 ? "block" : "hidden"}
                                 id="link2"
                              >
                                 <p>
                                    Completely synergize resource taxing
                                    relationships via premier niche markets.
                                    Professionally cultivate one-to-one customer
                                    service with robust ideas.
                                    <br />
                                    <br />
                                    Dynamically innovate resource-leveling
                                    customer service for state of the art
                                    customer service.
                                 </p>
                              </div>
                              <div
                                 className={openTab === 3 ? "block" : "hidden"}
                                 id="link3"
                              >
                                 <p>
                                    Efficiently unleash cross-media information
                                    without cross-media value. Quickly maximize
                                    timely deliverables for real-time schemas.
                                    <br />
                                    <br /> Dramatically maintain
                                    clicks-and-mortar solutions without
                                    functional solutions.
                                 </p>
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
