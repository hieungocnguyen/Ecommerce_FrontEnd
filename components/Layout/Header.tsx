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
import { BiArrowBack, BiBell, BiChevronDown, BiMenu } from "react-icons/bi";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase-config";
import moment from "moment";

const Header = () => {
   const { state, dispatch } = useContext(Store);
   const router = useRouter();
   const { pathname, asPath, query, locale } = router;
   const { cart, userInfo } = state;
   const [numberItem, setNumberItem] = useState(0);
   const [isOpen, setIsOpen] = useState(false);
   const [agencyInfo, setAgencyInfo] = useState<any>({});
   const [isOpenLangOption, setIsOpenLangOption] = useState(false);
   const [notiList, setNotiList] = useState([]);
   const [isNotiOpen, setIsNotiOpen] = useState(false);
   const [unSeen, setUnSeen] = useState(false);

   const [isOpenMenuMobile, setIsOpenMenuMobile] = useState(false);

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
      if (userInfo.role.name === "ROLE_ADMIN") {
         router.push("/DashboardAdmin");
      } else {
         router.push("/DashboardManager");
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

   const loadUser = async () => {
      try {
         const resUser = await API.get(endpoints["user"](userInfo.id));
         Cookies.set("userInfo", JSON.stringify(resUser.data.data));
         dispatch({ type: "USER_LOGIN", payload: resUser.data.data });
      } catch (error) {
         console.log(error);
      }
   };

   const fetchAgency = async () => {
      try {
         const res = await API.get(
            endpoints["get_agency_info_by_userID"](userInfo.id)
         );
         if (res.data.data != null) {
            Cookies.set("agencyInfo", JSON.stringify(res.data.data));
            dispatch({ type: "AGENCY_INFO_SET", payload: res.data.data });
            setAgencyInfo(res.data.data);
         }
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      if (userInfo) {
         loadNumberofItems();
         fetchAgency();
         loadUser();
      }
   }, [cart]);

   //firestore connect
   useEffect(() => {
      if (userInfo) {
         const unsubcribe = onSnapshot(
            collection(db, `user-${userInfo.id}`),
            (snapshot) => {
               setNotiList(
                  snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
               );
               snapshot.docs.map((doc) => {
                  if (doc.data().seen === false) {
                     setUnSeen(true);
                  }
               });
            }
         );
         return () => {
            unsubcribe();
         };
      }
   }, [userInfo]);

   const fetchChangeSeenNoti = async () => {
      try {
         if (userInfo) {
            const res = await API.get(
               endpoints["update_seen_status"](`user-${userInfo.id}`)
            );
            console.log(res.data);
            setUnSeen(false);
         }
      } catch (error) {
         console.log(error);
         toast.error("Something wrong, please try again!");
      }
   };

   return (
      <div className="bg-light-primary dark:bg-dark-primary grid grid-cols-3 items-center sm:w-[90%] w-full mx-auto rounded-b-lg py-3 px-3">
         <div className="relative flex items-center justify-start gap-2">
            <div
               className="bg-light-primary rounded-lg dark:bg-dark-primary w-10 h-10 sm:hidden flex items-center justify-center hover:bg-slate-300 dark:hover:bg-neutral-800 cursor-pointer"
               onClick={() => setIsOpenMenuMobile(!isOpenMenuMobile)}
            >
               <BiMenu className="w-6 h-6 hover:text-primary-color" />
            </div>
            {/* mobile option */}
            <div
               className={`sm:hidden fixed ${
                  isOpenMenuMobile ? "left-0" : "-left-full"
               } left-0 top-0 z-30 w-full h-16 p-3 bg-light-primary dark:bg-dark-primary transition-all grid grid-cols-3`}
            >
               <div className="flex justify-center">
                  <ThemeToggler />
               </div>
               <div className="relative flex justify-center">
                  <div
                     className="p-2 font-semibold bg-light-primary rounded-lg dark:bg-dark-primary flex items-center justify-center gap-1 hover:bg-slate-300 dark:hover:bg-neutral-800 cursor-pointer hover:text-primary-color max-w-[86px]"
                     onClick={() => {
                        setIsOpenLangOption(!isOpenLangOption);
                     }}
                  >
                     {locale === "vi" ? (
                        <>
                           <span>
                              <svg
                                 xmlns="http://www.w3.org/2000/svg"
                                 viewBox="0 0 900 600"
                                 width={22}
                              >
                                 <rect
                                    width="900"
                                    height="600"
                                    fill="#da251d"
                                 />
                                 <polygon
                                    points="515.47 321.24 621.3 244.5 490.51 244.5 450 120 409.5 244.5 278.7 244.5 384.53 321.24 344.1 445.5 450 368.71 555.9 445.5 515.47 321.24"
                                    fill="#ff0"
                                 />
                              </svg>
                           </span>
                           <span>VI</span>
                           <span>
                              <BiChevronDown className="text-2xl" />
                           </span>
                        </>
                     ) : (
                        <>
                           <span>
                              <svg
                                 xmlns="http://www.w3.org/2000/svg"
                                 viewBox="0 0 1990 1050"
                                 width={22}
                              >
                                 <rect
                                    y="0.1"
                                    width="1989.48"
                                    height="1048.2"
                                    fill="#fff"
                                 />
                                 <polygon
                                    points="1989.63 419.52 1113.63 419.52 1113.63 0.16 874.51 0.16 874.51 419.52 0.83 419.52 0.83 629.09 874.51 629.09 874.51 1048.28 1113.63 1048.28 1113.63 629.09 1989.63 629.09 1989.63 419.52"
                                    fill="#ce1124"
                                 />
                                 <polygon
                                    points="0.02 122.15 0.02 350.38 433.95 350.38 0.02 122.15"
                                    fill="#00247d"
                                 />
                                 <polygon
                                    points="239.42 0.05 233.06 0.34 795.72 297.83 795.72 0.05 239.42 0.05"
                                    fill="#00247d"
                                 />
                                 <polygon
                                    points="667.79 348.93 0.02 0.1 0.02 82.32 508.67 348.93 667.79 348.93"
                                    fill="#ce1124"
                                 />
                                 <polygon
                                    points="1322.21 699.36 1989.99 1048.19 1989.99 965.97 1481.34 699.36 1322.21 699.36"
                                    fill="#ce1124"
                                 />
                                 <polygon
                                    points="0.02 927.9 0.02 699.67 433.95 699.67 0.02 927.9"
                                    fill="#00247d"
                                 />
                                 <polygon
                                    points="239.42 1050 233.06 1049.71 795.72 752.22 795.72 1050 239.42 1050"
                                    fill="#00247d"
                                 />
                                 <polygon
                                    points="664.38 699.34 0.46 1048.01 155.73 1048.16 796.36 713.52 796.36 699.34 664.38 699.34"
                                    fill="#ce1124"
                                 />
                                 <polygon
                                    points="1990 122.1 1990 350.32 1556.07 350.32 1990 122.1"
                                    fill="#00247d"
                                 />
                                 <polygon
                                    points="1750.6 0 1756.96 0.29 1194.3 297.78 1194.3 0 1750.6 0"
                                    fill="#00247d"
                                 />
                                 <polygon
                                    points="1989.36 0.49 1840.01 0.48 1194.87 337.48 1194.87 349.3 1331.36 349.3 1989.36 0.49"
                                    fill="#ce1124"
                                 />
                                 <polygon
                                    points="1990 927.81 1990 699.59 1556.07 699.59 1990 927.81"
                                    fill="#00247d"
                                 />
                                 <polygon
                                    points="1750.6 1049.91 1756.96 1049.63 1194.3 752.13 1194.3 1049.91 1750.6 1049.91"
                                    fill="#00247d"
                                 />
                              </svg>
                           </span>
                           <span>EN</span>
                           <span>
                              <BiChevronDown className="text-2xl" />
                           </span>
                        </>
                     )}
                  </div>
                  <div
                     className={`absolute z-20  left-0 bg-light-primary rounded-lg dark:bg-dark-primary p-2 font-medium transition-all ${
                        isOpenLangOption
                           ? "scale-100 -bottom-[7rem] left-0"
                           : "scale-0 -bottom-10 -left-10"
                     }`}
                  >
                     <div
                        className="py-2 px-3 hover:bg-slate-300 dark:hover:bg-neutral-800 cursor-pointer hover:text-primary-color rounded-xl flex items-center gap-2"
                        onClick={() => {
                           router.replace({ pathname, query }, asPath, {
                              locale: "vi",
                           });
                           setIsOpenLangOption(false);
                        }}
                     >
                        <span>
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 900 600"
                              width={22}
                           >
                              <rect width="900" height="600" fill="#da251d" />
                              <polygon
                                 points="515.47 321.24 621.3 244.5 490.51 244.5 450 120 409.5 244.5 278.7 244.5 384.53 321.24 344.1 445.5 450 368.71 555.9 445.5 515.47 321.24"
                                 fill="#ff0"
                              />
                           </svg>
                        </span>
                        <span>Vietnamese</span>
                     </div>
                     <div
                        className="py-2 px-3 hover:bg-slate-300 dark:hover:bg-neutral-800 cursor-pointer hover:text-primary-color rounded-xl flex items-center gap-2"
                        onClick={() => {
                           router.replace({ pathname, query }, asPath, {
                              locale: "en",
                           });
                           setIsOpenLangOption(false);
                        }}
                     >
                        <span>
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 1990 1050"
                              width={22}
                           >
                              <rect
                                 y="0.1"
                                 width="1989.48"
                                 height="1048.2"
                                 fill="#fff"
                              />
                              <polygon
                                 points="1989.63 419.52 1113.63 419.52 1113.63 0.16 874.51 0.16 874.51 419.52 0.83 419.52 0.83 629.09 874.51 629.09 874.51 1048.28 1113.63 1048.28 1113.63 629.09 1989.63 629.09 1989.63 419.52"
                                 fill="#ce1124"
                              />
                              <polygon
                                 points="0.02 122.15 0.02 350.38 433.95 350.38 0.02 122.15"
                                 fill="#00247d"
                              />
                              <polygon
                                 points="239.42 0.05 233.06 0.34 795.72 297.83 795.72 0.05 239.42 0.05"
                                 fill="#00247d"
                              />
                              <polygon
                                 points="667.79 348.93 0.02 0.1 0.02 82.32 508.67 348.93 667.79 348.93"
                                 fill="#ce1124"
                              />
                              <polygon
                                 points="1322.21 699.36 1989.99 1048.19 1989.99 965.97 1481.34 699.36 1322.21 699.36"
                                 fill="#ce1124"
                              />
                              <polygon
                                 points="0.02 927.9 0.02 699.67 433.95 699.67 0.02 927.9"
                                 fill="#00247d"
                              />
                              <polygon
                                 points="239.42 1050 233.06 1049.71 795.72 752.22 795.72 1050 239.42 1050"
                                 fill="#00247d"
                              />
                              <polygon
                                 points="664.38 699.34 0.46 1048.01 155.73 1048.16 796.36 713.52 796.36 699.34 664.38 699.34"
                                 fill="#ce1124"
                              />
                              <polygon
                                 points="1990 122.1 1990 350.32 1556.07 350.32 1990 122.1"
                                 fill="#00247d"
                              />
                              <polygon
                                 points="1750.6 0 1756.96 0.29 1194.3 297.78 1194.3 0 1750.6 0"
                                 fill="#00247d"
                              />
                              <polygon
                                 points="1989.36 0.49 1840.01 0.48 1194.87 337.48 1194.87 349.3 1331.36 349.3 1989.36 0.49"
                                 fill="#ce1124"
                              />
                              <polygon
                                 points="1990 927.81 1990 699.59 1556.07 699.59 1990 927.81"
                                 fill="#00247d"
                              />
                              <polygon
                                 points="1750.6 1049.91 1756.96 1049.63 1194.3 752.13 1194.3 1049.91 1750.6 1049.91"
                                 fill="#00247d"
                              />
                           </svg>
                        </span>
                        <span>English</span>
                     </div>
                  </div>
               </div>
               <div
                  className="w-10 h-10 bg-light-primary rounded-lg dark:bg-dark-primary flex items-center justify-center mx-auto hover:bg-slate-300 dark:hover:bg-neutral-800 cursor-pointer"
                  onClick={() => setIsOpenMenuMobile(!isOpenMenuMobile)}
               >
                  <BiArrowBack className="w-6 h-6 hover:text-primary-color" />
               </div>
            </div>

            <div
               className="w-10 h-10 bg-light-primary rounded-lg dark:bg-dark-primary flex items-center justify-center hover:bg-slate-300 dark:hover:bg-neutral-800 cursor-pointer"
               onClick={() => {
                  if (isNotiOpen === true) {
                     fetchChangeSeenNoti();
                  }
                  setIsNotiOpen(!isNotiOpen);
               }}
            >
               <BiBell className="w-6 h-6 hover:text-primary-color" />
               {unSeen ? (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></div>
               ) : (
                  <div></div>
               )}
            </div>
            <div
               className={`absolute -left-5 top-14 z-20 rounded-lg bg-light-primary dark:bg-dark-primary overflow-auto w-[34rem] transition-all ease-out ${
                  notiList.length > 5 ? "h-[26rem]" : "h-fit"
               } ${
                  isNotiOpen
                     ? "scale-100 "
                     : "scale-0 -translate-x-64 -translate-y-40"
               }`}
            >
               {notiList.sort((a, b) =>
                  a.data.createdDate.seconds < b.data.createdDate.seconds
                     ? 1
                     : -1
               ).length > 0 ? (
                  notiList.map((noti) => (
                     <div
                        key={noti.id}
                        className={`flex gap-4 items-center p-3 hover:bg-[#bdbec5] dark:hover:bg-[#191919] ${
                           noti.data.seen === true
                              ? "bg-light-primary dark:bg-dark-primary"
                              : "bg-[#d3d4dc] dark:bg-dark-spot"
                        }`}
                     >
                        <div>
                           <div className="relative overflow-hidden aspect-square h-16 rounded-xl ">
                              <Image
                                 src={noti.data.image}
                                 alt="noti"
                                 layout="fill"
                                 className="object-cover"
                              />
                           </div>
                        </div>
                        <div className="w-full">
                           <div className="whitespace-nowrap font-semibold mb-1 flex items-center gap-2">
                              {!noti.data.seen && (
                                 <div className="w-3 h-3 rounded-full bg-red-600"></div>
                              )}
                              <div>{noti.data.title}</div>
                           </div>

                           <div className="text-sm mb-3">
                              {noti.data.details}
                           </div>
                           <div className="flex justify-between items-center w-full">
                              <div className="font-semibold text-xs bg-primary-color rounded-md py-0.5 px-1 text-white inline-block">
                                 {noti.data.type}
                              </div>
                              <div className="text-sm italic">
                                 {moment(noti.data.createdDate.seconds * 1000)
                                    .startOf("m")
                                    .fromNow()}
                              </div>
                           </div>
                        </div>
                     </div>
                  ))
               ) : (
                  <div className="whitespace-nowrap p-6 font-semibold">
                     You not have any notification!
                  </div>
               )}
            </div>
            <div className="sm:flex hidden ">
               <ThemeToggler />
               <div className="relative">
                  <div
                     className="p-2 font-semibold bg-light-primary rounded-lg dark:bg-dark-primary flex items-center justify-center gap-1 hover:bg-slate-300 dark:hover:bg-neutral-800 cursor-pointer hover:text-primary-color max-w-[86px]"
                     onClick={() => {
                        setIsOpenLangOption(!isOpenLangOption);
                     }}
                  >
                     {locale === "vi" ? (
                        <>
                           <span>
                              <svg
                                 xmlns="http://www.w3.org/2000/svg"
                                 viewBox="0 0 900 600"
                                 width={22}
                              >
                                 <rect
                                    width="900"
                                    height="600"
                                    fill="#da251d"
                                 />
                                 <polygon
                                    points="515.47 321.24 621.3 244.5 490.51 244.5 450 120 409.5 244.5 278.7 244.5 384.53 321.24 344.1 445.5 450 368.71 555.9 445.5 515.47 321.24"
                                    fill="#ff0"
                                 />
                              </svg>
                           </span>
                           <span>VI</span>
                           <span>
                              <BiChevronDown className="text-2xl" />
                           </span>
                        </>
                     ) : (
                        <>
                           <span>
                              <svg
                                 xmlns="http://www.w3.org/2000/svg"
                                 viewBox="0 0 1990 1050"
                                 width={22}
                              >
                                 <rect
                                    y="0.1"
                                    width="1989.48"
                                    height="1048.2"
                                    fill="#fff"
                                 />
                                 <polygon
                                    points="1989.63 419.52 1113.63 419.52 1113.63 0.16 874.51 0.16 874.51 419.52 0.83 419.52 0.83 629.09 874.51 629.09 874.51 1048.28 1113.63 1048.28 1113.63 629.09 1989.63 629.09 1989.63 419.52"
                                    fill="#ce1124"
                                 />
                                 <polygon
                                    points="0.02 122.15 0.02 350.38 433.95 350.38 0.02 122.15"
                                    fill="#00247d"
                                 />
                                 <polygon
                                    points="239.42 0.05 233.06 0.34 795.72 297.83 795.72 0.05 239.42 0.05"
                                    fill="#00247d"
                                 />
                                 <polygon
                                    points="667.79 348.93 0.02 0.1 0.02 82.32 508.67 348.93 667.79 348.93"
                                    fill="#ce1124"
                                 />
                                 <polygon
                                    points="1322.21 699.36 1989.99 1048.19 1989.99 965.97 1481.34 699.36 1322.21 699.36"
                                    fill="#ce1124"
                                 />
                                 <polygon
                                    points="0.02 927.9 0.02 699.67 433.95 699.67 0.02 927.9"
                                    fill="#00247d"
                                 />
                                 <polygon
                                    points="239.42 1050 233.06 1049.71 795.72 752.22 795.72 1050 239.42 1050"
                                    fill="#00247d"
                                 />
                                 <polygon
                                    points="664.38 699.34 0.46 1048.01 155.73 1048.16 796.36 713.52 796.36 699.34 664.38 699.34"
                                    fill="#ce1124"
                                 />
                                 <polygon
                                    points="1990 122.1 1990 350.32 1556.07 350.32 1990 122.1"
                                    fill="#00247d"
                                 />
                                 <polygon
                                    points="1750.6 0 1756.96 0.29 1194.3 297.78 1194.3 0 1750.6 0"
                                    fill="#00247d"
                                 />
                                 <polygon
                                    points="1989.36 0.49 1840.01 0.48 1194.87 337.48 1194.87 349.3 1331.36 349.3 1989.36 0.49"
                                    fill="#ce1124"
                                 />
                                 <polygon
                                    points="1990 927.81 1990 699.59 1556.07 699.59 1990 927.81"
                                    fill="#00247d"
                                 />
                                 <polygon
                                    points="1750.6 1049.91 1756.96 1049.63 1194.3 752.13 1194.3 1049.91 1750.6 1049.91"
                                    fill="#00247d"
                                 />
                              </svg>
                           </span>
                           <span>EN</span>
                           <span>
                              <BiChevronDown className="text-2xl" />
                           </span>
                        </>
                     )}
                  </div>
                  <div
                     className={`absolute z-20  left-0 bg-light-primary rounded-lg dark:bg-dark-primary p-2 font-medium transition-all ${
                        isOpenLangOption
                           ? "scale-100 -bottom-[7rem] left-0"
                           : "scale-0 -bottom-10 -left-10"
                     }`}
                  >
                     <div
                        className="py-2 px-3 hover:bg-slate-300 dark:hover:bg-neutral-800 cursor-pointer hover:text-primary-color rounded-xl flex items-center gap-2"
                        onClick={() => {
                           router.replace({ pathname, query }, asPath, {
                              locale: "vi",
                           });
                           setIsOpenLangOption(false);
                        }}
                     >
                        <span>
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 900 600"
                              width={22}
                           >
                              <rect width="900" height="600" fill="#da251d" />
                              <polygon
                                 points="515.47 321.24 621.3 244.5 490.51 244.5 450 120 409.5 244.5 278.7 244.5 384.53 321.24 344.1 445.5 450 368.71 555.9 445.5 515.47 321.24"
                                 fill="#ff0"
                              />
                           </svg>
                        </span>
                        <span>Vietnamese</span>
                     </div>
                     <div
                        className="py-2 px-3 hover:bg-slate-300 dark:hover:bg-neutral-800 cursor-pointer hover:text-primary-color rounded-xl flex items-center gap-2"
                        onClick={() => {
                           router.replace({ pathname, query }, asPath, {
                              locale: "en",
                           });
                           setIsOpenLangOption(false);
                        }}
                     >
                        <span>
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 1990 1050"
                              width={22}
                           >
                              <rect
                                 y="0.1"
                                 width="1989.48"
                                 height="1048.2"
                                 fill="#fff"
                              />
                              <polygon
                                 points="1989.63 419.52 1113.63 419.52 1113.63 0.16 874.51 0.16 874.51 419.52 0.83 419.52 0.83 629.09 874.51 629.09 874.51 1048.28 1113.63 1048.28 1113.63 629.09 1989.63 629.09 1989.63 419.52"
                                 fill="#ce1124"
                              />
                              <polygon
                                 points="0.02 122.15 0.02 350.38 433.95 350.38 0.02 122.15"
                                 fill="#00247d"
                              />
                              <polygon
                                 points="239.42 0.05 233.06 0.34 795.72 297.83 795.72 0.05 239.42 0.05"
                                 fill="#00247d"
                              />
                              <polygon
                                 points="667.79 348.93 0.02 0.1 0.02 82.32 508.67 348.93 667.79 348.93"
                                 fill="#ce1124"
                              />
                              <polygon
                                 points="1322.21 699.36 1989.99 1048.19 1989.99 965.97 1481.34 699.36 1322.21 699.36"
                                 fill="#ce1124"
                              />
                              <polygon
                                 points="0.02 927.9 0.02 699.67 433.95 699.67 0.02 927.9"
                                 fill="#00247d"
                              />
                              <polygon
                                 points="239.42 1050 233.06 1049.71 795.72 752.22 795.72 1050 239.42 1050"
                                 fill="#00247d"
                              />
                              <polygon
                                 points="664.38 699.34 0.46 1048.01 155.73 1048.16 796.36 713.52 796.36 699.34 664.38 699.34"
                                 fill="#ce1124"
                              />
                              <polygon
                                 points="1990 122.1 1990 350.32 1556.07 350.32 1990 122.1"
                                 fill="#00247d"
                              />
                              <polygon
                                 points="1750.6 0 1756.96 0.29 1194.3 297.78 1194.3 0 1750.6 0"
                                 fill="#00247d"
                              />
                              <polygon
                                 points="1989.36 0.49 1840.01 0.48 1194.87 337.48 1194.87 349.3 1331.36 349.3 1989.36 0.49"
                                 fill="#ce1124"
                              />
                              <polygon
                                 points="1990 927.81 1990 699.59 1556.07 699.59 1990 927.81"
                                 fill="#00247d"
                              />
                              <polygon
                                 points="1750.6 1049.91 1756.96 1049.63 1194.3 752.13 1194.3 1049.91 1750.6 1049.91"
                                 fill="#00247d"
                              />
                           </svg>
                        </span>
                        <span>English</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <div className="flex justify-center ">
            <Link href="/" title="Home">
               <div className="cursor-pointer">
                  <Logo width="125" />
               </div>
            </Link>
         </div>
         <Suspense fallback={<p></p>}>
            <div className="flex items-center justify-end">
               {userInfo != null && (
                  <div
                     className={`sm:visible invisible font-extrabold p-1 border-2 uppercase text-xs rounded-md ${
                        agencyInfo.isActive === 0 &&
                        userInfo.role.name === "ROLE_MANAGER"
                           ? "text-red-600 border-red-600"
                           : "text-primary-color border-primary-color "
                     }`}
                  >
                     {userInfo ? (
                        userInfo.role.id === 1 ? (
                           <>admin</>
                        ) : userInfo.role.id === 2 ? (
                           <>manager</>
                        ) : (
                           <>user</>
                        )
                     ) : (
                        <>guest</>
                     )}
                     {/* {userInfo.role.name === "ROLE_ADMIN" ? (
                           <>admin</>
                        ) : (
                           <>manager</>
                        )} */}
                  </div>
               )}

               <button
                  className="w-10 h-10 hover:bg-slate-300 dark:hover:bg-neutral-800 flex items-center justify-center hover: rounded-lg mx-4 relative"
                  title="cart"
                  onClick={handleCartRoute}
               >
                  <HiOutlineShoppingCart className="w-6 h-6" />
                  {numberItem > 0 ? (
                     <div className="absolute bg-primary-color rounded-full top-[-4px] right-[-8px] font-semibold w-6 h-6 flex justify-center items-center text-sm text-white">
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
                        <div className="w-10 h-10 relative overflow-hidden border-[3px] border-primary-color rounded-full">
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
                              <div className="p-3 px-4 cursor-pointer  hover:text-primary-color transition-all">
                                 Profile
                              </div>
                           </Link>
                           {userInfo ? (
                              userInfo.role.name === "ROLE_GENERAL" ? (
                                 <></>
                              ) : (
                                 <div
                                    className="p-3 px-4 cursor-pointer  hover:text-primary-color transition-all whitespace-nowrap"
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
                              <div className="p-3 px-4 cursor-pointer  hover:text-primary-color transition-all">
                                 Orders
                              </div>
                           </Link>
                           <Link href={"/wishlist"}>
                              <div className="p-3 px-4 cursor-pointer  hover:text-primary-color transition-all">
                                 Wishlist
                              </div>
                           </Link>
                           <Link href={"/followed"}>
                              <div className="p-3 px-4 cursor-pointer  hover:text-primary-color transition-all">
                                 Followed
                              </div>
                           </Link>
                           <div
                              className="p-3 px-4 cursor-pointer hover:text-primary-color transition-all whitespace-nowrap"
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
                           <button className="py-2 px-3 bg-primary-color text-light-bg rounded-lg mr-4 text-sm font-semibold hover:shadow-lg hover:shadow-primary-color hover:brightness-90">
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
