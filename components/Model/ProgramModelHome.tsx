import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BiClipboard, BiRightArrowAlt } from "react-icons/bi";
import API, { endpoints } from "../../API";
import { toast } from "react-hot-toast";
import emptyBox from "../../public/empty-box.png";
import Link from "next/link";
import { useRouter } from "next/router";

const ProgramModelHome = ({
   program,
   setProgram,
   setOpenModelDetail,
   openModelDetail,
}) => {
   const wrapperRef = useRef(null);
   const [codes, setCodes] = useState<any>([]);
   const [posts, setPosts] = useState<any>([]);
   const router = useRouter();

   const fetchCode = async () => {
      try {
         const { data } = await API.get(
            endpoints["get_all_publish_promotion_code"](program.id)
         );
         setCodes(data.data);
      } catch (error) {
         console.log(error);
      }
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
   }, [program.id]);

   useEffect(() => {
      function handleClickOutside(event) {
         if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setOpenModelDetail(false);
         }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [wrapperRef]);

   const handleSaveVouchers = (code, agencyID, agencyName, agencyAvatar) => {
      const newVoucher = {
         code: code,
         agencyID: agencyID,
         agencyName: agencyName,
         agencyAvatar: agencyAvatar,
      };

      if (JSON.parse(sessionStorage.getItem("vouchers"))) {
         if (JSON.parse(sessionStorage.getItem("vouchers")).length >= 10) {
            toast.error("Limit to save code is 10");
         } else {
            const existProduct = JSON.parse(
               sessionStorage.getItem("vouchers")
            ).find((voucher) => voucher.code === newVoucher.code);

            if (existProduct) {
               toast.error("This code has saved");
            } else {
               const listVouchers = [
                  ...JSON.parse(sessionStorage.getItem("vouchers")),
                  newVoucher,
               ];
               sessionStorage.setItem("vouchers", JSON.stringify(listVouchers));
               toast.success("Added code to clipboard!");
            }
         }
      } else {
         const initStorage = [newVoucher];
         sessionStorage.setItem("vouchers", JSON.stringify(initStorage));
         toast.success("Added code to clipboard!");
      }
   };

   return (
      <div
         className="dark:bg-neutral-800 bg-light-bg rounded-lg w-full relative shadow-xl h-[700px] overflow-auto"
         ref={wrapperRef}
      >
         <div className="relative w-full h-56 rounded-t-lg">
            <Image
               src={program.avatar}
               alt="img"
               layout="fill"
               className="object-cover"
            />
            <div className="w-[90%] mx-auto bg-gradient-to-tr from-white to-sky-50 translate-y-28 p-4 rounded-lg shadow-lg shadow-blue-200">
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
         </div>
         <div className="w-[95%] mx-auto grid grid-cols-3 gap-6 mt-32">
            <div className="col-span-2">
               {/* code */}
               <div>
                  <div className="mb-2">
                     <div className="font-semibold text-xl text-left">
                        Codes
                     </div>
                  </div>
                  {codes.length > 0 && (
                     <div className=" grid grid-flow-col auto-cols-max gap-4 overflow-x-auto">
                        {codes.map((code) => (
                           <div
                              key={code.id}
                              className="px-4 py-2 border-2 border-primary-color rounded-lg cursor-pointer hover:bg-green-50 flex gap-2 items-center"
                              onClick={() => {
                                 handleSaveVouchers(
                                    code.code,
                                    program.agency.id,
                                    program.agency.name,
                                    program.agency.avatar
                                 );
                              }}
                           >
                              <div className="text-2xl text-green-600">
                                 <BiClipboard />
                              </div>
                              <div>
                                 <div className="font-bold text-lg uppercase text-primary-color text-left">
                                    {code.code}
                                 </div>
                                 <div className="mt-1 text-left">
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
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  )}

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

               {/* description */}
               <div className="mt-2 text-left">
                  <div className="text-xl font-semibold text-left">
                     Description
                  </div>
                  <div className="p-4 border-2 border-primary-color rounded-lg mt-2">
                     <div
                        dangerouslySetInnerHTML={{
                           __html: program.description,
                        }}
                     ></div>
                  </div>
               </div>
            </div>
            <div className="">
               {program.id && (
                  <div className="mb-3">
                     <div className="font-semibold text-xl mb-2">Merchant</div>
                     <div className="grid grid-cols-6 items-center gap-2 border-2 p-2 border-primary-color rounded-lg">
                        <div className="relative overflow-hidden w-full aspect-square rounded-lg">
                           <Image
                              src={program.agency.avatar}
                              alt="img"
                              layout="fill"
                              className="object-cover"
                           />
                        </div>
                        <div className="font-semibold col-span-5 text-left">
                           {program.agency.name}
                        </div>
                     </div>
                  </div>
               )}

               <div>
                  <div className="font-semibold text-xl mb-2">
                     Available Product(s)
                  </div>
                  {program.availableSku === "ALL" && (
                     <div
                        className="w-[80%] mx-auto border-2 border-primary-color rounded-lg p-3 cursor-pointer hover:bg-gradient-to-t hover:from-blue-50 hover:to-blue-100"
                        onClick={() => {
                           router.push(`/agencyinfo/${program.agency.id}`);
                           setOpenModelDetail(false);
                        }}
                     >
                        <div className="text-lg font-semibold">
                           All products of
                        </div>
                        <div className="relative overflow-hidden w-4/5 mx-auto aspect-square rounded-xl mt-4">
                           <Image
                              src={program.agency.avatar}
                              alt="img"
                              layout="fill"
                              className="object-cover"
                           />
                        </div>
                        <div className="font-semibold text-primary-color text-lg mt-2">
                           {program.agency.name}
                        </div>
                     </div>
                  )}
                  {posts.length > 0 && (
                     <div className="flex flex-col space-y-2">
                        {posts.map((post) => (
                           <Link href={`/sale_post/${post.id}`} key={post.id}>
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
         </div>
      </div>
   );
};

export default ProgramModelHome;
