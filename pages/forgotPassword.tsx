import { useRouter } from "next/router";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { BiArrowBack } from "react-icons/bi";
import API, { endpoints } from "../API";
import Layout from "../components/Layout/Layout";
import Loader from "../components/Loader";
import useTrans from "../hook/useTrans";

const ForgotPassword = () => {
   const [email, setEmail] = useState<string>("");
   const [code, setCode] = useState<string>("");
   const [hasSent, setHasSent] = useState<boolean>(false);
   const [loading, setLoading] = useState<boolean>(false);
   const router = useRouter();
   const trans = useTrans();

   const handleSendMail = async (e) => {
      e.preventDefault();
      setLoading(true);
      if (email) {
         try {
            const resReset = await API.post(endpoints["reset_password"], {
               email: email,
            });

            if (resReset.data.code === "200") {
               toast.success("Check confirm code in your email", {
                  position: "top-center",
               });
               setLoading(false);
               setHasSent(true);
               setCode("");
            } else {
               setLoading(false);
               toast.error(resReset.data.message, {
                  position: "top-center",
               });
               console.log("catch fail");
            }
         } catch (error) {
            console.log(error);
            setLoading(false);
            toast.error(error.response.data.data.email, {
               position: "top-center",
            });
         }
      } else {
         toast.error("Email empty!", {
            position: "top-center",
         });
         setLoading(false);
      }
   };
   const handleConfirm = async () => {
      if (email) {
         try {
            const resReset = await API.post(endpoints["confirm_code"], {
               code: code,
               email: email,
            });
            if (resReset.data.code === "200") {
               toast.success("Reset password successfully", {
                  position: "top-center",
               });
               router.push("/signin");
            } else {
               toast.error(resReset.data.message, {
                  position: "top-center",
               });
            }
         } catch (error) {
            toast.error(error.response.data.data, {
               position: "top-center",
            });
         }
      } else {
         toast.error("Code empty!", {
            position: "top-center",
         });
      }
   };
   return (
      <Layout title="Forgot Password">
         <div className="flex gap-4 items-center m-6">
            <div
               className="bg-primary-color text-white p-3 text-2xl rounded-lg cursor-pointer hover:shadow-lg hover:shadow-primary-color"
               onClick={() => router.back()}
            >
               <BiArrowBack />
            </div>
            <div className="font-semibold text-2xl">
               / {trans.forgot_password.reset_password}
            </div>
         </div>
         <div>
            {hasSent ? (
               <div>
                  <div className="my-10">
                     <label htmlFor="code" className="font-semibold">
                        {trans.forgot_password.confirm_code}
                     </label>
                     <input
                        type="text"
                        className="bg-light-primary dark:bg-dark-primary p-4 rounded-lg ml-6 "
                        id="code"
                        onChange={(e) => setCode(e.target.value)}
                        value={code}
                     />
                  </div>
                  <div className="flex flex-col items-center justify-center">
                     <button
                        onClick={handleConfirm}
                        className="p-3 bg-primary-color hover:bg-opacity-80 text-white rounded-lg font-semibold w-fit mb-4"
                     >
                        {trans.forgot_password.submit_code}
                     </button>
                     <button
                        onClick={() => setHasSent(!hasSent)}
                        className="hover:bg-opacity-80 text-primary-color rounded-lg font-semibold"
                     >
                        {trans.forgot_password.send_to_other_mail}
                     </button>
                  </div>
               </div>
            ) : (
               <form onSubmit={handleSendMail}>
                  <div className="my-10">
                     <label htmlFor="email" className="font-semibold">
                        Email
                     </label>
                     <input
                        type="email"
                        className="bg-light-primary dark:bg-dark-primary p-4 rounded-lg ml-6 font-medium"
                        id="email"
                        defaultValue={email}
                        onChange={(e) => setEmail(e.target.value)}
                     />
                  </div>
                  <button
                     type="submit"
                     className="p-3 bg-primary-color hover:bg-opacity-80 text-white rounded-lg font-semibold"
                  >
                     {trans.forgot_password.send_to_email}
                  </button>
               </form>
            )}
         </div>
         {loading ? <Loader /> : <></>}
         <Toaster />
      </Layout>
   );
};

export default ForgotPassword;
