/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React, {
   Suspense,
   useContext,
   useEffect,
   useRef,
   useState,
} from "react";
import Logo from "../Logo";
import ThemeToggler from "../ThemeToggler";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { Store } from "../../utils/Store";
import Cookies from "js-cookie";
import router, { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import API, { endpoints } from "../../API";
import Image from "next/image";
import { BiBell } from "react-icons/bi";

const Header = () => {
   const { state, dispatch } = useContext(Store);
   const router = useRouter();
   const { pathname, asPath, query } = router;
   const { cart, userInfo } = state;
   const [numberItem, setNumberItem] = useState(0);
   const [isOpen, setIsOpen] = useState(false);
   const [agencyInfo, setAgencyInfo] = useState<any>({});

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
   const forwardManagerDashboard = async () => {
      try {
         // const resAllAgency = await API.get(endpoints["all_agency"]);
         // resAllAgency.data.data.map(async (agency) => {
         //    if (agency.manager.id === userInfo.id) {
         //       const resInfoAngency = await API.get(
         //          endpoints["agency_info"](agency.id)
         //       );
         //       Cookies.set("agencyInfo", JSON.stringify(agency));
         //       dispatch({ type: "AGENCY_INFO_SET", payload: agency });
         //    }
         // });
         if (userInfo.role.name === "ROLE_ADMIN") {
            router.push("/DashboardAdmin");
         } else {
            router.push("/DashboardManager");
         }
      } catch (error) {
         console.log(error);
      }
   };

   const handleCartRoute = () => {
      if (userInfo) {
         router.push("/cart");
      } else {
         toast.error("Login to view cart!", {
            position: "top-center",
         });
      }
   };
   const loadNumberofItems = async () => {
      try {
         const resNumber = await API.get(
            endpoints["get_cart_by_id"](userInfo.id)
         );
         if (resNumber.data.data.cartItemSet) {
            setNumberItem(resNumber.data.data.cartItemSet.length);
         }
      } catch (error) {
         console.log(error);
      }
   };
   const fetchAgency = async () => {
      try {
         const resAllAgency = await API.get(endpoints["all_agency"]);
         resAllAgency.data.data.map(async (agency) => {
            if (agency.manager.id === userInfo.id) {
               const resInfoAngency = await API.get(
                  endpoints["agency_info"](agency.id)
               );
               Cookies.set("agencyInfo", JSON.stringify(agency));
               dispatch({ type: "AGENCY_INFO_SET", payload: agency });
               setAgencyInfo(agency);
            }
         });
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      if (userInfo) {
         loadNumberofItems();
         fetchAgency();
      }
   }, [cart]);

   return (
      <div className="bg-light-primary dark:bg-dark-primary flex justify-between items-center w-[90%] mx-auto rounded-b-lg py-[10px]">
         <div className="ml-7 flex items-center justify-center gap-2">
            {/* <div
               className="p-2 font-semibold bg-light-primary rounded-lg dark:bg-dark-primary flex items-center justify-center hover:bg-slate-300 dark:hover:bg-neutral-800 cursor-pointer hover:text-blue-main"
               onClick={() => {
                  router.push({ pathname, query }, asPath, { locale: "en" });
               }}
            >
               EN
            </div>
            <div
               className="p-2 font-semibold bg-light-primary rounded-lg dark:bg-dark-primary flex items-center justify-center hover:bg-slate-300 dark:hover:bg-neutral-800 cursor-pointer hover:text-blue-main"
               onClick={() => {
                  router.push({ pathname, query }, asPath, { locale: "vi" });
               }}
            >
               VI
            </div> */}
            <ThemeToggler />
            <div className="w-10 h-10 bg-light-primary rounded-lg dark:bg-dark-primary flex items-center justify-center hover:bg-slate-300 dark:hover:bg-neutral-800 cursor-pointer">
               <BiBell className="w-6 h-6 hover:text-blue-main" />
            </div>
         </div>
         <div>
            <Link href="/" title="Home">
               <div className="cursor-pointer">
                  <Logo width="125" />
               </div>
            </Link>
         </div>
         <Suspense fallback={<p></p>}>
            <div className="mr-10 flex items-center">
               {userInfo && userInfo.role.name !== "ROLE_GENERAL" ? (
                  <>
                     <div
                        className={`font-extrabold p-1 border-2 uppercase text-xs rounded-md ${
                           agencyInfo.isActive === 0 &&
                           userInfo.role.name === "ROLE_MANAGER"
                              ? "text-red-600 border-red-600"
                              : "text-blue-main border-blue-main "
                        }`}
                     >
                        {userInfo.role.name === "ROLE_ADMIN" ? (
                           <>admin</>
                        ) : (
                           <>manager</>
                        )}
                     </div>
                  </>
               ) : (
                  <></>
               )}
               <button
                  className="w-10 h-10 hover:bg-slate-300 dark:hover:bg-neutral-800 flex items-center justify-center hover: rounded-lg mx-4 relative"
                  title="cart"
                  onClick={handleCartRoute}
               >
                  <HiOutlineShoppingCart className="w-6 h-6" />
                  {numberItem > 0 ? (
                     <div className="absolute bg-blue-main rounded-full top-[-4px] right-[-8px] font-semibold w-6 h-6 flex justify-center items-center text-sm text-white">
                        {numberItem}
                        {/* {cart.cartItems.length} */}
                     </div>
                  ) : (
                     <></>
                  )}
               </button>
               {userInfo ? (
                  <>
                     <div className="relative">
                        <div className="w-10 h-10 relative overflow-hidden border-[3px] border-blue-main rounded-full">
                           <Image
                              src={userInfo.avatar}
                              className="cursor-pointer object-cover"
                              alt="avatar"
                              layout="fill"
                              onClick={() => setIsOpen(!isOpen)}
                           />
                        </div>
                        <div
                           className={`absolute top-14 right-0 dark:bg-dark-primary bg-light-primary rounded-lg z-20 font-semibold transition-all ease-out duration-200 ${
                              isOpen
                                 ? "scale-100"
                                 : "scale-0 translate-x-16 -translate-y-36"
                           }`}
                        >
                           <Link href="/profile">
                              <div className="p-3 px-4 cursor-pointer  hover:text-blue-main transition-all">
                                 Profile
                              </div>
                           </Link>
                           {userInfo ? (
                              userInfo.role.name === "ROLE_GENERAL" ? (
                                 <></>
                              ) : (
                                 <div
                                    className="p-3 px-4 cursor-pointer  hover:text-blue-main transition-all whitespace-nowrap"
                                    onClick={forwardManagerDashboard}
                                 >
                                    {userInfo.role.name === "ROLE_ADMIN" ? (
                                       <>
                                          <div>Admin Page</div>
                                       </>
                                    ) : (
                                       <>
                                          {userInfo.role.name ===
                                          "ROLE_MANAGER" ? (
                                             <>
                                                <div>Manage Page</div>
                                             </>
                                          ) : (
                                             <></>
                                          )}
                                       </>
                                    )}
                                 </div>
                              )
                           ) : (
                              <></>
                           )}

                           <Link href="/orders">
                              <div className="p-3 px-4 cursor-pointer  hover:text-blue-main transition-all">
                                 Orders
                              </div>
                           </Link>
                           <Link href={"/wishlist"}>
                              <div className="p-3 px-4 cursor-pointer  hover:text-blue-main transition-all">
                                 Wishlist
                              </div>
                           </Link>
                           <div
                              className="p-3 px-4 cursor-pointer hover:text-blue-main transition-all whitespace-nowrap"
                              onClick={logoutClickHandler}
                           >
                              Sign out
                           </div>
                        </div>
                     </div>
                  </>
               ) : (
                  <>
                     <div>
                        <Link href="/signin">
                           <button className="py-2 px-3 bg-[#525EC1] text-light-bg rounded-lg mr-4 text-sm font-semibold hover:shadow-md hover:shadow-blue-main">
                              Sign in
                           </button>
                        </Link>
                     </div>
                  </>
               )}
            </div>
         </Suspense>
         <Toaster />
      </div>
   );
};

export default Header;
