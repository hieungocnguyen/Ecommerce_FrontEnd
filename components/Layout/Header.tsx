/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import Logo from "../Logo";
import ThemeToggler from "../ThemeToggler";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { Store } from "../../utils/Store";
import Cookies from "js-cookie";
import router, { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import API, { endpoints } from "../../API";

const Header = () => {
   const { state, dispatch } = useContext(Store);
   const router = useRouter();
   const [replacePart, setReplacePart] = useState(<></>);
   const { cart, userInfo } = state;
   const [numberItem, setNumberItem] = useState(0);
   const [rolePart, setRolePart] = useState(<></>);
   const [agency, setAgency] = useState<any>({});

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
   const handleToggleMenu = () => {
      const menu = document.querySelector("#menuUser");
      menu.classList.toggle("hidden");
   };
   const forwardManagerDashboard = async () => {
      const resAllAgency = await API.get(endpoints["all_agency"]);
      resAllAgency.data.data.map(async (a) => {
         if (a.manager.id === userInfo.id) {
            const resInfoAngency = await API.get(
               endpoints["agency_info"](a.id)
            );
            setAgency(a);
            Cookies.set("agencyInfo", JSON.stringify(a));
            dispatch({ type: "AGENCY_INFO_SET", payload: a });
         }
      });
      if (userInfo.role.name === "ROLE_ADMIN") {
         router.push("/DashboardAdmin");
      } else {
         router.push("/DashboardManager");
      }
   };
   useEffect(() => {
      const loadNumberofItems = async () => {
         const resNumber = await API.get(
            endpoints["get_cart_by_id"](userInfo.id)
         );
         if (resNumber.data.data.cartItemSet) {
            setNumberItem(resNumber.data.data.cartItemSet.length);
         }
      };
      if (userInfo) {
         loadNumberofItems();
      }
   }, [numberItem, cart]);

   useEffect(() => {
      if (userInfo != null) {
         setReplacePart(
            <div className="relative">
               <img
                  src={userInfo.avatar}
                  className="w-[40px] h-[40px] rounded-full cursor-pointer border-[3px] border-blue-main"
                  alt="avatar"
                  onClick={handleToggleMenu}
               />
               <div
                  id="menuUser"
                  className="absolute top-14 right-0 dark:bg-dark-primary 
                  bg-light-primary rounded-lg z-10 hidden font-semibold"
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
                           {rolePart}
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
         );
      } else {
         setReplacePart(
            <div>
               <Link href="/signin">
                  <button className="py-2 px-3 bg-[#525EC1] text-light-bg rounded-lg mr-4 text-sm font-semibold hover:opacity-75">
                     Sign in
                  </button>
               </Link>
            </div>
         );
      }
   }, [userInfo, rolePart]);
   useEffect(() => {
      if (userInfo != null) {
         if (userInfo.role.name === "ROLE_ADMIN") {
            setRolePart(<div>Admin Page</div>);
         }
         if (userInfo.role.name === "ROLE_MANAGER") {
            setRolePart(<div>Manager Page</div>);
         }
      }
   }, []);

   return (
      <div className="bg-light-primary dark:bg-dark-primary flex justify-between items-center w-[90%] mx-auto rounded-b-lg py-[10px]">
         <div className="ml-7 flex items-center justify-center">
            <div className="flex items-center justify-center cursor-pointer border-[3px] border-[#30373D] dark:border-light-bg w-[40px] h-[30px] rounded-lg font-bold mr-3 text-xs">
               VI
            </div>
            <ThemeToggler />
         </div>
         <div>
            <Link href="/">
               <a>
                  <Logo width="125" />
               </a>
            </Link>
         </div>
         <div className="mr-10 flex items-center">
            <Link href="/cart">
               <button className="w-10 h-10 hover:bg-slate-300 dark:hover:bg-neutral-800 flex items-center justify-center hover: rounded-lg mr-6 relative">
                  <HiOutlineShoppingCart className="w-6 h-6" />
                  {numberItem > 0 ? (
                     <div className="absolute bg-blue-main rounded-full top-[-4px] right-[-8px] font-semibold w-6 h-6 flex justify-center items-center text-sm text-white">
                        {numberItem}
                     </div>
                  ) : (
                     <></>
                  )}
               </button>
            </Link>

            {/* {userInfo ? (
               <div className="relative">
                  <img
                     src={userInfo.avatar}
                     className="w-[40px] h-[40px] rounded-full cursor-pointer"
                     alt="avatar"
                     onClick={handleToggleMenu}
                  />
                  <div
                     id="menuUser"
                     className="absolute top-14 right-0 dark:bg-dark-primary rounded-lg z-10 hidden"
                  >
                     <div className="p-3 cursor-pointer hover:opacity-80">
                        Profile
                     </div>
                     <div className="p-3 cursor-pointer hover:opacity-80">
                        Wishlist
                     </div>
                     <div
                        className="p-3 cursor-pointer hover:opacity-80 whitespace-nowrap"
                        onClick={logoutClickHandler}
                     >
                        Sign out
                     </div>
                  </div>
               </div>
            ) : (
               <div>
                  <Link href="/signin">
                     <button className="py-2 px-3 bg-[#525EC1] text-light-bg rounded-lg mr-4 text-sm font-semibold hover:opacity-75">
                        Sign in
                     </button>
                  </Link>
               </div>
            )} */}
            {replacePart}
         </div>
         <Toaster />
      </div>
   );
};

export default Header;
