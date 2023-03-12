import { useRouter } from "next/router";
import { useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import paymentSuccess from "../../public/payment_success.png";
import paymentFailed from "../../public/payment_failed.png";
import Image from "next/image";
import dynamic from "next/dynamic";
import { authAxios, endpoints } from "../../API";
import Cookies from "js-cookie";

const StateOfPayment = () => {
   const router = useRouter();
   const resultCode = router.query.resultCode;

   const fetchPaymentCart = async () => {
      try {
         const res = await authAxios().post(endpoints["payment_cart"](2));
         if (res) {
            Cookies.remove("cartItems");
         }
      } catch (error) {
         console.log(error);
      }
   };
   let result = <PaymentSuccess />;
   if (resultCode == "1006") {
      result = <PaymentFailed detail="User denied the transaction" />;
   } else if (resultCode == "1005") {
      result = <PaymentFailed detail="Payment expired transaction" />;
   }
   useEffect(() => {
      if (resultCode === "0") {
         fetchPaymentCart();
      }
   }, [resultCode]);
   return <>{result}</>;
};

// export default StateOfPayment;
export default dynamic(() => Promise.resolve(StateOfPayment), { ssr: false });

const PaymentSuccess = () => {
   return (
      <Layout title="Payment successful">
         <div className="flex flex-col items-center">
            <div className="relative overflow-hidden w-72 h-72 mt-12 mb-8">
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
            <div className="mt-2 mb-4">
               Your order is being prepared by the agent
            </div>
            <button className="px-12 py-4 bg-blue-main rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-blue-main mb-12">
               My order
            </button>
         </div>
      </Layout>
   );
};
const PaymentFailed = ({ detail }) => {
   return (
      <Layout title="Payment successful">
         <div className="flex flex-col items-center">
            <div className="relative overflow-hidden w-72 h-72 mt-12 mb-8">
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
      </Layout>
   );
};
