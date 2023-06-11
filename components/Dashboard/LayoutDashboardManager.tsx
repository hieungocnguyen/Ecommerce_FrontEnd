import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import {
   BiAddToQueue,
   BiBarChartAlt2,
   BiBell,
   BiCategoryAlt,
   BiChevronRight,
   BiHomeAlt,
   BiLogIn,
   BiMessageDetail,
   BiPackage,
   BiPlanet,
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
import { db } from "../../lib/firebase-config";
import { chat } from "../../lib/chat_firebase";

const LayoutDashboard = ({ title, children }) => {
   const { state, dispatch } = useContext(Store);
   const { userInfo, agencyInfo } = state;
   const [agency, setAgency] = useState<any>({});
   const router = useRouter();
   const [openStatisticle, setOpenStatisticle] = useState(false);
   const [openPost, setOpenPost] = useState(false);
   const [loading, setLoading] = useState(false);
   const [unSeen, setUnSeen] = useState(false);
   const [isMessages, setIsMessages] = useState(false);
   const [numberLabelCurrent, setNumberLabelCurrent] = useState(0);

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
      if (agencyInfo && userInfo.role.id === 2) {
         SnapFirestore();
      } else {
         router.push("/403");
      }
   }, []);

   useEffect(() => {
      console.log(router.pathname);

      switch (router.pathname) {
         case "/DashboardManager":
            setNumberLabelCurrent(1);
            break;
         case "/DashboardManager/notification":
            setNumberLabelCurrent(2);
            break;
         case "/DashboardManager/message":
            setNumberLabelCurrent(3);
            break;
         case "/DashboardManager/posts/createnewpost":
            setNumberLabelCurrent(4);
            break;
         case "/DashboardManager/posts":
            setNumberLabelCurrent(5);
            break;
         case "/DashboardManager/posts/[id]":
            setNumberLabelCurrent(5);
            break;
         case "/DashboardManager/promotion":
            setNumberLabelCurrent(6);
            break;
         case "/DashboardManager/orders":
            setNumberLabelCurrent(7);
            break;
         case "/DashboardManager/statisticle/category":
            setNumberLabelCurrent(8);
            break;
         case "/DashboardManager/statisticle/bestseller":
            setNumberLabelCurrent(8);
            break;
         case "/DashboardManager/statisticle/revenue":
            setNumberLabelCurrent(8);
            break;
         case "/DashboardManager/renewal":
            setNumberLabelCurrent(9);
            break;
         case "/DashboardManager/renewal/serviceplan":
            setNumberLabelCurrent(9);
            break;
         default:
            setNumberLabelCurrent(0);
      }
   }, []);

   useEffect(() => {
      try {
         const unsuscribe = onSnapshot(
            collection(chat, `agency${agencyInfo?.id}`),
            (snapshot) => {
               let customers = [];
               setIsMessages(false);

               snapshot.forEach((doc) => {
                  customers.push({ ...doc.data() });
               });
               customers.map((cus) => {
                  if (cus.isSeen == false) {
                     setIsMessages(true);
                  }
               });
            }
         );

         return () => unsuscribe();
      } catch (error) {
         console.log(error);
      }
   }, []);

   return (
      <div>
         <Head>
            <title>{title ? title + " - Manager Page" : "Manager Page"}</title>
            <meta name="description" content="Ecommerce Website" />
            <meta
               name="viewport"
               content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
            />
         </Head>
         <div className="grid grid-cols-6">
            {/* Side Bar */}
            <div className="col-span-1 dark:bg-dark-primary bg-light-primary h-screen sticky top-0">
               <div className="flex justify-center my-3">
                  <Link href="/">
                     <Logo width="125" />
                  </Link>
               </div>
               <div className="bg-slate-400 bg-opacity-20 mx-4 p-4 rounded-lg">
                  <div className="relative overflow-hidden w-28 aspect-square rounded-xl mx-auto">
                     <Image
                        src={agencyInfo ? agencyInfo.avatar : ""}
                        alt="img"
                        className="object-cover"
                        layout="fill"
                     />
                  </div>
                  <div className="mt-2 text-center">
                     <div className="font-semibold">
                        {agencyInfo ? agencyInfo.name : ""}
                     </div>
                     <div className="text-sm">Manager Merchant</div>
                  </div>
                  <div className="mt-2">
                     <button
                        className="bg-primary-color text-white font-semibold w-full py-2 rounded-lg hover:brightness-90 hover:shadow-lg hover:shadow-primary-color"
                        onClick={() =>
                           router.push("/DashboardManager/editinfo")
                        }
                     >
                        Edit profile
                     </button>
                  </div>
               </div>
               {/* navigate */}
               <div className="my-4 mx-4 max-h-[360px] overflow-auto">
                  <Link href="/DashboardManager">
                     <div
                        className={`font-semibold rounded-lg p-2 mb-2 cursor-pointer hover:bg-slate-500 hover:bg-opacity-10 hover:text-primary-color flex items-center gap-3 ${
                           numberLabelCurrent == 1 && "bg-slate-300"
                        }`}
                     >
                        <BiHomeAlt className="text-lg" />
                        General
                     </div>
                  </Link>
                  <Link href="/DashboardManager/notification">
                     <div
                        className={`font-semibold rounded-lg p-2 mb-2 cursor-pointer hover:bg-slate-500 hover:bg-opacity-10 hover:text-primary-color flex items-center gap-3 ${
                           numberLabelCurrent == 2 && "bg-slate-300"
                        }`}
                     >
                        <BiBell className="text-lg" />
                        Notification{" "}
                        {unSeen ? (
                           <span className="w-3 h-3 bg-primary-color rounded-full"></span>
                        ) : (
                           <></>
                        )}
                     </div>
                  </Link>
                  <Link href="/DashboardManager/message">
                     <div
                        className={`font-semibold rounded-lg p-2 mb-2 cursor-pointer hover:bg-slate-500 hover:bg-opacity-10 hover:text-primary-color flex items-center gap-3 ${
                           numberLabelCurrent == 3 && "bg-slate-300"
                        }`}
                     >
                        <BiMessageDetail className="text-lg" />
                        Message{" "}
                        {isMessages && (
                           <span className="w-3 h-3 rounded-full bg-primary-color"></span>
                        )}
                     </div>
                  </Link>
                  <Link href="/DashboardManager/posts/createnewpost">
                     <div
                        className={`font-semibold rounded-lg p-2 mb-2 cursor-pointer hover:bg-slate-500 hover:bg-opacity-10 hover:text-primary-color flex items-center gap-3 ${
                           numberLabelCurrent == 4 && "bg-slate-300"
                        }`}
                     >
                        <BiAddToQueue className="text-lg" />
                        Create Post
                     </div>
                  </Link>
                  <Link href="/DashboardManager/posts">
                     <div
                        className={`font-semibold rounded-lg p-2 mb-2 cursor-pointer hover:bg-slate-500 hover:bg-opacity-10 hover:text-primary-color flex items-center gap-3 ${
                           numberLabelCurrent == 5 && "bg-slate-300"
                        }`}
                     >
                        <BiCategoryAlt className="text-lg" />
                        List Product
                     </div>
                  </Link>
                  {/* <div>
                     <div
                        className="font-semibold rounded-lg p-2 mb-2 cursor-pointer hover:bg-slate-500 hover:bg-opacity-10 hover:text-primary-color flex items-center gap-3 relative"
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
                  </div> */}
                  <Link href="/DashboardManager/promotion">
                     <div
                        className={`font-semibold rounded-lg p-2 mb-2 cursor-pointer hover:bg-slate-500 hover:bg-opacity-10 hover:text-primary-color flex items-center gap-3 ${
                           numberLabelCurrent == 6 && "bg-slate-300"
                        }`}
                     >
                        <BiPlanet className="text-lg" />
                        Promotion
                     </div>
                  </Link>
                  <Link href="/DashboardManager/orders">
                     <div
                        className={`font-semibold rounded-lg p-2 mb-2 cursor-pointer hover:bg-slate-500 hover:bg-opacity-10 hover:text-primary-color flex items-center gap-3 ${
                           numberLabelCurrent == 7 && "bg-slate-300"
                        }`}
                     >
                        <BiPackage className="text-lg" />
                        Tracking Order
                     </div>
                  </Link>
                  <div>
                     <div
                        className={`font-semibold rounded-lg p-2 mb-2 cursor-pointer hover:bg-slate-500 hover:bg-opacity-10 hover:text-primary-color flex items-center gap-3 relative ${
                           numberLabelCurrent == 8 && "bg-slate-300"
                        }`}
                        onClick={() => setOpenStatisticle(!openStatisticle)}
                     >
                        <BiBarChartAlt2 className="text-lg" />
                        Statistical
                        <BiChevronRight
                           className={`absolute right-2 font-semibold text-2xl transition-all ${
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
                              By Category
                           </div>
                        </Link>
                        <Link href="/DashboardManager/statisticle/bestseller">
                           <div className="p-2 dark:hover:bg-dark-spot hover:bg-slate-300 rounded-lg cursor-pointer">
                              Best Seller
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
                     <div
                        className={`font-semibold rounded-lg p-2 mb-2 cursor-pointer hover:bg-slate-500 hover:bg-opacity-10 hover:text-primary-color flex items-center gap-3 ${
                           numberLabelCurrent == 9 && "bg-slate-300"
                        }`}
                     >
                        <BiRocket className="text-lg" />
                        Renewal
                     </div>
                  </Link>
               </div>
               <div className="absolute bottom-4 flex justify-center items-center gap-2 w-full">
                  <Link href="/">
                     <button
                        className="rounded-lg bg-primary-color hover:brightness-90 hover:shadow-lg hover:shadow-primary-color h-10 w-fit px-3 font-semibold text-sm text-dark-text"
                        title="Back to Homepage"
                     >
                        Back to Homepage
                     </button>
                  </Link>
                  <button
                     className=" bg-primary-color hover:brightness-90 hover:shadow-lg hover:shadow-primary-color rounded-lg text-xl h-10 w-fit px-3 text-dark-text"
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
