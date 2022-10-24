import { useRouter } from "next/router";
import { useContext, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { authAxios, endpoints } from "../API";
import Layout from "../components/Layout/Layout";
import { Store } from "../utils/Store";

const Changepassword = () => {
   const { state, dispatch } = useContext(Store);
   const { userInfo } = state;
   const [password, setPassword] = useState(["", ""]);
   const router = useRouter();

   const handleSumbit = async (e) => {
      e.preventDefault();
      if (password[0] !== password[1]) {
         toast.error("Password dont match, check again!", {
            position: "bottom-center",
         });
      } else {
         const resPw = await authAxios().patch(
            endpoints["change_password"](userInfo.id),
            {
               password: password[0],
               rePassword: password[1],
            }
         );
         toast.success("Change passwork successful", {
            position: "bottom-center",
         });
         router.push("/");
      }
   };
   return (
      <Layout title="Change Password">
         <div className="font-semibold text-2xl pt-4 pb-10">
            Change your password
         </div>
         <form className="w-[600px] mx-auto" onSubmit={handleSumbit}>
            <div className="grid grid-cols-2 mt-8 items-center font-semibold">
               <label htmlFor="newPassword" className="text-left">
                  New Password
               </label>
               <input
                  type="password"
                  id="newPassword"
                  className="p-4 rounded-lg w-full"
                  onChange={(e) => {
                     setPassword([e.target.value, password[1]]);
                  }}
               />
            </div>
            <div className="grid grid-cols-2 mt-8 items-center font-semibold">
               <label htmlFor="ConfirmNewPassword" className="text-left">
                  Confirm New Password
               </label>
               <input
                  type="password"
                  id="ConfirmNewPassword"
                  className="p-4 rounded-lg w-full"
                  onChange={(e) => {
                     setPassword([password[0], e.target.value]);
                  }}
               />
            </div>
            <button
               className="p-4 bg-blue-main text-white font-semibold mt-6 rounded-lg"
               type="submit"
            >
               Change
            </button>
         </form>
         <Toaster />
      </Layout>
   );
};

export default Changepassword;
