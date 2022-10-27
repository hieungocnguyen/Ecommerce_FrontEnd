import { useEffect, useState } from "react";
import API, { endpoints } from "../../../API";
import AdminLayoutDashboard from "../../../components/Dashboard/AdminLayoutDashboard";
import Image from "next/image";

const UsersAdminDashboard = () => {
   const [users, setUsers] = useState([]);
   const loadUsers = async () => {
      const resUsers = await API.get(endpoints["user_all"]);
      setUsers(resUsers.data.data);
   };
   useEffect(() => {
      loadUsers();
   }, []);
   return (
      <AdminLayoutDashboard>
         <div className="w-[90%] mx-auto">
            <div className="flex justify-between my-10">
               <div className="font-semibold text-2xl">User</div>
            </div>
            <div className="grid grid-cols-4 gap-8">
               {users.map((a) => (
                  <div
                     key={a.id}
                     className="bg-neutral-800 rounded-lg flex flex-col items-center py-6"
                  >
                     <div className="flex justify-center my-4">
                        <Image
                           src={a.avatar}
                           alt=""
                           width={120}
                           height={120}
                           className="rounded-full"
                        />
                     </div>
                     <div className="text-lg font-semibold text-blue-main">
                        {a.firstName} {a.lastName}
                     </div>

                     <div className="text-sm text-center">
                        {a.address ? a.address : "Undeclared Address"}
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </AdminLayoutDashboard>
   );
};

export default UsersAdminDashboard;
