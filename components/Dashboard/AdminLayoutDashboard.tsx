import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import {
   BiHomeAlt,
   BiLogIn,
   BiPackage,
   BiReceipt,
   BiStore,
   BiUser,
} from "react-icons/bi";
import API, { endpoints } from "../../API";
import { Store } from "../../utils/Store";
import Logo from "../Logo";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

const AdminLayoutDashboard = ({ children }) => {
   const { state, dispatch } = useContext(Store);
   const { userInfo, agencyInfo } = state;
   const [agency, setAgency] = useState<any>({});
   const router = useRouter();
   const logoutClickHandler = () => {
      dispatch({ type: "USER_LOGOUT" });
      Cookies.remove("userInfo");
      Cookies.remove("accessToken");
      Cookies.remove("cartItems");
      router.push("/");
      toast.success("sign out success", {
         position: "bottom-center",
      });
   };
   return (
      <>
         <div className="grid grid-cols-6">
            {/* Side Bar */}
            <div className="col-span-1 bg-dark-primary h-screen sticky top-0">
               <div className="flex justify-center my-4">
                  <Link href="/">
                     <Logo width="125" />
                  </Link>
               </div>
               <div className="my-8">
                  <div className="flex justify-center mb-4">
                     <Image
                        src={
                           userInfo
                              ? userInfo.avatar
                              : "https://images.unsplash.com/photo-1612994370726-5d4d609fca1b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDl8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
                        }
                        alt="avatar"
                        className="rounded-full"
                        width={90}
                        height={90}
                     />
                  </div>
                  <div className="mx-4 p-4 bg-slate-500 bg-opacity-10 rounded-lg ">
                     <div className="font-semibold">
                        {userInfo
                           ? userInfo.firstName + " " + userInfo.lastName
                           : ""}
                     </div>
                     <div className="text-sm">Administrator</div>
                  </div>
               </div>
               <div className="mt-20 mx-4">
                  <Link href="/DashboardAdmin">
                     <div className="font-semibold rounded-lg p-2 mb-2 cursor-pointer hover:bg-slate-500 hover:bg-opacity-10 hover:text-blue-main flex items-center gap-3">
                        <BiHomeAlt className="text-lg" />
                        General
                     </div>
                  </Link>
                  <Link href="/DashboardAdmin/agencies">
                     <div className="font-semibold rounded-lg p-2 mb-2 cursor-pointer hover:bg-slate-500 hover:bg-opacity-10 hover:text-blue-main flex items-center gap-3">
                        <BiStore className="text-lg" />
                        Agencies
                     </div>
                  </Link>
                  <Link href="/DashboardAdmin/users">
                     <div className="font-semibold rounded-lg p-2 mb-2 cursor-pointer hover:bg-slate-500 hover:bg-opacity-10 hover:text-blue-main flex items-center gap-3">
                        <BiUser className="text-lg" />
                        Users
                     </div>
                  </Link>
               </div>
               <div className="absolute bottom-4 flex justify-center items-center gap-2 w-full">
                  <Link href="/">
                     <button className="rounded-lg  bg-blue-main hover:bg-opacity-80 h-10 w-fit px-3 font-semibold text-sm">
                        Back to Homepage
                     </button>
                  </Link>
                  <button
                     className=" bg-blue-main hover:bg-opacity-80 rounded-lg text-xl h-10 w-fit px-3"
                     onClick={logoutClickHandler}
                  >
                     <BiLogIn />
                  </button>
               </div>
            </div>
            {/* Main Content */}
            <main className="col-span-5">{children}</main>
            <Toaster />
         </div>
      </>
   );
};

export default dynamic(() => Promise.resolve(AdminLayoutDashboard), {
   ssr: false,
});
// export default LayoutDashboard;
