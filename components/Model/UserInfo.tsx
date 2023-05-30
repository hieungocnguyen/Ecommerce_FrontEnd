import Image from "next/image";
import { useEffect, useRef } from "react";

const UserInfo = ({ userModel, setUserModel }) => {
   const wrapperRef = useRef(null);
   useEffect(() => {
      function handleClickOutside(event) {
         if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setUserModel({});
         }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [wrapperRef]);
   return (
      <div
         className="dark:bg-neutral-800 bg-light-primary rounded-lg p-8 sm:w-full w-[700px] h-full relative border-2 border-primary-color"
         ref={wrapperRef}
      >
         {userModel.id && (
            <div className="grid grid-cols-12">
               <div className="col-span-3 w-3/4 aspect-square relative overflow-hidden rounded-full">
                  <Image
                     src={userModel.avatar}
                     alt="img"
                     layout="fill"
                     className="object-cover "
                  />
               </div>
               <div className="col-span-9 grid grid-cols-2">
                  <div>
                     <span className="font-semibold">Firstname:</span>{" "}
                     {userModel.firstName ? userModel.firstName : "Unnamed"}
                  </div>
                  <div>
                     <span className="font-semibold">LastName:</span>{" "}
                     {userModel.lastName ? userModel.lastName : "Unnamed"}
                  </div>
                  <div>
                     <span className="font-semibold">Role:</span>{" "}
                     {userModel.role
                        ? userModel.role.name.slice(5)
                        : "Not provided"}
                  </div>
                  <div>
                     <span className="font-semibold">Joined date:</span>{" "}
                     {new Date(userModel.joinedDate).toLocaleDateString(
                        "en-GB"
                     )}
                  </div>
                  <div>
                     <span className="font-semibold">Phone:</span>{" "}
                     {userModel.phone ? userModel.phone : "Not provided"}
                  </div>
                  <div>
                     <span className="font-semibold">Gender:</span>{" "}
                     {userModel.gender ? userModel.gender.name : "Not provided"}
                  </div>

                  <div>
                     <span className="font-semibold">Email:</span>{" "}
                     {userModel.email}
                  </div>
                  <div className="col-span-2">
                     <span className="font-semibold">Address:</span>{" "}
                     {userModel.address ? userModel.address : "Not provided"}
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default UserInfo;
