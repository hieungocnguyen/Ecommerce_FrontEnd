import { Suspense, useContext, useEffect, useState } from "react";
import LayoutDashboardManager from "../../components/Dashboard/LayoutDashboardManager";
import { Store } from "../../utils/Store";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase-config";
import { ClipLoader } from "react-spinners";
import { BiListCheck } from "react-icons/bi";
import Image from "next/image";
import moment from "moment";
import API, { endpoints } from "../../API";
import emptyBox from "../../public/empty-box.png";

const Notification = () => {
   const { state, dispatch } = useContext(Store);
   const { agencyInfo } = state;
   const [notiList, setNotiList] = useState([]);
   const [isFetching, setIsFetching] = useState(false);

   const SnapFirestore = () => {
      setIsFetching(true);
      const unsubcribe = onSnapshot(
         collection(db, `agency-${agencyInfo.id}`),
         (snapshot) => {
            setNotiList(
               snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
            );
            setIsFetching(false);
         }
      );
      return () => {
         unsubcribe();
      };
   };

   useEffect(() => {
      if (agencyInfo) {
         SnapFirestore();
      }
   }, [agencyInfo]);

   const fetchChangeSeenNoti = async () => {
      try {
         if (agencyInfo) {
            const res = await API.get(
               endpoints["update_seen_status"](`agency-${agencyInfo.id}`)
            );
         }
      } catch (error) {
         console.log(error);
      }
   };

   return (
      <LayoutDashboardManager title="Notification">
         <div className="w-[95%] mx-auto my-8">
            <div className="flex justify-between items-center">
               <div className="font-semibold text-2xl">Notification</div>
               <div className="">
                  <button
                     className={`px-4 py-3 bg-primary-color rounded-lg text-white font-semibold flex items-center gap-1 hover:shadow-lg hover:shadow-primary-color transition-all`}
                     onClick={() => fetchChangeSeenNoti()}
                  >
                     <BiListCheck className="text-3xl" />
                     Mark all as read
                  </button>
               </div>
            </div>
            <div className="mt-6">
               {isFetching ? (
                  <div className="flex justify-center my-8">
                     <ClipLoader size={35} color="#FF8500" />
                  </div>
               ) : notiList.length > 0 ? (
                  notiList
                     .sort((a, b) =>
                        a.data.createdDate.seconds < b.data.createdDate.seconds
                           ? 1
                           : -1
                     )
                     .map((noti) => (
                        <div
                           key={noti.id}
                           className={`p-4 w-full rounded-lg  flex items-center gap-4 mb-4 transition-all hover:bg-[#bdbec5] dark:hover:bg-[#191919] ${
                              noti.data.seen === false
                                 ? "bg-[#d3d4dc] dark:bg-dark-spot"
                                 : "bg-light-primary dark:bg-dark-primary"
                           }`}
                        >
                           <div className="relative h-16 aspect-square rounded-xl overflow-hidden">
                              <Image
                                 src={noti.data.image}
                                 alt="image"
                                 layout="fill"
                                 className="object-cover"
                              />
                           </div>
                           <div>
                              <div className="text-lg font-medium">
                                 {noti.data.title}
                              </div>
                              <div className=" mb-1">{noti.data.details}</div>
                              <div>
                                 <span className="text-sm text-primary-color font-semibold">
                                    {noti.data.type}
                                 </span>
                                 <span className="text-sm italic">
                                    {" - "}
                                    {moment(
                                       noti.data.createdDate.seconds * 1000
                                    )
                                       .startOf("m")
                                       .fromNow()}
                                 </span>
                              </div>
                           </div>
                        </div>
                     ))
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
                  </div>
               )}
            </div>
         </div>
      </LayoutDashboardManager>
   );
};

export default Notification;
