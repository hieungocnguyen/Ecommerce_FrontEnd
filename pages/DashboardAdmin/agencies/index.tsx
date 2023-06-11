import { log } from "console";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import API, { endpoints } from "../../../API";
import AdminLayoutDashboard from "../../../components/Dashboard/AdminLayoutDashboard";
import ConfirmModel from "../../../components/Model/ConfirmModel";
import { toast } from "react-hot-toast";
import { BiMessageRounded, BiTrashAlt } from "react-icons/bi";
import emptyBox from "../../../public/empty-box.png";
import PaginationComponent from "../../../components/Pagination";

const AgenciesAdminDashboard = () => {
   const [agencies, setAgencies] = useState([]);
   const [isOpenConfirmBan, setIsOpenConfirmBan] = useState(false);
   const [isOpenConfirmUnBan, setIsOpenConfirmUnBan] = useState(false);
   const [modelID, setModelID] = useState(-1);

   const lengthOfPage = 6;
   const [pageCurrent, setPageCurrent] = useState(1);
   const [totalPage, setTotalPage] = useState(0);
   const [keyword, setKeyword] = useState("");
   const [filterState, setFilterState] = useState(0);
   const refKeyword = useRef(null);

   const fetchAgencies = async () => {
      try {
         const resAgency = await API.get(endpoints["all_agency"]);
         setAgencies(resAgency.data.data);
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      fetchAgencies();
      const interval = setInterval(() => {
         fetchAgencies();
      }, 10000);
      return () => clearInterval(interval);
   }, []);

   const handleBanAgency = async (modelID) => {
      try {
         const res = await API.patch(endpoints["ban_agency"](modelID));
         fetchAgencies();
         toast.success("Ban agency successful", { position: "top-center" });
      } catch (error) {
         console.log(error);
         toast.error("Something wrong, please try again!");
      }
   };

   const handleUnbanAgency = async (modelID) => {
      try {
         const res = await API.patch(endpoints["unban_agency"](modelID));
         fetchAgencies();
         toast.success("Ban merchant unsuccessful", { position: "top-center" });
      } catch (error) {
         console.log(error);
         toast.error("Something wrong, please try again!");
      }
   };

   const FilterArray = (array) => {
      let resultArray;
      try {
         resultArray = array
            .filter(
               (agency) =>
                  unicodeParse(agency.name)
                     .toUpperCase()
                     .search(unicodeParse(keyword)) >= 0
            )
            .filter((agency) =>
               filterState > 0
                  ? filterState == 1
                     ? agency.isActive == 1
                     : agency.isActive == 0
                  : true
            );
      } catch (error) {
         resultArray = array;
      }
      // let resultArray = array
      //    .filter(
      //       (agency) =>
      //          unicodeParse(agency.name)
      //             .toUpperCase()
      //             .search(unicodeParse(keyword)) >= 0
      //    )
      //    .filter((agency) =>
      //       filterState > 0
      //          ? filterState == 1
      //             ? agency.isActive == 1
      //             : agency.isActive == 0
      //          : true
      //    );

      return resultArray;
   };

   const unicodeParse = (string) => {
      return string
         .normalize("NFD")
         .replace(/[\u0300-\u036f]/g, "")
         .replace(/đ/g, "d")
         .replace(/Đ/g, "D");
   };

   const clearFilter = () => {
      setKeyword("");
      refKeyword.current.value = "";
      setFilterState(0);
      toast.success("Cleared filter");
   };

   useEffect(() => {
      setTotalPage(Math.ceil(FilterArray(agencies).length / lengthOfPage));
   }, [keyword, filterState, agencies]);

   return (
      <AdminLayoutDashboard title={"Merchant List"}>
         <div className="w-[95%] mx-auto mt-8">
            <div className="flex justify-between my-4">
               <div className="font-semibold text-2xl">Merchant List</div>
               <div className="flex gap-4">
                  <input
                     type="text"
                     ref={refKeyword}
                     placeholder="🔎 Merchant Name"
                     className="p-3 rounded-lg border-2 border-primary-color"
                     onKeyDown={(e) => {
                        ["(", ")", "`", "`", "[", "]", "?", "\\"].includes(
                           e.key
                        ) && e.preventDefault();
                     }}
                     onChange={(e) => {
                        setKeyword(e.target.value.toUpperCase());
                        setPageCurrent(1);
                     }}
                  />
                  <select
                     value={filterState}
                     className="p-3 rounded-lg w-60 border-2 border-primary-color"
                     onChange={(e) => setFilterState(Number(e.target.value))}
                  >
                     <option value={0}>All Merchant</option>
                     <option value={1}>Active</option>
                     <option value={2}>Banned</option>
                  </select>
                  <div
                     className="p-3 bg-secondary-color rounded-lg font-semibold text-dark-primary cursor-pointer hover:shadow-lg hover:shadow-secondary-color hover:brightness-90 flex gap-1 items-center"
                     onClick={clearFilter}
                  >
                     <BiTrashAlt className="text-2xl" />
                     Clear filter
                  </div>
               </div>
            </div>
            {FilterArray(agencies).length > 0 ? (
               <div className="rounded-lg dark:bg-dark-primary bg-light-primary overflow-hidden shadow-lg dark:shadow-dark-shadow shadow-light-primary mb-10">
                  <ul className="grid grid-cols-12 p-5 items-center font-semibold">
                     <li className="col-span-1">Avatar</li>
                     <li className="col-span-3">Name</li>
                     <li className="col-span-2">Field</li>
                     <li className="col-span-2">Hotline</li>
                     <li className="col-span-2">Address</li>
                     <li className="col-span-2"></li>
                  </ul>
                  {FilterArray(agencies)
                     .filter((agency) => agency.isCensored === 1)
                     .slice(
                        (pageCurrent - 1) * lengthOfPage,
                        (pageCurrent - 1) * lengthOfPage + lengthOfPage
                     )
                     .map((agency) => (
                        <Link
                           href={`/DashboardAdmin/agencies/${agency.id}`}
                           key={agency.id}
                        >
                           <ul className="grid grid-cols-12 p-5 items-center dark:bg-dark-spot dark:hover:bg-dark-primary bg-light-spot hover:bg-light-primary cursor-pointer font-medium">
                              <li className="col-span-1">
                                 <Image
                                    src={agency.avatar}
                                    alt="img"
                                    width={42}
                                    height={42}
                                    className="object-cover rounded-xl"
                                 />
                              </li>
                              <li className="col-span-3">{agency.name}</li>
                              <li className="col-span-2">
                                 {agency.field.name}
                              </li>
                              <li className="col-span-2">{agency.hotline}</li>
                              <li className="col-span-2">{agency.address}</li>
                              <li className="col-span-2">
                                 {agency.isActive == 0 &&
                                    (agency.deactivatedByAdmin == 1 ? (
                                       <div className="text-red-500 flex gap-1 items-center text-sm font-medium pl-3 mb-1">
                                          <BiMessageRounded />
                                          Banned by Admin
                                       </div>
                                    ) : (
                                       <div className="text-red-500 flex gap-1 items-center text-sm font-medium pl-3 mb-1">
                                          <BiMessageRounded />
                                          Banned by Expired
                                       </div>
                                    ))}
                                 {agency.isActive == 1 ? (
                                    <div
                                       className=" bg-green-500 text-white px-4 py-2 w-full rounded-lg font-semibold text-center cursor-pointer hover:shadow-lg hover:shadow-green-500"
                                       onClick={(event) => {
                                          event.stopPropagation();
                                          setIsOpenConfirmBan(true);
                                          setModelID(agency.id);
                                       }}
                                    >
                                       Ban
                                    </div>
                                 ) : (
                                    <div
                                       className=" bg-red-500 text-white px-4 py-2 w-full rounded-lg font-semibold text-center cursor-pointer hover:shadow-lg hover:shadow-red-500"
                                       onClick={(event) => {
                                          event.stopPropagation();
                                          setIsOpenConfirmUnBan(true);
                                          setModelID(agency.id);
                                       }}
                                    >
                                       Unban
                                    </div>
                                 )}
                              </li>
                           </ul>
                        </Link>
                     ))}
                  <div
                     className={`fixed top-0 right-0 w-full h-screen backdrop-blur-sm items-center justify-center z-20 ${
                        isOpenConfirmBan ? "flex" : "hidden"
                     }`}
                  >
                     <div className="w-1/3  h-fit">
                        <ConfirmModel
                           functionConfirm={() => handleBanAgency(modelID)}
                           content={"You will ban this merchant!"}
                           isOpenConfirm={isOpenConfirmBan}
                           setIsOpenConfirm={setIsOpenConfirmBan}
                        />
                     </div>
                  </div>
                  <div
                     className={`fixed top-0 right-0 w-full h-screen backdrop-blur-sm items-center justify-center z-20 ${
                        isOpenConfirmUnBan ? "flex" : "hidden"
                     }`}
                  >
                     <div className="w-1/3  h-fit">
                        <ConfirmModel
                           functionConfirm={() => handleUnbanAgency(modelID)}
                           content={"You will unban this merchant!"}
                           isOpenConfirm={isOpenConfirmUnBan}
                           setIsOpenConfirm={setIsOpenConfirmUnBan}
                        />
                     </div>
                  </div>
               </div>
            ) : (
               <>
                  <div className="relative overflow-hidden aspect-square w-1/4 mx-auto">
                     <Image
                        src={emptyBox}
                        alt="empty"
                        layout="fill"
                        className="object-cover"
                     />
                  </div>
                  <div className="uppercase text-xl font-semibold text-center">
                     merchant list is empty
                  </div>
               </>
            )}

            <PaginationComponent
               totalPage={totalPage}
               pageCurrent={pageCurrent}
               setPageCurrent={setPageCurrent}
            />
         </div>
      </AdminLayoutDashboard>
   );
};

export default AgenciesAdminDashboard;
