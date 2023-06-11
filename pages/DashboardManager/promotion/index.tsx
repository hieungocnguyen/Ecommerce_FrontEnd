/* eslint-disable react-hooks/exhaustive-deps */
import {
   BiFilterAlt,
   BiPlanet,
   BiRightArrowAlt,
   BiTrashAlt,
} from "react-icons/bi";
import LayoutDashboardManager from "../../../components/Dashboard/LayoutDashboardManager";
import AddPromotion from "../../../components/Model/AddPromotion";
import API, { endpoints } from "../../../API";
import { useContext, useEffect, useRef, useState } from "react";
import { Store } from "../../../utils/Store";
import Loader from "../../../components/Loader";
import Image from "next/image";
import Link from "next/link";
import DetailPromotion from "../../../components/Model/DetailPromotion";
import CreatePromotionCode from "../../../components/Model/CreatePromotionCode";
import Pagination from "../../../components/Pagination";
import UpdateProgram from "../../../components/Model/UpdateProgram";
import emptyBox from "../../../public/empty-box.png";
import toast from "react-hot-toast";

const PromotionPage = () => {
   const [posts, setPosts] = useState<any>([]);
   const { state } = useContext(Store);
   const { agencyInfo } = state;
   const [isOpenModel, setisOpenModel] = useState(false);
   const [isOpenModelDetail, setIsOpenModelDetail] = useState(false);
   const [isOpenModelCreateCode, setIsModelCreateCode] = useState(false);
   const [isOpenModelUpdateProgram, setIsOpenModelUpdateProgram] =
      useState(false);
   const [loading, setLoading] = useState(false);
   const [programs, setPrograms] = useState<any>([]);
   const [program, setProgram] = useState<any>({});

   const lengthOfPage = 2;
   const [pageCurrent, setPageCurrent] = useState(1);
   const [totalPage, setTotalPage] = useState(0);
   const [programNameFilter, setProgramNameFilter] = useState("");
   const [isOpenFilter, setIsOpenFilter] = useState(false);
   const [dateOrder, setDateOrder] = useState([
      "2001-03-20",
      new Date(Date.now() + 2629743 * 1000).toISOString().slice(0, 10),
   ]);
   const refKeywordName = useRef(null);

   const fetchPost = async () => {
      try {
         const { data } = await API.get(
            endpoints["get_post_published_by_agencyID"](agencyInfo.id)
         );
         setPosts(data.data);
      } catch (error) {
         console.log(error);
      }
   };

   const fetchProgram = async () => {
      try {
         const { data } = await API.get(
            endpoints["get_all_promotion_program"](agencyInfo.id)
         );
         setPrograms(data.data);
         setTotalPage(Math.ceil(data.data.length / lengthOfPage));

         if (isOpenModelDetail) {
            const updatedProgram = data.data.find((p) => p.id == program.id);
            setProgram(updatedProgram);
         }
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      fetchPost();
      fetchProgram();
   }, [isOpenModelDetail, isOpenModel]);

   useEffect(() => {
      setTotalPage(Math.ceil(FilterArray(programs).length / lengthOfPage));
   }, [programNameFilter, dateOrder]);

   const FilterArray = (array) => {
      let resultArray;
      try {
         resultArray = array
            .filter(
               (program) =>
                  unicodeParse(program.programName)
                     .toUpperCase()
                     .search(unicodeParse(programNameFilter)) >= 0
            )
            .filter(
               (program) =>
                  program.createdDate >= Date.parse(dateOrder[0]) &&
                  program.createdDate <= Date.parse(dateOrder[1])
            );
      } catch (error) {
         resultArray = array;
      }
      // let resultArray = array
      //    .filter(
      //       (program) =>
      //          unicodeParse(program.programName)
      //             .toUpperCase()
      //             .search(unicodeParse(programNameFilter)) >= 0
      //    )
      //    .filter(
      //       (program) =>
      //          program.createdDate >= Date.parse(dateOrder[0]) &&
      //          program.createdDate <= Date.parse(dateOrder[1])
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
      setProgramNameFilter("");
      refKeywordName.current.value = "";
      setDateOrder([
         "2001-03-20",
         new Date(Date.now() + 2629743 * 1000).toISOString().slice(0, 10),
      ]);
      toast.success("Cleared filter");
   };

   return (
      <LayoutDashboardManager title="Promotion">
         <div className=" mx-auto my-8">
            <div className="flex justify-between items-center mb-2">
               <div className="font-semibold text-2xl flex items-center gap-1">
                  <div className="text-primary-color">
                     <BiPlanet />
                  </div>
                  <div>Promotion</div>
               </div>
               <div className=" flex gap-2">
                  <div
                     className="py-3 px-5 text-primary-color hover:bg-primary-color rounded-lg hover:text-white font-semibold transition-all cursor-pointer border-2 border-primary-color"
                     onClick={() => setisOpenModel(true)}
                  >
                     Add new promotion program
                  </div>
                  <div
                     className="p-3 text-white bg-primary-color rounded-lg cursor-pointer hover:shadow-lg hover:shadow-primary-color hover:brightness-90"
                     onClick={() => setIsOpenFilter(!isOpenFilter)}
                  >
                     <BiFilterAlt className="text-2xl" />
                  </div>
               </div>
            </div>
            <div
               className={`bg-primary-color overflow-hidden transition-all duration-100 rounded-lg flex justify-center gap-4 ${
                  isOpenFilter ? "h-fit p-3 mb-2" : "h-0 p-0 mb-0"
               }`}
            >
               <input
                  type="text"
                  placeholder="🔎Program Name"
                  id="keywordCodeFilterOrder"
                  ref={refKeywordName}
                  className={`rounded-lg ${isOpenFilter ? "p-3" : "p-0"}`}
                  onKeyDown={(e) => {
                     ["(", ")", "`", "`", "[", "]", "?", "\\"].includes(
                        e.key
                     ) && e.preventDefault();
                  }}
                  onChange={(e) => {
                     setProgramNameFilter(e.target.value.toUpperCase());
                     setPageCurrent(1);
                  }}
               />
               <div className="flex items-center bg-white rounded-lg">
                  <label
                     className="pl-3 font-medium whitespace-nowrap"
                     htmlFor="fromDate"
                  >
                     From date:
                  </label>
                  <input
                     type="date"
                     id="fromDate"
                     className={`rounded-lg ${isOpenFilter ? "p-3" : "p-0"}`}
                     value={dateOrder[0]}
                     onChange={(e) => {
                        setDateOrder([e.target.value, dateOrder[1]]);
                     }}
                  />
               </div>
               <div className="flex items-center bg-white rounded-lg">
                  <label
                     className="pl-3 font-medium whitespace-nowrap"
                     htmlFor="toDate"
                  >
                     To date:
                  </label>
                  <input
                     type="date"
                     id="toDate"
                     className={`rounded-lg ${isOpenFilter ? "p-3" : "p-0"}`}
                     value={dateOrder[1]}
                     onChange={(e) => {
                        setDateOrder([dateOrder[0], e.target.value]);
                     }}
                  />
               </div>
               <div
                  className="p-3 bg-secondary-color rounded-lg font-semibold text-dark-primary cursor-pointer hover:shadow-lg hover:shadow-secondary-color hover:brightness-90 flex gap-1 items-center"
                  onClick={clearFilter}
               >
                  <BiTrashAlt className="text-2xl" />
                  Clear filter
               </div>
            </div>
            <div className="grid grid-cols-2 gap-8">
               {FilterArray(programs)
                  .slice(
                     (pageCurrent - 1) * lengthOfPage,
                     (pageCurrent - 1) * lengthOfPage + lengthOfPage
                  )
                  .map((program) => (
                     <div
                        key={program.id}
                        className="rounded-lg overflow-hidden bg-light-primary hover:shadow-lg cursor-pointer"
                        onClick={() => {
                           setProgram(program);
                           setIsOpenModelDetail(true);
                        }}
                     >
                        <div
                           className={`relative overflow-hidden w-full h-80 ${
                              program.state == 0 && "grayscale"
                           }`}
                        >
                           <Image
                              src={program.avatar}
                              alt="img"
                              layout="fill"
                              className="object-cover"
                           />
                        </div>
                        <div className="p-3">
                           <div className="font-bold text-primary-color  line-clamp-1 text-xl">
                              {program.programName}
                           </div>
                           <div className="line-clamp-1 font-medium">
                              {program.programTitle}
                           </div>
                           <div className="h-[72px]">
                              <div className=" font-medium flex gap-2">
                                 <span>🍀Reduction Type:</span>
                                 <span>
                                    {program.reductionType == 1
                                       ? "AMOUNT"
                                       : "PERCENTAGE"}
                                 </span>
                              </div>
                              {program.reductionType == 2 && (
                                 <div className=" font-medium flex gap-2">
                                    <span>✨Percentage Reduction:</span>
                                    <span>{program.percentageReduction}%</span>
                                 </div>
                              )}
                              <div className="mb-1 font-medium flex gap-2">
                                 <span>💵Reduction Amount Maximum:</span>
                                 <span>
                                    {program?.reductionAmountMax?.toLocaleString(
                                       "it-IT",
                                       {
                                          style: "currency",
                                          currency: "VND",
                                       }
                                    )}
                                 </span>
                              </div>
                           </div>
                           <div className="flex justify-center items-center gap-1 text-sm font-medium mt-2">
                              <div className="py-1 px-2 bg-secondary-color text-light-text rounded-full">
                                 {new Date(program.beginUsable).getHours()}
                                 {"h"}
                                 {new Date(program.beginUsable).getMinutes()}
                                 {"p"}
                                 {" | "}
                                 {new Date(
                                    program.beginUsable
                                 ).toLocaleDateString("en-GB")}
                              </div>
                              <BiRightArrowAlt className="text-sm" />
                              <div className="py-1 px-2 bg-secondary-color text-light-text rounded-full">
                                 {new Date(program.endUsable).getHours()}
                                 {"h"}
                                 {new Date(program.endUsable).getMinutes()}
                                 {"p"}
                                 {" | "}
                                 {new Date(
                                    program.endUsable
                                 ).toLocaleDateString("en-GB")}
                              </div>
                           </div>
                           <div className="flex justify-center items-center font-medium mt-2 italic">
                              Created date:{" "}
                              {new Date(program.createdDate).toLocaleDateString(
                                 "en-GB"
                              )}
                           </div>
                        </div>
                     </div>
                  ))}
            </div>
            <div className="">
               {FilterArray(programs).length == 0 && (
                  <div className="relative overflow-hidden w-1/3 aspect-square mx-auto">
                     <Image
                        src={emptyBox}
                        alt="empty"
                        layout="fill"
                        className="object-cover"
                     />
                  </div>
               )}
            </div>
            <Pagination
               totalPage={totalPage}
               pageCurrent={pageCurrent}
               setPageCurrent={setPageCurrent}
            />
            <div
               className={`absolute top-0 right-0 w-full h-screen backdrop-blur-sm items-center justify-center ${
                  isOpenModel ? "flex" : "hidden"
               }`}
            >
               <div className="w-3/4 ">
                  <AddPromotion
                     posts={posts}
                     setisOpenModel={setisOpenModel}
                     agencyInfo={agencyInfo}
                     setLoading={setLoading}
                  />
               </div>
            </div>
            <div
               className={`absolute top-0 right-0 w-full h-screen backdrop-blur-sm items-center justify-center ${
                  isOpenModelDetail ? "flex" : "hidden"
               }`}
            >
               <div className="w-3/4 ">
                  <DetailPromotion
                     program={program}
                     programs={programs}
                     isOpenModelCreateCode={isOpenModelCreateCode}
                     setIsOpenModelDetail={setIsOpenModelDetail}
                     setProgram={setProgram}
                     setIsModelCreateCode={setIsModelCreateCode}
                     fetchProgram={fetchProgram}
                     setIsOpenModelUpdateProgram={setIsOpenModelUpdateProgram}
                  />
               </div>
            </div>
            <div
               className={`absolute top-0 right-0 w-full h-screen backdrop-blur-sm items-center justify-center z-30 ${
                  isOpenModelCreateCode ? "flex" : "hidden"
               }`}
            >
               <div className="w-1/2 ">
                  <CreatePromotionCode
                     program={program}
                     setIsModelCreateCode={setIsModelCreateCode}
                     setLoading={setLoading}
                  />
               </div>
            </div>
            <div
               className={`absolute top-0 right-0 w-full h-screen backdrop-blur-sm items-center justify-center z-30 ${
                  isOpenModelUpdateProgram ? "flex" : "hidden"
               }`}
            >
               {isOpenModelUpdateProgram && (
                  <div className="w-1/2 ">
                     <UpdateProgram
                        program={program}
                        fetchProgram={fetchProgram}
                        setIsOpenModelUpdateProgram={
                           setIsOpenModelUpdateProgram
                        }
                        setLoading={setLoading}
                     />
                  </div>
               )}
            </div>
            {loading ? <Loader /> : <></>}
         </div>
      </LayoutDashboardManager>
   );
};

export default PromotionPage;
