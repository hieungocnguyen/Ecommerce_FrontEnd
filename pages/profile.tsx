import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import API, { endpoints } from "../API";
import Layout from "../components/Layout/Layout";
import { Store } from "../utils/Store";

const Profile = () => {
   const { state, dispatch } = useContext(Store);
   const { userInfo } = state;
   const [user, setUser] = useState<any>({});

   useEffect(() => {
      const loadUser = async () => {
         const resUser = await API.get(endpoints["user"](userInfo.id));
         setUser(resUser.data.data);
      };
      if (userInfo) {
         loadUser();
      }
   }, []);
   return (
      <Layout title="Profile User">
         <div className="flex items-center gap-10 justify-center my-10">
            <div className="flex justify-center">
               <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-[240px] h-[240px] rounded-full"
               />
            </div>
            <div className="text-left">
               <div className="">
                  <div>Firstname: {user.firstName}</div>
                  <div>Lastname: {user.lastName}</div>
                  <div>Email: {user.email}</div>
                  <div>Phone: {user.phone}</div>
               </div>
               <Link href="/editprofile">
                  <button className="p-4 bg-blue-main text-white font-semibold rounded-lg my-4 hover:opacity-80">
                     Edit profile
                  </button>
               </Link>
            </div>
         </div>
      </Layout>
   );
};

export default Profile;
