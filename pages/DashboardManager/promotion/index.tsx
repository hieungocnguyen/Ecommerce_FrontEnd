import { BiPlanet, BiRightArrowAlt } from "react-icons/bi";
import LayoutDashboardManager from "../../../components/Dashboard/LayoutDashboardManager";
import AddPromotion from "../../../components/Model/AddPromotion";
import API, { endpoints } from "../../../API";
import { useContext, useEffect, useState } from "react";
import { Store } from "../../../utils/Store";
import Loader from "../../../components/Loader";
import Image from "next/image";
import Link from "next/link";
import DetailPromotion from "../../../components/Model/DetailPromotion";
import CreatePromotionCode from "../../../components/Model/CreatePromotionCode";
import Pagination from "../../../components/Pagination";
import UpdateProgram from "../../../components/Model/UpdateProgram";
import emptyBox from "../../../public/empty-box.png";

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

   return (
      <LayoutDashboardManager title="Promotion">
         <div className=" mx-auto my-8">
            <div className="flex justify-between items-center mb-6">
               <div className="font-semibold text-2xl flex items-center gap-1">
                  <div className="text-primary-color">
                     <BiPlanet />
                  </div>
                  <div>Promotion</div>
               </div>
               <div
                  className="py-3 px-5 text-primary-color hover:bg-primary-color rounded-lg hover:text-white font-semibold transition-all cursor-pointer border-2 border-primary-color"
                  onClick={() => setisOpenModel(true)}
               >
                  Add new promotion program
               </div>
            </div>
            <div className="grid grid-cols-2 gap-8">
               {programs
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
                        <div className="relative overflow-hidden w-full h-80">
                           <Image
                              src={program.avatar}
                              alt="img"
                              layout="fill"
                              className="object-cover"
                           />
                        </div>
                        <div className="p-3">
                           <div className="font-bold text-primary-color uppercase line-clamp-1 text-xl">
                              {program.programTitle}
                           </div>
                           <div className="text-sm line-clamp-1 font-medium">
                              {program.programName}
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
                        </div>
                     </div>
                  ))}
            </div>
            <div className="">
               {programs.length == 0 && (
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
