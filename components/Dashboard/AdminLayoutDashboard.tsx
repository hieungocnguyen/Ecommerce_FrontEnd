import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import {
   BiBarChartAlt2,
   BiBell,
   BiChevronDown,
   BiChevronRight,
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
import Head from "next/head";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../pages/lib/firebase-config";

const AdminLayoutDashboard = ({ title, children }) => {
   const { state, dispatch } = useContext(Store);
   const { userInfo, agencyInfo } = state;
   const [openMenu, setOpenMenu] = useState(false);
   const [openStatisticle, setOpenStatisticle] = useState(false);
   const router = useRouter();
   const [numberUncensored, setNumberUncensored] = useState(0);
   const [unSeen, setUnSeen] = useState(false);

   const logoutClickHandler = () => {
      dispatch({ type: "USER_LOGOUT" });
      Cookies.remove("userInfo");
      Cookies.remove("accessToken");
      Cookies.remove("cartItems");
      router.push("/signin");
      toast.success("sign out success", {
         position: "bottom-center",
      });
   };

   const loadUncensoredNumber = async () => {
      try {
         const resUncensored = await API.get(endpoints["uncensored_agency"]);
         setNumberUncensored(resUncensored.data.data.length);
      } catch (error) {
         console.log(error);
      }
   };
   useEffect(() => {
      if (userInfo && userInfo.role.name === "ROLE_ADMIN") {
         loadUncensoredNumber();
         SnapFirestore();
      } else {
         router.push("/403");
      }
   }, []);

   const SnapFirestore = () => {
      const unsubcribe = onSnapshot(collection(db, `admin`), (snapshot) => {
         setUnSeen(false);
         snapshot.docs.map((doc) => {
            if (doc.data().seen === false) {
               setUnSeen(true);
               return;
            }
         });
      });
      return () => {
         unsubcribe();
      };
   };

   return (
      <div>
         <Head>
            <title>{title ? title + " - Manager Page" : "Manager Page"}</title>
            <meta name="description" content="Ecommerce Website" />
         </Head>
         {userInfo && userInfo.role.name === "ROLE_ADMIN" ? (
            <>
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
                        <div className="mx-4 p-4 dark:bg-dark-spot bg-light-spot bg-opacity-80 rounded-lg ">
                           <div className="font-semibold">
                              {userInfo
                                 ? userInfo.firstName + " " + userInfo.lastName
                                 : ""}
                           </div>
                           <div className="text-sm">Administrator</div>
                        </div>
                     </div>
                     <div className="mt-10 mx-4">
                        <Link href="/DashboardAdmin">
                           <div className="font-semibold rounded-lg p-2 mb-2 cursor-pointer hover:bg-slate-500 hover:bg-opacity-10 hover:text-blue-main flex items-center gap-3">
                              <BiHomeAlt className="text-lg" />
                              General
                           </div>
                        </Link>
                        <Link href="/DashboardAdmin/notification">
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
                        <div className="transition-all duration-1000">
                           <div
                              className="font-semibold rounded-lg p-2 mb-2 cursor-pointer hover:bg-slate-500 hover:bg-opacity-10 hover:text-blue-main flex items-center gap-3"
                              onClick={(e) =>
                                 openMenu
                                    ? setOpenMenu(false)
                                    : setOpenMenu(true)
                              }
                           >
                              <BiStore className="text-lg" />
                              Agency
                              <BiChevronRight
                                 className={`absolute right-6 font-semibold text-2xl transition-all ${
                                    openMenu ? "rotate-90" : ""
                                 }`}
                              />
                           </div>
                           <div
                              className={` font-semibold text-sm pl-8 ${
                                 openMenu ? "" : "hidden"
                              }`}
                           >
                              <Link href="/DashboardAdmin/agencies">
                                 <div className="p-2 dark:hover:bg-dark-spot hover:bg-slate-300 rounded-lg cursor-pointer">
                                    Agency List
                                 </div>
                              </Link>
                              <Link href="/DashboardAdmin/agencies/uncensoredAgency">
                                 <div
                                    className={`p-2 dark:hover:bg-dark-spot hover:bg-slate-300 rounded-lg cursor-pointer items-center flex `}
                                 >
                                    Uncensored Agency
                                    <span
                                       className={`bg-blue-main rounded-full w-3 h-3 font-semibold ml-4 ${
                                          numberUncensored ? "" : "hidden"
                                       }`}
                                    ></span>
                                 </div>
                              </Link>
                           </div>
                        </div>
                        <div className="transition-all duration-1000">
                           <div
                              className="font-semibold rounded-lg p-2 mb-2 cursor-pointer hover:bg-slate-500 hover:bg-opacity-10 hover:text-blue-main flex items-center gap-3"
                              onClick={(e) =>
                                 openStatisticle
                                    ? setOpenStatisticle(false)
                                    : setOpenStatisticle(true)
                              }
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
                              className={` font-semibold text-sm pl-8 ${
                                 openStatisticle ? "" : "hidden"
                              }`}
                           >
                              <Link href="/DashboardAdmin/statisticle/category">
                                 <div className="p-2 dark:hover:bg-dark-spot hover:bg-slate-300 rounded-lg cursor-pointer">
                                    Category
                                 </div>
                              </Link>
                              <Link href="/DashboardAdmin/statisticle/renewal">
                                 <div
                                    className={`p-2 dark:hover:bg-dark-spot hover:bg-slate-300 rounded-lg cursor-pointer items-center flex `}
                                 >
                                    Renewal
                                 </div>
                              </Link>
                           </div>
                        </div>
                        <Link href="/DashboardAdmin/users">
                           <div className="font-semibold rounded-lg p-2 mb-2 cursor-pointer hover:bg-slate-500 hover:bg-opacity-10 hover:text-blue-main flex items-center gap-3">
                              <BiUser className="text-lg" />
                              User List
                           </div>
                        </Link>
                     </div>
                     <div className="absolute bottom-4 flex justify-center items-center gap-2 w-full">
                        <Link href="/">
                           <button className="rounded-lg  bg-blue-main hover:bg-opacity-80 h-10 w-fit px-3 font-semibold text-sm text-white">
                              Back to Homepage
                           </button>
                        </Link>
                        <button
                           className=" bg-blue-main hover:bg-opacity-80 rounded-lg text-xl h-10 w-fit px-3 text-white"
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
         ) : (
            <></>
         )}
      </div>
   );
};

export default dynamic(() => Promise.resolve(AdminLayoutDashboard), {
   ssr: false,
});
// export default LayoutDashboard;
