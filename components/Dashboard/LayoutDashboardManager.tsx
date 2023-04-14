import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import {
   BiChevronRight,
   BiHomeAlt,
   BiLogIn,
   BiPackage,
   BiReceipt,
   BiStats,
} from "react-icons/bi";
import API, { endpoints } from "../../API";
import { Store } from "../../utils/Store";
import Logo from "../Logo";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Loader from "../Loader";
import Head from "next/head";

const LayoutDashboard = ({ title, children }) => {
   const { state, dispatch } = useContext(Store);
   const { userInfo, agencyInfo } = state;
   const [agency, setAgency] = useState<any>({});
   const router = useRouter();
   const [openStatisticle, setOpenStatisticle] = useState(false);
   const [openPost, setOpenPost] = useState(false);
   const [loading, setLoading] = useState(false);

   const logoutClickHandler = () => {
      dispatch({ type: "USER_LOGOUT" });
      dispatch({ type: "AGENCY_INFO_REMOVE" });

      Cookies.remove("userInfo");
      Cookies.remove("accessToken");
      Cookies.remove("cartItems");
      router.push("/signin");
      toast.success("sign out success", {
         position: "bottom-center",
      });
   };

   return (
      <div>
         <Head>
            <title>{title ? title + " - Manager Page" : "Manager Page"}</title>
            <meta name="description" content="Ecommerce Website" />
         </Head>
         <div className="grid grid-cols-6">
            {/* Side Bar */}
            <div className="col-span-1 dark:bg-dark-primary bg-light-primary h-screen sticky top-0">
               <div className="flex justify-center my-4">
                  <Link href="/">
                     <Logo width="125" />
                  </Link>
               </div>
               <div className="my-8">
                  <div className="flex justify-center mb-4">
                     <Image
                        src={
                           agencyInfo
                              ? agencyInfo.avatar
                              : "https://images.unsplash.com/photo-1612994370726-5d4d609fca1b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDl8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
                        }
                        alt="avatar"
                        className="rounded-full object-cover"
                        width={90}
                        height={90}
                     />
                  </div>
                  <div
                     className="mx-4 p-4 bg-slate-500 bg-opacity-10 rounded-lg   hover:bg-opacity-30 transition-all"
                     // onClick={() => handleRouteEditProfile()}
                  >
                     <div className="font-semibold">
                        {agencyInfo ? agencyInfo.name : ""}
                     </div>
                     <div className="text-sm">Manager Agency</div>
                  </div>
               </div>
               {/* navigate */}
               <div className="mt-10 mx-4">
                  <Link href="/DashboardManager">
                     <div className="font-semibold rounded-lg p-2 mb-2 cursor-pointer hover:bg-slate-500 hover:bg-opacity-10 hover:text-blue-main flex items-center gap-3">
                        <BiHomeAlt className="text-lg" />
                        General
                     </div>
                  </Link>

                  <div>
                     <div
                        className="font-semibold rounded-lg p-2 mb-2 cursor-pointer hover:bg-slate-500 hover:bg-opacity-10 hover:text-blue-main flex items-center gap-3"
                        onClick={() => setOpenPost(!openPost)}
                     >
                        <BiReceipt className="text-lg" />
                        Post
                        <BiChevronRight
                           className={`absolute right-6 font-semibold text-2xl transition-all ${
                              openPost ? "rotate-90" : ""
                           }`}
                        />
                     </div>
                     <div
                        className={`font-semibold text-sm pl-8 ${
                           openPost ? "" : "hidden"
                        }`}
                     >
                        <Link href="/DashboardManager/posts/createnewpost">
                           <div className="p-2 dark:hover:bg-dark-spot hover:bg-slate-300  rounded-lg cursor-pointer">
                              Create Post
                           </div>
                        </Link>
                        <Link href="/DashboardManager/posts">
                           <div className="p-2 dark:hover:bg-dark-spot hover:bg-slate-300 rounded-lg cursor-pointer">
                              List Post
                           </div>
                        </Link>
                     </div>
                  </div>
                  <Link href="/DashboardManager/orders">
                     <div className="font-semibold rounded-lg p-2 mb-2 cursor-pointer hover:bg-slate-500 hover:bg-opacity-10 hover:text-blue-main flex items-center gap-3">
                        <BiPackage className="text-lg" />
                        Order Tracking
                     </div>
                  </Link>
                  <div>
                     <div
                        className="font-semibold rounded-lg p-2 mb-2 cursor-pointer hover:bg-slate-500 hover:bg-opacity-10 hover:text-blue-main flex items-center gap-3"
                        onClick={() => setOpenStatisticle(!openStatisticle)}
                     >
                        <BiStats className="text-lg" />
                        Statistical
                        <BiChevronRight
                           className={`absolute right-6 font-semibold text-2xl transition-all ${
                              openStatisticle ? "rotate-90" : ""
                           }`}
                        />
                     </div>
                     <div
                        className={`font-semibold text-sm pl-8 ${
                           openStatisticle ? "" : "hidden"
                        }`}
                     >
                        <Link href="/DashboardManager/statisticle/category">
                           <div className="p-2 dark:hover:bg-dark-spot hover:bg-slate-300 rounded-lg cursor-pointer">
                              Category
                           </div>
                        </Link>
                        <Link href="/DashboardManager/statisticle/revenue">
                           <div className="p-2 dark:hover:bg-dark-spot hover:bg-slate-300 rounded-lg cursor-pointer">
                              Revenue
                           </div>
                        </Link>
                     </div>
                  </div>
               </div>
               <div className="absolute bottom-4 flex justify-center items-center gap-2 w-full">
                  <Link href="/">
                     <button
                        className="rounded-lg bg-blue-main hover:bg-opacity-80 h-10 w-fit px-3 font-semibold text-sm text-dark-text"
                        title="Back to Homepage"
                     >
                        Back to Homepage
                     </button>
                  </Link>
                  <button
                     className=" bg-blue-main hover:bg-opacity-80 rounded-lg text-xl h-10 w-fit px-3 text-dark-text"
                     title="logout"
                     onClick={logoutClickHandler}
                  >
                     <BiLogIn />
                  </button>
               </div>
            </div>
            {/* Main Content */}
            <main className="col-span-5 mx-10">{children}</main>
            <Toaster />
            {loading ? <Loader /> : <></>}
         </div>
      </div>
   );
};

export default dynamic(() => Promise.resolve(LayoutDashboard), { ssr: false });
// export default LayoutDashboard;
