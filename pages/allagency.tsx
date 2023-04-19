import { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import API, { endpoints } from "../API";
import Image from "next/image";
import router from "next/router";
import { BiArrowBack } from "react-icons/bi";
import emptyBox from "../public/empty-box.png";

const AllAgency = ({ agencyList }) => {
   const [keyword, setKeyWord] = useState("");

   const handleRouteAgency = (agencyID) => {
      router.push(`/agencyinfo/${agencyID}`);
   };

   return (
      <Layout title="All agency">
         <div className="my-6">
            <div className="flex gap-4 items-center m-6">
               <div
                  className="bg-blue-main text-white p-3 text-2xl rounded-lg cursor-pointer hover:shadow-lg hover:shadow-blue-main"
                  onClick={() => router.back()}
               >
                  <BiArrowBack />
               </div>
               <div className="font-semibold text-2xl">/ All agency</div>
            </div>
            <div className="w-2/3 mx-auto mb-8">
               <input
                  type="text"
                  onChange={(e) => setKeyWord(e.target.value.toLowerCase())}
                  placeholder="Name agency..."
                  className="p-4 w-full bg-light-primary dark:bg-dark-primary rounded-lg font-medium"
               />
            </div>
            <div className="grid grid-cols-4 gap-8">
               {/* {agencyList?agencyList
                     .filter((a) => a.name.toLowerCase().search(keyword) >= 0)>0?agencyList
                     .filter((a) => a.name.toLowerCase().search(keyword) >= 0)
                     .map((agency) => 
                        <div key={agency.id}>
                           <div
                              className="dark:bg-dark-primary bg-light-primary rounded-lg p-6 cursor-pointer  hover:shadow-lg"
                              onClick={() => handleRouteAgency(agency.id)}
                           >
                              <div>
                                 <div className="w-full aspect-square relative overflow-hidden rounded-2xl hover:scale-105 transition-all">
                                    <Image
                                       src={agency.avatar}
                                       alt="avatar"
                                       layout="fill"
                                       className="object-cover hover:shadow-lg"
                                    />
                                 </div>

                                 <div className="text-center font-bold text-xl uppercase mt-4 line-clamp-2 text-blue-main">
                                    {agency.name}
                                 </div>
                                 <div className="text-center font-semibold">
                                    {agency.field.name}
                                 </div>
                              </div>
                           </div>
                        </div>
                        :<div>Empty</div>:<></>} */}
               {agencyList ? (
                  agencyList.filter(
                     (a) => a.name.toLowerCase().search(keyword) >= 0
                  ).length > 0 ? (
                     agencyList
                        .filter(
                           (a) => a.name.toLowerCase().search(keyword) >= 0
                        )
                        .map((agency) => (
                           <div key={agency.id}>
                              <div
                                 className="dark:bg-dark-primary bg-light-primary rounded-lg p-6 cursor-pointer  hover:shadow-lg"
                                 onClick={() => handleRouteAgency(agency.id)}
                              >
                                 <div>
                                    <div className="w-full aspect-square relative overflow-hidden rounded-2xl hover:scale-105 transition-all">
                                       <Image
                                          src={agency.avatar}
                                          alt="avatar"
                                          layout="fill"
                                          className="object-cover hover:shadow-lg"
                                       />
                                    </div>

                                    <div className="text-center font-bold text-xl uppercase mt-4 line-clamp-2 text-blue-main">
                                       {agency.name}
                                    </div>
                                    <div className="text-center font-semibold">
                                       {agency.field.name}
                                    </div>
                                 </div>
                              </div>
                           </div>
                        ))
                  ) : (
                     <>
                        <div className="col-span-4 flex  justify-center items-center">
                           <div className="relative overflow-hidden aspect-square w-1/4 mx-auto">
                              <Image
                                 src={emptyBox}
                                 alt="empty"
                                 layout="fill"
                                 className="object-cover"
                              />
                           </div>
                        </div>
                     </>
                  )
               ) : (
                  <></>
               )}
            </div>
         </div>
      </Layout>
   );
};

export default AllAgency;
export const getServerSideProps = async () => {
   const fetchAllAgency = await API.get(endpoints["all_agency"]);
   const agencyList = fetchAllAgency.data.data;
   return { props: { agencyList } };
};
