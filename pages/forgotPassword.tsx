import { useRouter } from "next/router";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import API, { endpoints } from "../API";
import Layout from "../components/Layout/Layout";
import Loader from "../components/Loader";

const ForgotPassword = () => {
   const [email, setEmail] = useState("");
   const [code, setCode] = useState("");
   const [hasSent, setHasSent] = useState(false);
   const [loading, setLoading] = useState(false);
   const router = useRouter();
   const handleChangeEmail = (e) => {
      setEmail(e.target.value);
   };
   const handleChangeCode = (e) => {
      setCode(e.target.value);
   };
   const handleSendMail = async () => {
      setLoading(true);
      try {
         const resReset = await API.post(endpoints["reset_password"], {
            email: email,
         });
         if (resReset.data.code == 200) {
            toast.success("Check confirm code in your email", {
               position: "bottom-center",
            });
            setLoading(false);
            setHasSent(true);
            setCode("");
         } else {
            setLoading(false);
            toast.error(resReset.data.message, {
               position: "bottom-center",
            });
         }
      } catch (error) {
         toast.error(error.response.data.data, {
            position: "bottom-center",
         });
      }
   };
   const handleConfirm = async () => {
      try {
         const resReset = await API.post(endpoints["confirm_code"], {
            code: code,
            email: email,
         });
         if (resReset) {
            toast.success("Reset password successfully", {
               position: "bottom-center",
            });
            router.push("/signin");
         }
      } catch (error) {
         toast.error(error.response.data.data, {
            position: "bottom-center",
         });
      }
   };
   return (
      <Layout title="Forgot Password">
         <div className="font-semibold text-xl my-4">ForgotPassword</div>

         <div>
            {hasSent ? (
               <div>
                  <div className="my-10">
                     <label htmlFor="code" className="font-semibold">
                        Confirm Code
                     </label>
                     <input
                        type="text"
                        className="p-3 rounded-lg ml-6 "
                        id="code"
                        onChange={handleChangeCode}
                        value={code}
                     />
                  </div>
                  <div className="">
                     <button
                        onClick={() => setHasSent(!hasSent)}
                        className="p-3 bg-blue-main hover:bg-opacity-80 text-white rounded-lg font-semibold mr-4"
                     >
                        Send other mail
                     </button>
                     <button
                        onClick={handleConfirm}
                        className="p-3 bg-blue-main hover:bg-opacity-80 text-white rounded-lg font-semibold"
                     >
                        Confirm
                     </button>
                  </div>
               </div>
            ) : (
               <div>
                  <div className="my-10">
                     <label htmlFor="email" className="font-semibold">
                        Email
                     </label>
                     <input
                        type="email"
                        className="p-3 rounded-lg ml-6"
                        id="email"
                        defaultValue={email}
                        onChange={handleChangeEmail}
                     />
                  </div>
                  <button
                     onClick={handleSendMail}
                     className="p-3 bg-blue-main hover:bg-opacity-80 text-white rounded-lg font-semibold"
                  >
                     Send to this mail
                  </button>
               </div>
            )}
         </div>
         {loading ? <Loader /> : <></>}
         <Toaster />
      </Layout>
   );
};

export default ForgotPassword;
