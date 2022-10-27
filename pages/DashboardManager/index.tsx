import { useContext } from "react";
import LayoutDashboard from "../../components/Dashboard/LayoutDashboardManager";
import { Store } from "../../utils/Store";

const AgencyHome = () => {
   const { state, dispatch } = useContext(Store);
   const { userInfo, agencyInfo } = state;
   return (
      <>
         <LayoutDashboard>
            <div className="w-[90%] mx-auto">
               <div className="font-semibold text-2xl my-10">
                  Hi {agencyInfo.name}, Welcome back!
               </div>
               <div className="grid grid-cols-3 gap-8 mt-10">
                  <div className="bg-neutral-800 flex flex-col justify-center items-center h-32 rounded-lg text-2xl font-semibold">
                     <div>Follow</div>
                     <div>0</div>
                  </div>
                  <div className="bg-neutral-800 flex flex-col justify-center items-center h-32 rounded-lg text-2xl font-semibold">
                     <div>Post</div>
                     <div>0</div>
                  </div>
                  <div className="bg-neutral-800 flex flex-col justify-center items-center h-32 rounded-lg text-2xl font-semibold">
                     <div>Order</div>
                     <div>0</div>
                  </div>
               </div>
            </div>
         </LayoutDashboard>
      </>
   );
};

export default AgencyHome;
