/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay } from "swiper";
import { Pagination } from "swiper";
import Image from "next/image";
import API, { endpoints } from "../API";
import ProgramModelHome from "./Model/ProgramModelHome";
import useTrans from "../hook/useTrans";

const imageList = [
   {
      id: 1,
      url: "https://res.cloudinary.com/ngnohieu/image/upload/v1681111574/0Mesa_de_trabajo_1_w8fhfs.png",

      title: "Test title 123",
   },
   {
      id: 2,
      url: "https://res.cloudinary.com/ngnohieu/image/upload/v1683623668/7943920_w0uyra.png",
      title: "Test title 123",
   },
   {
      id: 3,
      url: "https://res.cloudinary.com/ngnohieu/image/upload/v1683623357/6314317_Medium_ko0i5o.png",
      title: "Test title 123",
   },
   {
      id: 4,
      url: "https://res.cloudinary.com/ngnohieu/image/upload/v1683623113/4585310_stbybr.png",
      title: "Test title 123",
   },
];

const Advertise = () => {
   const [programs, setPrograms] = useState<any>([]);
   const [program, setProgram] = useState<any>({});
   const [openModelDetail, setOpenModelDetail] = useState(false);
   const trans = useTrans();

   const fetchPrograms = async () => {
      try {
         const listAgenciesID = [];
         const resAgencies = await API.get(`${endpoints["get_top_agency"]}/4`);
         resAgencies.data.data.map((agency) =>
            listAgenciesID.push(agency[0].id)
         );

         const resPrograms = await API.post(
            endpoints["get_promotion_program_by_agency_list"](8),
            { listAgencyID: listAgenciesID }
         );
         setPrograms(resPrograms.data.data);
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      fetchPrograms();
   }, []);

   return (
      <>
         <div className="sm:h-[550px] h-[300px] grid grid-cols-4 sm:gap-6 gap-4 ">
            <div className="sm:col-span-3 col-span-4">
               <div className="h-full w-full">
                  {programs.length > 0 && (
                     <Swiper
                        loop={true}
                        autoplay={{
                           delay: 5000,
                           disableOnInteraction: false,
                        }}
                        spaceBetween={20}
                        modules={[Autoplay, Pagination]}
                        pagination={{ clickable: true }}
                        className="mySwiper h-full w-full rounded-lg overflow-hidden"
                     >
                        {programs.map((program) => (
                           <SwiperSlide key={program.id}>
                              <div className="relative w-full h-full overflow-hidden">
                                 <Image
                                    src={program.avatar}
                                    alt="img"
                                    layout="fill"
                                    className="object-cover"
                                    loading="lazy"
                                 />
                                 <div className="absolute -bottom-20 left-0 w-full h-full bg-gradient-to-t from-primary-color"></div>
                                 <div className="absolute bottom-4 left-6 text-left">
                                    <div className="text-primary-color py-1 px-2 w-fit italic font-semibold bg-white text-sm">
                                       <span>
                                          {new Date(
                                             program.beginUsable
                                          ).toLocaleDateString("en-GB")}
                                       </span>{" "}
                                       -{" "}
                                       <span>
                                          {new Date(
                                             program.endUsable
                                          ).toLocaleDateString("en-GB")}
                                       </span>
                                    </div>
                                    <div className="text-3xl line-clamp-1 font-bold text-white uppercase my-1">
                                       {program.programTitle}
                                    </div>
                                    <div className="text-xl line-clamp-1 font-medium text-white">
                                       {program.programName}
                                    </div>
                                 </div>
                                 <div
                                    className="absolute bottom-7 right-6 font-semibold text-primary-color text-lg bg-white rounded-lg px-4 py-2 cursor-pointer hover:shadow-lg hover:shadow-white"
                                    onClick={() => {
                                       setOpenModelDetail(true);
                                       setProgram(program);
                                    }}
                                 >
                                    {trans.home.view_detail}
                                 </div>
                              </div>
                           </SwiperSlide>
                        ))}
                     </Swiper>
                  )}

                  {programs.length == 0 && (
                     <Swiper
                        loop={true}
                        autoplay={{
                           delay: 5000,
                           disableOnInteraction: false,
                        }}
                        spaceBetween={20}
                        modules={[Autoplay]}
                        className="mySwiper h-full w-full rounded-lg overflow-hidden"
                     >
                        {imageList.length > 0 &&
                           imageList.map((image) => (
                              <SwiperSlide key={image.id}>
                                 <div className="relative w-full h-full overflow-hidden">
                                    <Image
                                       src={image.url}
                                       alt="img"
                                       layout="fill"
                                       className="object-cover"
                                       loading="lazy"
                                    />
                                 </div>
                              </SwiperSlide>
                           ))}
                     </Swiper>
                  )}
               </div>
            </div>
            <div className="sm:col-span-1 col-span-4 flex sm:flex-col sm:gap-6 gap-4">
               <div className="sm:h-1/2 h-full w-full bg-primary-color rounded-lg">
                  <div className="relative h-full w-full rounded-lg overflow-hidden">
                     <Image
                        src="https://res.cloudinary.com/ngnohieu/image/upload/v1683624331/6339694_Medium_owicrl.png"
                        alt="img"
                        layout="fill"
                        className="object-cover"
                     />
                  </div>
               </div>
               <div className="sm:h-1/2 h-full w-full bg-primary-color rounded-lg">
                  <div className="relative h-full w-full rounded-lg overflow-hidden">
                     <Image
                        src="https://res.cloudinary.com/ngnohieu/image/upload/v1683623770/7943870_ygu77g.png"
                        alt="img"
                        layout="fill"
                        className="object-cover"
                     />
                  </div>
               </div>
            </div>
         </div>
         <div
            className={`fixed top-0 right-0 w-full h-screen backdrop-blur-sm items-center justify-center z-30 ${
               openModelDetail ? "flex" : "hidden"
            }`}
         >
            <div className="w-4/5 ">
               <ProgramModelHome
                  program={program}
                  setProgram={setProgram}
                  setOpenModelDetail={setOpenModelDetail}
                  openModelDetail={openModelDetail}
               />
            </div>
         </div>
      </>
   );
};

export default Advertise;
