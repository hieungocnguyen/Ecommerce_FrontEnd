import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BiEdit, BiPlus, BiRightArrowAlt, BiTrash, BiX } from "react-icons/bi";
import API, { endpoints } from "../../API";
import emptyBox from "../../public/empty-box.png";
import toast from "react-hot-toast";
import ConfirmModel from "./ConfirmModel";
import { useRouter } from "next/router";
import Link from "next/link";

const DetailPromotion = ({
   program,
   programs,
   setIsOpenModelDetail,
   setProgram,
   setIsModelCreateCode,
   isOpenModelCreateCode,
   fetchProgram,
   setIsOpenModelUpdateProgram,
}) => {
   const [codes, setCodes] = useState<any>([]);
   const [posts, setPosts] = useState<any>([]);
   const [isOpenConfirm, setIsOpenConfirm] = useState(false);
   const [confirmCodeID, setConfirmCodeID] = useState(0);
   const router = useRouter();

   const fetchCode = async () => {
      try {
         const { data } = await API.get(
            endpoints["get_all_promotion_code"](program.id)
         );
         setCodes(data.data);
      } catch (error) {}
   };

   const fetchPosts = async () => {
      try {
         setPosts([]);
         if (program.availableSku !== "ALL") {
            const { data } = await API.post(
               endpoints["get_sale_post_by_list_post_ID"],
               {
                  listSalePostID: program.availableSku
                     .split(";")
                     .filter((n) => n),
               }
            );
            setPosts(data.data);
         }
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      if (program.id) {
         fetchCode();
         fetchPosts();
      }
   }, [program, isOpenModelCreateCode]);

   const handlePublishCode = async (id) => {
      try {
         const resPublish = await API.patch(endpoints["publish_code"](id));
         fetchCode();
         toast.success("Change state successful!", {
            position: "top-center",
         });
      } catch (error) {
         console.log(error);
      }
   };

   const handleUnpublishCode = async (id) => {
      try {
         const resUnpublish = await API.patch(endpoints["unpublish_code"](id));
         fetchCode();
         toast.success("Change state successful!", {
            position: "top-center",
         });
      } catch (error) {
         console.log(error);
      }
   };

   const handleDeleteCode = async (id) => {
      try {
         const resDelete = await API.delete(endpoints["delete_code"](id));
         fetchCode();
         toast.success("Delete successful!");
         setConfirmCodeID(0);
      } catch (error) {
         console.log(error);
         setConfirmCodeID(0);
      }
   };

   const handleUnpublishProgram = async () => {
      try {
         const resUnpublish = await API.put(
            endpoints["update_promotion_program"](program.id),
            { state: program.state == 0 ? 1 : 0 }
         );
         toast.success("Change state successful!", {
            position: "top-center",
         });
         fetchProgram();
         // updateProgram();
      } catch (error) {
         console.log(error);
      }
   };

   return (
      <div className="bg-light-bg dark:bg-dark-bg rounded-lg w-full h-[680px] overflow-auto relative shadow-lg border-2 border-primary-color ">
         <div
            className="absolute top-3 right-3 rounded-xl bg-red-500 text-white text-3xl w-12 h-12 flex justify-center items-center z-30 cursor-pointer hover:shadow-lg hover:shadow-red-500"
            onClick={() => {
               setIsOpenModelDetail(false);
               setProgram({});
            }}
         >
            <BiX />
         </div>
         <div className="absolute left-3 top-3 p-2 rounded-lg flex items-center gap-2 z-30">
            <div
               className="bg-secondary-color text-light-text text-2xl w-12 h-12 flex justify-center items-center z-30 cursor-pointer hover:shadow-lg hover:shadow-secondary-color rounded-xl"
               onClick={() => setIsOpenModelUpdateProgram(true)}
            >
               <BiEdit />
            </div>
            <div className="">
               <label className="relative flex items-center cursor-pointer">
                  <input
                     type="checkbox"
                     value=""
                     className="sr-only peer"
                     checked={program.state == 1 ? true : false}
                     onClick={(e) => {
                        handleUnpublishProgram();
                     }}
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none  rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-color"></div>
               </label>
            </div>
         </div>
         <div className="relative overflow-hidden w-full h-56">
            <Image
               src={program.avatar}
               alt="img"
               layout="fill"
               className="object-cover"
            />
         </div>
         <div className="w-[90%] mx-auto bg-gradient-to-tr from-white to-sky-50 -translate-y-10 p-4 rounded-lg shadow-lg shadow-blue-200">
            <div className="text-2xl font-bold uppercase text-center">
               {program.programTitle}
            </div>
            <div className="mb-2 text-center">{program.programName}</div>
            <div
               className={`grid ${
                  program.reductionType == 2 ? "grid-cols-3" : "grid-cols-2"
               } mb-4 gap-6`}
            >
               <div className="font-medium text-center rounded-xl bg-gradient-to-tr from-sky-100 to-white p-3 ">
                  <div className="text-sm">✨Reduction Type:</div>
                  <div className="text-lg font-semibold text-primary-color">
                     {program.reductionType == 1 ? "AMOUNT" : "PERCENTAGE"}
                  </div>
               </div>
               {program.reductionType == 2 && (
                  <div className=" font-medium text-center rounded-xl bg-gradient-to-tr from-sky-100 to-white p-3">
                     <div className="text-sm">✨Percentage Reduction:</div>
                     <div className="text-lg font-semibold text-primary-color">
                        {program.percentageReduction}%
                     </div>
                  </div>
               )}
               <div className="font-medium text-center rounded-xl bg-gradient-to-tr from-sky-100 to-white p-3">
                  <div className="text-sm">💵Reduction Amount Maximum:</div>
                  <div className="text-lg font-semibold text-primary-color">
                     {program?.reductionAmountMax?.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                     })}
                  </div>
               </div>
            </div>
            <div className="flex items-center justify-center gap-1 text-sm font-semibold">
               <div className="py-1 px-2 bg-gradient-to-bl from-amber-400 to-secondary-color text-light-text rounded-xl">
                  {new Date(program.beginUsable).getHours()}
                  {"h"}
                  {new Date(program.beginUsable).getMinutes()}
                  {"p"}
                  {" | "}
                  {new Date(program.beginUsable).toLocaleDateString("en-GB")}
               </div>
               <BiRightArrowAlt className="text-2xl" />
               <div className="py-1 px-2 bg-gradient-to-bl from-amber-400 to-secondary-color text-light-text rounded-xl">
                  {new Date(program.endUsable).getHours()}
                  {"h"}
                  {new Date(program.endUsable).getMinutes()}
                  {"p"}
                  {" | "}
                  {new Date(program.endUsable).toLocaleDateString("en-GB")}
               </div>
            </div>
         </div>
         <div className="mx-6 grid grid-cols-3 gap-6 mb-2">
            <div className="col-span-2">
               <div className="mb-2">
                  <div className="flex justify-between items-center mb-2">
                     <div className="font-semibold text-lg">Codes</div>
                     <div
                        className="p-2 rounded-full bg-primary-color text-2xl text-white cursor-pointer"
                        onClick={() => setIsModelCreateCode(true)}
                     >
                        <BiPlus />
                     </div>
                  </div>
                  <div className="grid grid-flow-col auto-cols-max gap-4 overflow-auto">
                     {codes.map((code) => (
                        <div
                           key={code.id}
                           className="px-4 py-2 border-2 border-primary-color rounded-lg w-72"
                        >
                           <div className="font-bold text-lg uppercase text-primary-color ">
                              {code.code}
                           </div>
                           <div className="">
                              <div className="font-semibold text-sm">
                                 <div>
                                    End usable:{" "}
                                    {new Date(
                                       code.endUsableDate
                                    ).toLocaleDateString("en-GB")}
                                 </div>
                                 <div className="font-semibold text-sm">
                                    Remain: {code.totalCurrent}/
                                    {code.totalRelease}
                                 </div>
                              </div>
                              <div className="flex justify-around items-center">
                                 <label className="relative flex items-center cursor-pointer">
                                    <input
                                       type="checkbox"
                                       value=""
                                       className="sr-only peer"
                                       checked={
                                          code.isPublic == 1 ? true : false
                                       }
                                       onClick={(e) => {
                                          if (code.isPublic == 1) {
                                             handleUnpublishCode(code.id);
                                          } else {
                                             handlePublishCode(code.id);
                                          }
                                       }}
                                    />
                                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none  rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-color"></div>
                                 </label>
                                 <div
                                    className="w-10 h-10 flex justify-center items-center cursor-pointer rounded-lg text-2xl text-red-500 opacity-90 hover:bg-red-300 hover:text-red-600"
                                    onClick={() => {
                                       setConfirmCodeID(code.id);
                                       setIsOpenConfirm(true);
                                    }}
                                 >
                                    <BiTrash />
                                 </div>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
                  {codes.length == 0 && (
                     <div className="col-span-2 relative overflow-hidden w-1/5 aspect-square mx-auto my-2">
                        <Image
                           src={emptyBox}
                           alt="img"
                           className="object-cover"
                           layout="fill"
                        />
                     </div>
                  )}
               </div>
               <div>
                  <div className="font-semibold text-lg mb-2">Description</div>
                  <div className="border-2 p-4 border-primary-color rounded-lg">
                     <div
                        dangerouslySetInnerHTML={{
                           __html: program.description,
                        }}
                     ></div>
                  </div>
               </div>
            </div>
            <div className="">
               <div className="font-semibold text-lg text-center">
                  Available Products
               </div>
               {program.availableSku === "ALL" && (
                  <div className="border-2 border-primary-color rounded-lg p-3  text-center">
                     <div className="text-lg font-semibold">
                        All products of your merchant
                     </div>
                  </div>
               )}
               {posts.length > 0 && (
                  <div className="flex flex-col space-y-2">
                     {posts.map((post) => (
                        <Link
                           href={`/DashboardManager/posts/${post.id}`}
                           key={post.id}
                        >
                           <div className="flex items-center gap-2 p-3 bg-light-primary rounded-lg hover:brightness-95 cursor-pointer">
                              <div className="relative overflow-hidden w-10 aspect-square">
                                 <Image
                                    src={post.avatar}
                                    alt="img"
                                    layout="fill"
                                    className="object-cover bg-white rounded-lg"
                                 />
                              </div>
                              <div className="line-clamp-1 text-left font-medium">
                                 {post.title}
                              </div>
                           </div>
                        </Link>
                     ))}
                  </div>
               )}
            </div>
         </div>

         <div
            className={`fixed top-0 right-0 w-full h-screen backdrop-blur-sm items-center justify-center z-20 ${
               isOpenConfirm ? "flex" : "hidden"
            }`}
         >
            <div className="w-1/3  h-fit">
               <ConfirmModel
                  functionConfirm={() => handleDeleteCode(confirmCodeID)}
                  content={"Delete code?"}
                  isOpenConfirm={isOpenConfirm}
                  setIsOpenConfirm={setIsOpenConfirm}
               />
            </div>
         </div>
      </div>
   );
};

export default DetailPromotion;
