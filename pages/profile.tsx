/* eslint-disable @next/next/no-img-element */
import dynamic from "next/dynamic";
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
         console.log(resUser.data.data.authProvider.id);
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
         <div className="flex items-center flex-col justify-center my-10">
            <div className="flex justify-center mb-8">
               <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-[240px] h-[240px] rounded-full object-cover"
               />
            </div>
            <div className="text-left">
               <div className="">
                  <div>Firstname: {user.firstName}</div>
                  <div>Lastname: {user.lastName}</div>
                  <div>Email: {user.email}</div>
                  <div>Phone: {user.phone}</div>
                  <div>Address: {user.address}</div>
               </div>
               <div className="flex flex-col">
                  <Link href="/editprofile">
                     <button className="p-4 bg-blue-main text-white font-semibold rounded-lg my-4 hover:opacity-80">
                        Edit profile
                     </button>
                  </Link>
                  {authProvider == 1 ? (
                     <Link href="/changepassword">
                        <button className="p-4 bg-blue-main text-white font-semibold rounded-lg my-4 hover:opacity-80">
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
                              <button className="p-4 bg-blue-main text-white font-semibold rounded-lg my-4 hover:opacity-80">
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
            </div>
         </div>
      </Layout>
   );
};
export default dynamic(() => Promise.resolve(Profile), { ssr: false });
