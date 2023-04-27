import { useRouter } from "next/router";
import LayoutDashboardManager from "../../../components/Dashboard/LayoutDashboardManager";
import { useContext, useEffect } from "react";
import paymentSuccess from "../../../public/payment_success.png";
import paymentFailed from "../../../public/payment_failed.png";
import Image from "next/image";
import Link from "next/link";
import API, { endpoints } from "../../../API";
import { Store } from "../../../utils/Store";
import toast from "react-hot-toast";

const StateOfPayment = () => {
   const { state, dispatch } = useContext(Store);
   const { renewalPackageID, agencyInfo } = state;
   const router = useRouter();
   const resultCode = router.query.resultCode;

   const handlePaymentMoMo = async () => {
      if (renewalPackageID != null) {
         try {
            const res = await API.post(
               endpoints["create_order_renewal"](
                  agencyInfo.id,
                  renewalPackageID
               )
            );
            if (res.data.code === "200") {
               toast.success("Renewal successful!");
               dispatch({ type: "REMOVE_RENEWAL_ID" });
            } else {
               toast.error("Something wrong, check ang try again!");
            }
         } catch (error) {
            console.log(error);
         }
      }
   };

   useEffect(() => {
      //fetch when payment successful
      if (resultCode === "0") {
         handlePaymentMoMo();
      }
   }, [resultCode]);

   let result = <PaymentSuccess />;
   if (resultCode == "1006") {
      result = <PaymentFailed detail="User denied the transaction" />;
   } else if (resultCode == "1005") {
      result = <PaymentFailed detail="Payment expired transaction" />;
   } else if (resultCode == "1004") {
      result = <PaymentFailed detail="Exceeded payment limit of MOMO" />;
   }

   return <>{result}</>;
};

export default StateOfPayment;

const PaymentSuccess = () => {
   return (
      <LayoutDashboardManager title="Payment successful">
         <div className="flex flex-col items-center">
            <div className="relative overflow-hidden w-72 h-72 mt-28 mb-8">
               <Image
                  src={paymentSuccess}
                  alt=""
                  layout="fill"
                  className="object-cover"
               />
            </div>
            <div className="font-bold text-3xl uppercase">
               Payment sucessful
            </div>
         </div>
      </LayoutDashboardManager>
   );
};
const PaymentFailed = ({ detail }) => {
   return (
      <LayoutDashboardManager title="Payment successful">
         <div className="flex flex-col items-center">
            <div className="relative overflow-hidden w-72 h-72 mt-28 mb-8">
               <Image
                  src={paymentFailed}
                  alt=""
                  layout="fill"
                  className="object-cover"
               />
            </div>
            <div className="font-bold text-3xl uppercase">Payment Failed</div>
            <div>{detail}</div>
         </div>
      </LayoutDashboardManager>
   );
};
