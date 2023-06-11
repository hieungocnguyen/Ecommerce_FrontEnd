import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { BiCheck, BiShowAlt, BiX } from "react-icons/bi";
import API, { authAxios, endpoints } from "../../../API";
import AdminLayoutDashboard from "../../../components/Dashboard/AdminLayoutDashboard";
import emptyvector from "../../../public/empty-box.png";
import ConfirmModel from "../../../components/Model/ConfirmModel";
import PaginationComponent from "../../../components/Pagination";

const AgenciesAdminDashboard = () => {
   const [uncensored, setUncensored] = useState([]);
   const [isOpenConfirmCensor, setIsOpenConfirmCensor] = useState(false);
   const [isOpenConfirmUnCensor, setIsOpenConfirmUnCensor] = useState(false);
   const [modelID, setModelID] = useState(-1);

   const lengthOfPage = 6;
   const [pageCurrent, setPageCurrent] = useState(1);
   const [totalPage, setTotalPage] = useState(0);
   const [keyword, setKeyword] = useState("");

   const loadUncensoredNumber = async () => {
      try {
         const resUncensored = await API.get(endpoints["uncensored_agency"]);
         setUncensored(resUncensored.data.data);
         setTotalPage(Math.ceil(resUncensored.data.data.length / lengthOfPage));
      } catch (error) {
         console.log(error);
      }
   };
   useEffect(() => {
      loadUncensoredNumber();
   }, []);

   useEffect(() => {
      setTotalPage(Math.ceil(FilterArray(uncensored).length / lengthOfPage));
   }, [keyword]);

   const handleAccept = async (id) => {
      try {
         const resAccept = await authAxios().patch(
            endpoints["accept_agency"](id)
         );
         loadUncensoredNumber();
         toast.success("Accepted merchant successful!", {
            position: "top-center",
         });
      } catch (error) {
         toast.error("Something wrong, try it later!", {
            position: "top-center",
         });
         console.log(error);
      }
      setModelID(-1);
   };
   const handleDeny = async (id) => {
      try {
         const resDeny = await authAxios().patch(endpoints["deny_agency"](id));
         loadUncensoredNumber();
         toast.success("Denied merchant successful!", {
            position: "top-center",
         });
      } catch (error) {
         toast.error("Something wrong, try it later!", {
            position: "top-center",
         });
         console.log(error);
      }
      setModelID(-1);
   };

   const FilterArray = (array) => {
      let resultArray = array.filter(
         (agency) =>
            unicodeParse(agency.agency.name).search(unicodeParse(keyword)) >= 0
      );

      return resultArray;
   };

   const unicodeParse = (string) => {
      return string
         .normalize("NFD")
         .replace(/[\u0300-\u036f]/g, "")
         .replace(/đ/g, "d")
         .replace(/Đ/g, "D");
   };

   return (
      <AdminLayoutDashboard title="Uncensored Agencies">
         <div className="w-[95%] mx-auto mt-8">
            <div className="flex justify-between my-4">
               <div className="font-semibold text-2xl">
                  Uncensored Merchants
               </div>
               <div className="">
                  <input
                     type="text"
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
               </div>
            </div>
            {FilterArray(uncensored).length > 0 ? (
               <div className="rounded-lg dark:bg-dark-primary bg-light-spot overflow-hidden shadow-2xl dark:shadow-dark-shadow shadow-light-spot">
                  <ul className="grid grid-cols-12 p-5 dark:bg-dark-spot bg-light-primary items-center font-semibold">
                     <li className="col-span-1">Avatar</li>
                     <li className="col-span-3">Name</li>
                     <li className="col-span-2">Field</li>
                     <li className="col-span-2">Hotline</li>
                     <li className="col-span-3">Address</li>
                  </ul>
                  {FilterArray(uncensored)
                     .slice(
                        (pageCurrent - 1) * lengthOfPage,
                        (pageCurrent - 1) * lengthOfPage + lengthOfPage
                     )
                     .map((agency) => (
                        <ul
                           className="grid grid-cols-12 p-5  items-center dark:hover:bg-dark-spot hover:bg-light-spot cursor-pointer relative font-medium"
                           key={agency.id}
                        >
                           <li className="col-span-1">
                              <Image
                                 src={agency.agency.avatar}
                                 alt="img"
                                 width={42}
                                 height={42}
                                 className="object-cover rounded-lg"
                              />
                           </li>
                           <li className="col-span-3">{agency.agency.name}</li>
                           <li className="col-span-2">
                              {agency.agency.field.name}
                           </li>
                           <li className="col-span-2">
                              {agency.agency.hotline}
                           </li>
                           <li className="col-span-3">
                              {agency.agency.address}
                           </li>
                           <li className="flex gap-5 text-3xl absolute right-5">
                              {/* <div className="p-2 rounded-lg bg-primary-color text-white shadow-lg hover:shadow-primary-color transition-all">
                              <BiShowAlt />
                           </div> */}
                              <div
                                 className="p-2 rounded-lg bg-primary-color text-white shadow-lg hover:shadow-primary-color transition-all"
                                 onClick={() => {
                                    setIsOpenConfirmCensor(true);
                                    setModelID(agency.id);
                                 }}
                              >
                                 <BiCheck />
                              </div>
                              <div
                                 className="p-2 rounded-lg bg-secondary-color text-white shadow-lg hover:shadow-secondary-color transition-all"
                                 onClick={() => {
                                    setIsOpenConfirmUnCensor(true);
                                    setModelID(agency.id);
                                 }}
                              >
                                 <BiX />
                              </div>
                           </li>
                        </ul>
                     ))}
               </div>
            ) : (
               <div>
                  <div className="relative w-80 h-80 rounded-md overflow-hidden mx-auto">
                     <Image
                        src={emptyvector}
                        alt="Empty"
                        layout="fill"
                        objectFit="cover"
                     ></Image>
                  </div>
                  <div className="uppercase text-xl font-semibold text-center">
                     There are no registrations yet
                  </div>
               </div>
            )}

            <PaginationComponent
               totalPage={totalPage}
               pageCurrent={pageCurrent}
               setPageCurrent={setPageCurrent}
            />

            <div
               className={`fixed top-0 right-0 w-full h-screen backdrop-blur-sm items-center justify-center z-20 ${
                  isOpenConfirmCensor ? "flex" : "hidden"
               }`}
            >
               <div className="w-1/3  h-fit">
                  <ConfirmModel
                     functionConfirm={() => handleAccept(modelID)}
                     content={"You will accept this merchant!"}
                     isOpenConfirm={isOpenConfirmCensor}
                     setIsOpenConfirm={setIsOpenConfirmCensor}
                  />
               </div>
            </div>
            <div
               className={`fixed top-0 right-0 w-full h-screen backdrop-blur-sm items-center justify-center z-20 ${
                  isOpenConfirmUnCensor ? "flex" : "hidden"
               }`}
            >
               <div className="w-1/3  h-fit">
                  <ConfirmModel
                     functionConfirm={() => handleDeny(modelID)}
                     content={"You will deny this merchant!"}
                     isOpenConfirm={isOpenConfirmUnCensor}
                     setIsOpenConfirm={setIsOpenConfirmUnCensor}
                  />
               </div>
            </div>
         </div>
      </AdminLayoutDashboard>
   );
};

export default AgenciesAdminDashboard;
