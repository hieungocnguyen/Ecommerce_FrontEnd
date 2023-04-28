import { useEffect, useState } from "react";
import API, { endpoints } from "../../../API";
import AdminLayoutDashboard from "../../../components/Dashboard/AdminLayoutDashboard";
import Image from "next/image";

const UsersAdminDashboard = () => {
   const [users, setUsers] = useState([]);
   const loadUsers = async () => {
      try {
         const resUsers = await API.get(endpoints["user_all"]);
         setUsers(resUsers.data.data);
      } catch (error) {
         console.log(error);
      }
   };
   useEffect(() => {
      loadUsers();
   }, []);
   return (
      <AdminLayoutDashboard title="Users">
         <div className="w-[90%] mx-auto">
            <div className="flex justify-between my-10">
               <div className="font-semibold text-2xl">User List</div>
            </div>
            <div className="rounded-lg dark:bg-dark-primary bg-light-spot overflow-hidden shadow-lg dark:shadow-dark-shadow shadow-light-spot">
               <ul className="grid grid-cols-12 p-5 dark:bg-dark-spot bg-light-primary items-center font-semibold">
                  <li className="col-span-1">Avatar</li>
                  <li className="col-span-2">Username</li>
                  <li className="col-span-2">Phone number</li>
                  <li className="col-span-3">Email</li>
                  <li className="col-span-4">Address</li>
               </ul>
               {users.map((user) => (
                  <ul
                     className="grid grid-cols-12 p-5  items-center dark:hover:bg-dark-spot hover:bg-light-primary cursor-pointer font-semibold"
                     key={user.id}
                  >
                     <li className="col-span-1">
                        <Image
                           src={user.avatar}
                           alt="avatar"
                           width={42}
                           height={42}
                           className="object-cover rounded-full"
                        />
                     </li>
                     <li className="col-span-2">{user.username}</li>
                     <li
                        className={`col-span-2 ${
                           user.phone ? "" : "opacity-70"
                        }`}
                     >
                        {user.phone ? user.phone : "Not provided"}
                     </li>
                     <li className="col-span-3">{user.email}</li>
                     <li
                        className={`col-span-4 ${
                           user.address ? "" : "opacity-70"
                        }`}
                     >
                        {user.address ? user.address : "Not provided"}
                     </li>
                  </ul>
               ))}
            </div>
         </div>
      </AdminLayoutDashboard>
   );
};

export default UsersAdminDashboard;
