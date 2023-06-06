import { BiPlanet } from "react-icons/bi";
import LayoutDashboardManager from "../../../components/Dashboard/LayoutDashboardManager";

const PromotionPage = () => {
   return (
      <LayoutDashboardManager title="Promotion">
         <div className="w-[95%] mx-auto my-8">
            <div className="font-semibold text-2xl mb-6 flex items-center gap-1">
               <div className="text-primary-color">
                  <BiPlanet />
               </div>
               Promotion
            </div>
         </div>
      </LayoutDashboardManager>
   );
};

export default PromotionPage;
