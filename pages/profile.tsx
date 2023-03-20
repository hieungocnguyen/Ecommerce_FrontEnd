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

const Profile = () => {
   const { state, dispatch } = useContext(Store);
   const { userInfo } = state;
   const [user, setUser] = useState<any>({});
   const [waitAccept, setWaitAccept] = useState(false);
   const [authProvider, setAuthProvider] = useState(0);
   const router = useRouter();

   useEffect(() => {
      const loadUser = async () => {
         const resUser = await API.get(endpoints["user"](userInfo.id));
         setUser(resUser.data.data);
         setAuthProvider(resUser.data.data.authProvider.id);
      };
      const loadInfoAgency = async () => {
         const resAllAgency = await API.get(endpoints["all_agency"]);
         resAllAgency.data.data.map((i) => {
            if (userInfo.username === i.manager.username) {
               if (i.isCensored === 0) {
                  setWaitAccept(true);
               }
            }
         });
      };
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
               onClick={() => router.back()}
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
                        user.firstName && user.lastName ? "" : "text-yellow-500"
                     }`}
                  >
                     {user.firstName && user.lastName
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
               <div className="col-span-6 rounded-lg border-blue-main border-2 text-left p-4">
                  <div className="flex items-center gap-4 mb-1">
                     <BiPhone className="text-2xl" />
                     <div
                        className={`text-lg font-medium ${
                           user.phone ? "" : "text-yellow-500"
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
               <div className="col-span-6 border-blue-main border-2 rounded-lg p-4">
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
                                    className="rounded-xl px-4 py-3 bg-blue-main text-white font-semibold"
                                 >
                                    Register here
                                 </button>
                              </Link>
                           </>
                        )
                     ) : (
                        <></>
                     )
                  ) : (
                     <></>
                  )}
               </div>
            </div>
            {/* <div className="grid grid-cols-12 gap-8">
               <div className="col-span-4 bg-light-primary dark:bg-dark-primary rounded-lg p-4">
                  <div className="relative overflow-hidden mx-20 mb-4 rounded-lg aspect-square ">
                     <Image
                        src={user.avatar}
                        alt=""
                        layout="fill"
                        className="object-cover"
                     />
                  </div>
                  <Link href="/editprofile">
                     <button className="p-3 bg-blue-main text-white font-semibold rounded-lg mt-4 hover:opacity-80 w-3/4">
                        Edit your profile
                     </button>
                  </Link>
                  {authProvider == 1 ? (
                     <Link href="/changepassword">
                        <button className="p-3 bg-blue-main text-white font-semibold rounded-lg mt-4 hover:opacity-80 w-3/4">
                           Change Password
                        </button>
                     </Link>
                  ) : (
                     <></>
                  )}
                  {userInfo ? (
                     userInfo.role.name === "ROLE_GENERAL" ? (
                        waitAccept ? (
                           <div>
                              Waiting administrator accept your register
                              application
                           </div>
                        ) : (
                           <Link href="/registerAgency">
                              <button className="p-3 bg-blue-main text-white font-semibold rounded-lg mt-4 hover:opacity-80 w-3/4">
                                 Register to become agency
                              </button>
                           </Link>
                        )
                     ) : (
                        <></>
                     )
                  ) : (
                     <></>
                  )}
               </div>
               <div className="col-span-8 h-fit grid grid-cols-12 gap-4 bg-light-primary rounded-lg text-left p-6  font-medium">
                  <div className="col-span-6">
                     <label htmlFor="firstName">First Name</label>
                     <input
                        type="text"
                        name=""
                        id="firstName"
                        className="p-4 rounded-lg w-full mt-1"
                        value={user.firstName}
                     />
                  </div>
                  <div className="col-span-6">
                     <label htmlFor="lastName">Last Name</label>
                     <input
                        type="text"
                        name=""
                        id="lastName"
                        className="p-4 rounded-lg w-full mt-1"
                        value={user.lastName}
                     />
                  </div>
                  <div className="col-span-6">
                     <label htmlFor="email">Email</label>
                     <input
                        type="text"
                        name=""
                        id="email"
                        className="p-4 rounded-lg w-full mt-1"
                        value={user.email}
                     />
                  </div>
                  <div className="col-span-6">
                     <label htmlFor="phone">Phone</label>
                     <input
                        type="text"
                        name=""
                        id="phone"
                        className="p-4 rounded-lg w-full mt-1"
                        value={user.phone}
                     />
                  </div>

                  <div className="col-span-12">
                     <label htmlFor="address">Address</label>
                     <input
                        type="text"
                        name=""
                        id="address"
                        className="p-4 rounded-lg w-full mt-1"
                        value={user.address}
                     />
                  </div>
               </div>
            </div> */}
         </div>
      </Layout>
   );
};
export default dynamic(() => Promise.resolve(Profile), { ssr: false });
