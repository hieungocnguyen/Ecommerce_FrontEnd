import { BiArrowBack } from "react-icons/bi";
import LayoutDashboardManager from "../../../components/Dashboard/LayoutDashboardManager";
import { useRouter } from "next/router";
import { useEffect } from "react";

const DetailPromotionProgram = () => {
   const router = useRouter();
   const id = router.query.id;

   useEffect(() => {}, []);

   return (
      <LayoutDashboardManager title="Detail Program">
         <div className="mx-auto my-8">
            <div className="flex justify-between mb-4">
               <div className="flex gap-4 items-center">
                  <div
                     className="bg-primary-color text-white p-3 text-2xl rounded-lg cursor-pointer hover:shadow-lg hover:shadow-primary-color"
                     onClick={() => router.back()}
                  >
                     <BiArrowBack />
                  </div>
                  <div className="font-semibold text-2xl">
                     / Promotion Program
                  </div>
               </div>
            </div>
            <div className=""></div>
         </div>
      </LayoutDashboardManager>
   );
};

export default DetailPromotionProgram;
