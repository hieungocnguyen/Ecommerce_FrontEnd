import dynamic from "next/dynamic";
import Layout from "../components/Layout/Layout";
import { useContext, useEffect, useState } from "react";
import { Store } from "../utils/Store";
import API, { authAxios, endpoints } from "../API";
import router from "next/router";
import { BiArrowBack, BiX } from "react-icons/bi";
import Image from "next/image";
import emptyBox from "../public/empty-box.png";
import { AiFillHeart } from "react-icons/ai";
import ConfirmModel from "../components/Model/ConfirmModel";

const Followed = () => {
   const { state, dispatch } = useContext(Store);
   const { userInfo } = state;
   const [listAgencyFollowed, setListAgencyFollowed] = useState([]);
   const [isOpenConfirm, setIsOpenConfirm] = useState(false);
   const [confirmID, setConfirmID] = useState(-1);

   const FetchListFollowAgency = async () => {
      try {
         const res = await API.get(
            endpoints["get_list_agency_follow"](userInfo.id)
         );
         //  console.log(res);
         setListAgencyFollowed(res.data.data);
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      if (userInfo) {
         FetchListFollowAgency();
      }
   }, [userInfo]);

   const handleRouteAgency = (agencyID) => {
      router.push(`/agencyinfo/${agencyID}`);
   };

   const handleUnFollowAgency = async (agencyID) => {
      try {
         const res = await authAxios().get(
            endpoints["follow_agency"](agencyID)
         );
         FetchListFollowAgency();
         setConfirmID(-1);
      } catch (error) {
         console.log(error);
      }
   };

   return (
      <Layout title="Followed">
         <div className="flex gap-4 items-center m-6">
            <div
               className="bg-primary-color text-white p-3 text-2xl rounded-lg cursor-pointer hover:shadow-lg hover:shadow-primary-color"
               onClick={() => router.back()}
            >
               <BiArrowBack />
            </div>
            <div className="font-semibold text-2xl">/ Followed List</div>
         </div>
         <div className=" mb-8">
            {listAgencyFollowed.length > 0 ? (
               <>
                  <div className="grid grid-cols-4 gap-8">
                     {listAgencyFollowed.map((agency) => (
                        <div key={agency.id}>
                           <div
                              className="dark:bg-dark-primary bg-light-primary rounded-lg p-6 cursor-pointer  hover:shadow-lg"
                              onClick={() => handleRouteAgency(agency.id)}
                           >
                              <div>
                                 <div className="">
                                    <div className="w-full aspect-square relative overflow-hidden rounded-2xl hover:scale-105 transition-all">
                                       <Image
                                          src={agency.avatar}
                                          alt="avatar"
                                          layout="fill"
                                          className="object-cover hover:shadow-lg"
                                       />
                                    </div>
                                 </div>
                                 <div className="text-center font-bold text-xl uppercase mt-4 line-clamp-2 text-primary-color">
                                    {agency.name}
                                 </div>
                                 <div className="text-center font-semibold">
                                    {agency.field.name}
                                 </div>
                                 <div className="mt-4">
                                    <button
                                       className="p-2 rounded-xl text-white bg-red-600 cursor-pointer hover:shadow-lg hover:shadow-red-600"
                                       title="Unfollow this agency"
                                       onClick={(event) => {
                                          event.stopPropagation();
                                          setIsOpenConfirm(true);
                                          setConfirmID(agency.id);
                                       }}
                                    >
                                       <BiX className="text-3xl" />
                                    </button>
                                 </div>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </>
            ) : (
               <div>
                  <div className="relative overflow-hidden aspect-square w-1/4 mx-auto">
                     <Image
                        src={emptyBox}
                        alt="empty"
                        layout="fill"
                        className="object-cover"
                     />
                  </div>
                  <div className="uppercase text-2xl font-semibold mb-4">
                     You have not followed any agencies yet
                  </div>
               </div>
            )}
            <div
               className={`fixed top-0 right-0 w-full h-screen backdrop-blur-sm items-center justify-center z-20 ${
                  isOpenConfirm ? "flex" : "hidden"
               }`}
            >
               <div className="w-1/3  h-fit">
                  <ConfirmModel
                     functionConfirm={() => handleUnFollowAgency(confirmID)}
                     content={"Are you sure to unfollow this merchant?"}
                     isOpenConfirm={isOpenConfirm}
                     setIsOpenConfirm={setIsOpenConfirm}
                  />
               </div>
            </div>
         </div>
      </Layout>
   );
};

// export default Followed;
export default dynamic(() => Promise.resolve(Followed), { ssr: false });
