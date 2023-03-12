/* eslint-disable @next/next/no-img-element */
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import API, { endpoints } from "../API";
import Layout from "../components/Layout/Layout";
import { Store } from "../utils/Store";

const Profile = () => {
   const { state, dispatch } = useContext(Store);
   const { userInfo } = state;
   const [user, setUser] = useState<any>({});
   const [waitAccept, setWaitAccept] = useState(false);
   const [authProvider, setAuthProvider] = useState(0);

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
         <div className="mx-16 my-12">
            <div className="grid grid-cols-12 gap-8">
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
            </div>
         </div>
      </Layout>
   );
};
export default dynamic(() => Promise.resolve(Profile), { ssr: false });
