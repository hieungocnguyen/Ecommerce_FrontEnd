import { useContext, useEffect, useState } from "react";
import LayoutDashboardManager from "../../../components/Dashboard/LayoutDashboardManager";
import API, { endpoints } from "../../../API";
import { Store } from "../../../utils/Store";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import ConfirmModel from "../../../components/Model/ConfirmModel";

const ServicePlan = () => {
   const [planList, setPlanList] = useState<any>([]);
   const { state, dispatch } = useContext(Store);
   const router = useRouter();
   const [isOpenConfirm, setIsOpenConfirm] = useState(false);
   const [planID, setPlanID] = useState(0);

   const fetchListPlan = async () => {
      try {
         const res = await API.get(endpoints["get_list_renewal_package"]);
         setPlanList(res.data.data);
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      fetchListPlan();
   }, []);

   const handleRenewalPlan = async (planID) => {
      try {
         const res = await API.get(
            endpoints["get_renewal_momo_payment_info"](planID)
         );
         if (res.data.code === "200") {
            dispatch({ type: "ADD_RENEWAL_ID", payload: planID });
            router.push(res.data.data.payUrl);
         } else {
            toast.error("Something wrong, check ang try again!");
         }
      } catch (error) {
         console.log(error);
      }
   };

   return (
      <LayoutDashboardManager title="Services Plan">
         <div className="w-[90%] mx-auto my-8">
            <div className="font-semibold text-2xl mb-8">
               Renewal Services Plan
            </div>
            <div className="grid grid-cols-4 gap-8">
               {planList.map((plan) => (
                  <div
                     key={plan.id}
                     className="bg-light-primary rounded-lg text-center p-6"
                  >
                     <div className="font-semibold">{plan.packageName}</div>
                     <div className="font-bold text-2xl mt-6">
                        {plan.discountPrice > 0 ? (
                           plan.discountPrice.toLocaleString("it-IT", {
                              style: "currency",
                              currency: "VND",
                           })
                        ) : (
                           <div>FREE</div>
                        )}
                     </div>
                     <div className="mt-1 line-through font-medium opacity-50 h-6">
                        {plan.usualPrice > 0 &&
                           plan.usualPrice.toLocaleString("it-IT", {
                              style: "currency",
                              currency: "VND",
                           })}
                     </div>
                     <div className="mt-4">
                        {plan.id != 1 && (
                           <span className="font-medium">Renewal: </span>
                        )}
                        <span className="font-bold text-lg text-blue-main">
                           {plan.numberOfDaysAvailable} Days
                        </span>
                     </div>
                     <div className="mt-4 text-sm h-28 ">
                        {plan.description}
                     </div>
                     {plan.id > 1 && (
                        <button
                           className="mt-4 px-6 py-3 bg-blue-main rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-blue-main transition-all"
                           onClick={() => {
                              setPlanID(plan.id);
                              setIsOpenConfirm(true);
                           }}
                        >
                           Renewal
                        </button>
                     )}
                  </div>
               ))}
               <div
                  className={`fixed top-0 right-0 w-full h-screen backdrop-blur-sm items-center justify-center z-20 ${
                     isOpenConfirm ? "flex" : "hidden"
                  }`}
               >
                  <div className="w-1/3  h-fit">
                     <ConfirmModel
                        functionConfirm={() => handleRenewalPlan(planID)}
                        content={"Are you sure to renewal this service plan?"}
                        isOpenConfirm={isOpenConfirm}
                        setIsOpenConfirm={setIsOpenConfirm}
                     />
                  </div>
               </div>
            </div>
         </div>
      </LayoutDashboardManager>
   );
};

export default ServicePlan;
