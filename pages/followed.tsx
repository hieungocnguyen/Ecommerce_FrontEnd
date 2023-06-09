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
import useTrans from "../hook/useTrans";
import PaginationComponent from "../components/Pagination";

const Followed = () => {
   const { state, dispatch } = useContext(Store);
   const { userInfo } = state;
   const [listAgencyFollowed, setListAgencyFollowed] = useState([]);
   const [isOpenConfirm, setIsOpenConfirm] = useState(false);
   const [confirmID, setConfirmID] = useState(-1);
   const trans = useTrans();

   //pagination
   const lengthOfPage = 8;
   const [pageCurrent, setPageCurrent] = useState(1);
   const [totalPage, setTotalPage] = useState(0);
   const [keywordSearch, setKeywordSearch] = useState("");

   const FetchListFollowAgency = async () => {
      try {
         const res = await API.get(
            endpoints["get_list_agency_follow"](userInfo.id)
         );
         setListAgencyFollowed(res.data.data);
         setTotalPage(Math.ceil(res.data.data.length / lengthOfPage));
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      if (userInfo) {
         FetchListFollowAgency();
      }
   }, [userInfo]);

   useEffect(() => {
      setTotalPage(
         Math.ceil(FilterArray(listAgencyFollowed).length / lengthOfPage)
      );
   }, [keywordSearch]);

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

   const FilterArray = (array) => {
      let resultArray = array.filter(
         (agency) => agency.name.toUpperCase().search(keywordSearch) >= 0
      );
      return resultArray;
   };

   return (
      <Layout title="Followed">
         <div className="flex justify-between items-center">
            <div className="flex gap-4 items-center m-6">
               <div
                  className="bg-primary-color text-white p-3 text-2xl rounded-lg cursor-pointer hover:shadow-lg hover:shadow-primary-color"
                  onClick={() => router.back()}
               >
                  <BiArrowBack />
               </div>
               <div className="font-semibold text-2xl">
                  / {trans.followed.title}
               </div>
            </div>
            <div className="">
               <input
                  type="text"
                  placeholder="🔎Name of merchant"
                  className="p-3 rounded-lg border-2 border-primary-color"
                  onKeyDown={(e) => {
                     !/^[a-zA-Z0-9._\b]+$/.test(e.key) && e.preventDefault();
                  }}
                  onChange={(e) => {
                     setKeywordSearch(e.target.value.toUpperCase());
                     setPageCurrent(1);
                  }}
               />
            </div>
         </div>
         <div className=" mb-8">
            {FilterArray(listAgencyFollowed).length > 0 ? (
               <div>
                  <div className="grid grid-cols-4 gap-8">
                     {FilterArray(listAgencyFollowed)
                        .slice(
                           (pageCurrent - 1) * lengthOfPage,
                           (pageCurrent - 1) * lengthOfPage + lengthOfPage
                        )
                        .map((agency) => (
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
                                          title="Unfollow this merchant"
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
                  {/* paginate */}
                  <PaginationComponent
                     totalPage={totalPage}
                     pageCurrent={pageCurrent}
                     setPageCurrent={setPageCurrent}
                  />
               </div>
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
                     {trans.followed.empty}
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
