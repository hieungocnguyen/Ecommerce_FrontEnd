/* eslint-disable @next/next/no-img-element */
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import {
   BiArrowBack,
   BiEditAlt,
   BiLockAlt,
   BiMap,
   BiPhone,
} from "react-icons/bi";
import API, { endpoints } from "../API";
import Layout from "../components/Layout/Layout";
import { Store } from "../utils/Store";
import Cookies from "js-cookie";

const Profile = () => {
   const { state, dispatch } = useContext(Store);
   const { userInfo } = state;
   const [user, setUser] = useState<any>({});
   const [waitAccept, setWaitAccept] = useState(false);
   const [authProvider, setAuthProvider] = useState(0);
   const router = useRouter();

   const loadUser = async () => {
      try {
         const resUser = await API.get(endpoints["user"](userInfo.id));
         setUser(resUser.data.data);
         setAuthProvider(resUser.data.data.authProvider.id);
      } catch (error) {
         console.log(error);
      }
   };
   const loadInfoAgency = async () => {
      try {
         const resAllAgency = await API.get(endpoints["all_agency"]);
         resAllAgency.data.data.map((i) => {
            if (userInfo.username === i.manager.username) {
               if (i.isCensored === 0) {
                  setWaitAccept(true);
               }
            }
         });
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      if (userInfo) {
         loadUser();
         loadInfoAgency();
      }
   }, [userInfo]);
   return (
      <Layout title="Profile User">
         <div className="flex gap-4 items-center m-6">
            <div
               className="bg-blue-main text-white p-3 text-2xl rounded-lg cursor-pointer hover:shadow-lg hover:shadow-blue-main"
               onClick={() => router.push("/")}
            >
               <BiArrowBack />
            </div>
            <div className="font-semibold text-2xl">/ Profile</div>
         </div>
         <div className="">
            <div className="relative bg-blue-main h-36 rounded-lg">
               <div className="relative overflow-hidden h-48 aspect-square rounded-full left-24 -bottom-12 border-8 border-dark-text dark:border-dark-bg">
                  <Image
                     src={user.avatar}
                     alt="avatar"
                     layout="fill"
                     className="object-cover"
                  />
               </div>
               <div className="absolute -bottom-20 left-[19rem]  text-left">
                  <div
                     className={`font-semibold text-3xl ${
                        user.firstName || user.lastName ? "" : "text-orange-500"
                     }`}
                  >
                     {user.firstName || user.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : "Unnamed"}
                  </div>
                  <div className="font-medium opacity-80">{user.email}</div>
               </div>
               <div className="absolute right-6 bottom-6 flex gap-4">
                  <Link href="/editprofile">
                     <button
                        title="Edit your information"
                        type="button"
                        className="px-4 py-3 border-dark-text border-2 rounded-lg text-white font-semibold hover:bg-dark-text hover:text-blue-main transition-all flex items-center"
                     >
                        <BiEditAlt className="text-2xl inline-block mr-2" />
                        <span>Change information</span>
                     </button>
                  </Link>
                  {authProvider == 1 ? (
                     <>
                        <Link href="/changepassword">
                           <button
                              title="Change Password"
                              type="button"
                              className="px-4 py-3 border-dark-text border-2 rounded-lg text-white font-semibold hover:bg-dark-text hover:text-blue-main transition-all flex items-center"
                           >
                              <BiLockAlt className="text-2xl inline-block mr-2" />
                              <span>Change Password</span>
                           </button>
                        </Link>
                     </>
                  ) : (
                     <></>
                  )}
               </div>
            </div>
            <div className="grid grid-cols-12 gap-4 mt-32 mx-8">
               <div className="col-span-6 rounded-lg border-blue-main border-2 text-left p-4 items-center">
                  <div className="flex items-center gap-4 mb-1">
                     <BiPhone className="text-2xl" />
                     <div
                        className={`text-lg font-medium ${
                           user.phone ? "" : "text-orange-500"
                        }`}
                     >
                        {user.phone ? user.phone : "Undeclare number phone"}
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <BiMap className="text-2xl" />
                     <div className="text-lg font-medium">
                        {user.address ? user.address : "Undeclare address"}
                     </div>
                  </div>
               </div>
               <div className="col-span-6 border-blue-main border-2 rounded-lg p-4 items-center ">
                  {userInfo ? (
                     userInfo.role.name === "ROLE_GENERAL" ? (
                        waitAccept ? (
                           <div>
                              Waiting administrator accept your register
                              application
                           </div>
                        ) : (
                           <>
                              <div className="text-blue-main font-semibold text-lg mb-2">
                                 Do you want become an agency?
                              </div>
                              <Link href="/registerAgency">
                                 <button
                                    title="Register Agency"
                                    type="button"
                                    className="rounded-xl px-4 py-3 bg-blue-main text-white font-semibold hover:shadow-lg hover:shadow-blue-main"
                                 >
                                    Register here
                                 </button>
                              </Link>
                           </>
                        )
                     ) : (
                        <>Update later...</>
                     )
                  ) : (
                     <></>
                  )}
               </div>
            </div>
         </div>
      </Layout>
   );
};
export default dynamic(() => Promise.resolve(Profile), { ssr: false });
