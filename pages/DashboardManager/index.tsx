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

const AgencyHome = () => {
   const { state, dispatch } = useContext(Store);
   const { userInfo, agencyInfo } = state;
   const [countPosts, setCountPosts] = useState(0);
   const [countOrders, setCountOrders] = useState(0);

   useEffect(() => {
      const loadCount = async () => {
         try {
            const resPosts = await API.post(
               endpoints["get_post_published_by_agencyID"](agencyInfo.id)
            );
            setCountPosts(resPosts.data.data.listResult.length);

            const resOrders = await API.get(
               endpoints["order_agency"](agencyInfo.id)
            );
            setCountOrders(resOrders.data.data.length);
         } catch (error) {
            console.log(error);
         }
      };
      loadCount();
   }, []);
   return (
      <>
         <LayoutDashboard title="Homepage">
            <div className="w-[90%] mx-auto">
               <div>
                  <div className="font-semibold text-2xl my-10">
                     Hi {agencyInfo ? agencyInfo.name : ""}, Welcome back!
                  </div>
                  <div className="grid grid-cols-3 gap-8 mt-10">
                     <div className="dark:bg-dark-primary bg-light-primary flex flex-col justify-center items-center h-32 rounded-lg text-2xl font-semibold">
                        <div>Follow</div>
                        <div>0</div>
                     </div>
                     <div className="dark:bg-dark-primary bg-light-primary flex flex-col justify-center items-center h-32 rounded-lg text-2xl font-semibold">
                        <div>Post</div>
                        <div>{countPosts}</div>
                     </div>
                     <div className="dark:bg-dark-primary bg-light-primary flex flex-col justify-center items-center h-32 rounded-lg text-2xl font-semibold">
                        <div>Order</div>
                        <div>{countOrders}</div>
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
