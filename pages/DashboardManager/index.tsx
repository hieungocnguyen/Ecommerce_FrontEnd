import { useContext, useEffect, useState } from "react";
import API, { endpoints } from "../../API";
import LayoutDashboard from "../../components/Dashboard/LayoutDashboardManager";
import { Store } from "../../utils/Store";
import dynamic from "next/dynamic";

const AgencyHome = () => {
   const { state } = useContext(Store);
   const { agencyInfo } = state;
   const [countPosts, setCountPosts] = useState(0);
   const [countOrders, setCountOrders] = useState(0);
   const [countFollow, setCountFollow] = useState(0);

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
   useEffect(() => {
      loadCount();
   }, []);
   return (
      <>
         <LayoutDashboard title="Homepage">
            <div className="w-[90%] mx-auto my-8">
               <div className="grid grid-cols-12 gap-8 h-40">
                  <div className="col-span-7 bg-light-primary rounded-lg p-8">
                     <div className="font-semibold text-xl">
                        Hi {agencyInfo ? agencyInfo.name : ""}!
                     </div>
                     <div>
                        {agencyInfo && agencyInfo.isActive === 0 ? (
                           <>
                              <div className="text-xl font-semibold text-red-600">
                                 Your agency has banned!
                              </div>
                           </>
                        ) : (
                           <></>
                        )}
                     </div>
                  </div>
                  <div className="col-span-5 bg-primary-color rounded-lg"></div>
               </div>

               <div className=""></div>
               <div className="grid grid-cols-3 gap-8 mt-10 h-24">
                  <div className="dark:bg-dark-primary bg-light-primary flex flex-col justify-center items-center  rounded-lg text-xl font-semibold">
                     <div>Follow(s)</div>
                     <div>{countFollow}</div>
                  </div>
                  <div className="dark:bg-dark-primary bg-light-primary flex flex-col justify-center items-center  rounded-lg text-xl font-semibold">
                     <div>Sale post(s)</div>
                     <div>{countPosts}</div>
                  </div>
                  <div className="dark:bg-dark-primary bg-light-primary flex flex-col justify-center items-center  rounded-lg text-xl font-semibold">
                     <div>Order(s)</div>
                     <div>{countOrders}</div>
                  </div>
               </div>
            </div>
         </LayoutDashboard>
      </>
   );
};

// export default AgencyHome;
export default dynamic(() => Promise.resolve(AgencyHome), { ssr: false });
