import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import {
   BiBarChartAlt2,
   BiBell,
   BiChevronRight,
   BiHomeAlt,
   BiLogIn,
   BiPackage,
   BiReceipt,
   BiRocket,
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
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../pages/lib/firebase-config";

const LayoutDashboard = ({ title, children }) => {
   const { state, dispatch } = useContext(Store);
   const { userInfo, agencyInfo } = state;
   const [agency, setAgency] = useState<any>({});
   const router = useRouter();
   const [openStatisticle, setOpenStatisticle] = useState(false);
   const [openPost, setOpenPost] = useState(false);
   const [loading, setLoading] = useState(false);
   const [unSeen, setUnSeen] = useState(false);

   const logoutClickHandler = () => {
      dispatch({ type: "USER_LOGOUT" });
      dispatch({ type: "AGENCY_INFO_REMOVE" });

      Cookies.remove("userInfo");
      Cookies.remove("accessToken");
      Cookies.remove("cartItems");

      router.push("/signin");
      toast.success("sign out success");
   };

   const SnapFirestore = () => {
      const unsubcribe = onSnapshot(
         collection(db, `agency-${agencyInfo.id}`),
         (snapshot) => {
            setUnSeen(false);
            snapshot.docs.map((doc) => {
               if (doc.data().seen === false) {
                  setUnSeen(true);
                  return;
               }
            });
         }
      );
      return () => {
         unsubcribe();
      };
   };

   useEffect(() => {
      if (agencyInfo) {
         SnapFirestore();
      }
   }, [agencyInfo]);

   return (
      <div>
         <Head>
            <title>{title ? title + " - Manager Page" : "Manager Page"}</title>
            <meta name="description" content="Ecommerce Website" />
         </Head>
         <div className="grid grid-cols-6">
            {/* Side Bar */}
            <div className="col-span-1 dark:bg-dark-primary bg-light-primary h-screen sticky top-0">
               <div className="flex justify-center my-2">
                  <Link href="/">
                     <Logo width="125" />
                  </Link>
               </div>
               <div className="bg-slate-400 bg-opacity-20 mx-4 p-4 rounded-lg">
                  <div className="relative overflow-hidden w-28 aspect-square rounded-xl mx-auto">
                     <Image
                        src={agencyInfo ? agencyInfo.avatar : ""}
                        alt=""
                        className="object-cover"
                        layout="fill"
                     />
                  </div>
                  <div className="mt-2 text-center">
                     <div className="font-semibold">
                        {agencyInfo ? agencyInfo.name : ""}
                     </div>
                     <div className="text-sm">Manager Agency</div>
                  </div>
                  <div className="mt-2">
                     <button
                        className="bg-blue-main text-white font-semibold w-full py-2 rounded-lg"
                        onClick={() =>
                           router.push("/DashboardManager/editinfo")
                        }
                     >
                        Edit profile
                     </button>
                  </div>
               </div>
               {/* navigate */}
               <div className="mt-6 mx-4">
                  <Link href="/DashboardManager">
                     <div className="font-semibold rounded-lg p-2 mb-2 cursor-pointer hover:bg-slate-500 hover:bg-opacity-10 hover:text-blue-main flex items-center gap-3">
                        <BiHomeAlt className="text-lg" />
                        General
                     </div>
                  </Link>
                  <Link href="/DashboardManager/notification">
                     <div className="font-semibold rounded-lg p-2 mb-2 cursor-pointer hover:bg-slate-500 hover:bg-opacity-10 hover:text-blue-main flex items-center gap-3">
                        <BiBell className="text-lg" />
                        Notification{" "}
                        {unSeen ? (
                           <span className="w-3 h-3 bg-blue-main rounded-full"></span>
                        ) : (
                           <></>
                        )}
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
                        <BiBarChartAlt2 className="text-lg" />
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
                  <Link href="/DashboardManager/renewal">
                     <div className="font-semibold rounded-lg p-2 mb-2 cursor-pointer hover:bg-slate-500 hover:bg-opacity-10 hover:text-blue-main flex items-center gap-3">
                        <BiRocket className="text-lg" />
                        Renewal
                     </div>
                  </Link>
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
