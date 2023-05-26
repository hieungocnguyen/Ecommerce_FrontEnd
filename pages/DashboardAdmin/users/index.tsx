import { useEffect, useState } from "react";
import API, { endpoints } from "../../../API";
import AdminLayoutDashboard from "../../../components/Dashboard/AdminLayoutDashboard";
import Image from "next/image";
import PaginationComponent from "../../../components/Pagination";
import emptyBox from "../../../public/empty-box.png";

const UsersAdminDashboard = () => {
   const [users, setUsers] = useState([]);

   const lengthOfPage = 6;
   const [pageCurrent, setPageCurrent] = useState(1);
   const [totalPage, setTotalPage] = useState(0);
   const [keyword, setKeyword] = useState("");

   const loadUsers = async () => {
      try {
         const resUsers = await API.get(endpoints["user_all"]);
         setUsers(resUsers.data.data);
         setTotalPage(Math.ceil(resUsers.data.data.length / lengthOfPage));
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      loadUsers();
   }, []);

   const FilterArray = (array) => {
      let resultArray = array.filter(
         (users) => users.username.toUpperCase().search(keyword) >= 0
      );

      return resultArray;
   };

   useEffect(() => {
      setTotalPage(Math.ceil(FilterArray(users).length / lengthOfPage));
   }, [keyword]);

   return (
      <AdminLayoutDashboard title="Users">
         <div className="w-[95%] mx-auto mt-8">
            <div className="flex justify-between my-4">
               <div className="font-semibold text-2xl">User List</div>
               <div className="">
                  <input
                     type="text"
                     placeholder="🔎 Username"
                     className="p-3 rounded-lg border-2 border-primary-color"
                     onChange={(e) => setKeyword(e.target.value.toUpperCase())}
                  />
               </div>
            </div>
            <div className="rounded-lg dark:bg-dark-primary bg-light-spot overflow-hidden shadow-lg dark:shadow-dark-shadow shadow-light-spot">
               <ul className="grid grid-cols-12 p-5 dark:bg-dark-spot bg-light-primary items-center font-semibold">
                  <li className="col-span-1">Avatar</li>
                  <li className="col-span-2">Username</li>
                  <li className="col-span-2">Phone number</li>
                  <li className="col-span-3">Email</li>
                  <li className="col-span-4">Address</li>
               </ul>
               {FilterArray(users)
                  .slice(
                     (pageCurrent - 1) * lengthOfPage,
                     (pageCurrent - 1) * lengthOfPage + lengthOfPage
                  )
                  .map((user) => (
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
               {FilterArray(users).length == 0 && (
                  <div className="relative overflow-hidden aspect-square w-1/4 mx-auto">
                     <Image
                        src={emptyBox}
                        alt="empty"
                        layout="fill"
                        className="object-cover"
                     />
                  </div>
               )}
            </div>
            <PaginationComponent
               totalPage={totalPage}
               pageCurrent={pageCurrent}
               setPageCurrent={setPageCurrent}
            />
         </div>
      </AdminLayoutDashboard>
   );
};

export default UsersAdminDashboard;
