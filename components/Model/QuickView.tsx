/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import API, { endpoints } from "../../API";
import Image from "next/image";
import { Rating } from "@mui/material";
import Moment from "react-moment";
import useTrans from "../../hook/useTrans";
import { ClipLoader } from "react-spinners";

const QuickView = ({ postID, setIsOpenQuickViewModal }) => {
   const wrapperRef = useRef(null);
   const [post, setPost] = useState<any>({});
   const [mainPic, setMainPic] = useState("");
   const [starAvg, setStarAvg] = useState(0);
   const trans = useTrans();

   const fetchPost = async () => {
      const res = await API.get(endpoints["salePost"](postID));
      setPost(res.data.data);
      setMainPic(res.data.data.avatar);
   };
   const loadStarAvg = async () => {
      const resStar = await API.get(endpoints["star_avg_post"](postID));
      setStarAvg(resStar.data.data);
   };
   useEffect(() => {
      if (postID) {
         fetchPost();
         loadStarAvg();
      }

      function handleClickOutside(event) {
         if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setIsOpenQuickViewModal(false);
         }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [postID, setIsOpenQuickViewModal, wrapperRef]);
   return (
      <div
         className="dark:bg-neutral-800 bg-light-primary rounded-lg p-8 sm:w-full w-[700px] h-full relative border-2 border-primary-color"
         ref={wrapperRef}
      >
         {post.picturePostSet ? (
            <div className="grid grid-cols-12 gap-6">
               <div className="col-span-4">
                  <div className="overflow-hidden aspect-square relative mx-auto">
                     <Image
                        src={mainPic}
                        alt="tai nghe"
                        className="object-cover rounded-lg"
                        layout="fill"
                     />
                  </div>
                  <Swiper
                     slidesPerView={4}
                     spaceBetween={20}
                     className="mySwiper rounded-lg overflow-hidden mt-4"
                  >
                     {post.picturePostSet
                        .sort((a, b) => (a.id < b.id ? 1 : -1))
                        .map((pic) => (
                           <SwiperSlide key={pic.id}>
                              <div
                                 className="overflow-hidden aspect-square relative cursor-pointer"
                                 onClick={(e) => {
                                    setMainPic(pic.image);
                                 }}
                              >
                                 <Image
                                    src={pic.image}
                                    alt="img"
                                    className="object-cover rounded-lg"
                                    layout="fill"
                                 />
                              </div>
                           </SwiperSlide>
                        ))}
                  </Swiper>
               </div>
               <div className="col-span-8">
                  <div className="dark:bg-dark-primary bg-light-primary rounded-lg text-left">
                     <div className="font-semibold text-2xl text-left max-h-20 ">
                        {post.title}
                     </div>
                     <div className="flex items-center gap-2 my-2 text-lg">
                        <div className="rounded-lg border-2 border-primary-color p-2 text-primary-color font-semibold">
                           {post.sellStatus.name}
                        </div>
                        <div>
                           <Rating
                              size="large"
                              sx={{
                                 "& .MuiRating-iconFilled": {
                                    color: "#525EC1",
                                 },
                                 "& .MuiRating-iconEmpty": {
                                    color: "#656b99",
                                 },
                              }}
                              value={starAvg}
                              readOnly
                           />
                        </div>
                     </div>
                     <div className="text-left mb-4 mt-2">
                        <div className=" text-4xl text-primary-color font-bold">
                           {post.finalPrice.toLocaleString("it-IT", {
                              style: "currency",
                              currency: "VND",
                           })}
                        </div>
                        <div className="line-through text-xl font-semibold opacity-60">
                           {post.initialPrice.toLocaleString("it-IT", {
                              style: "currency",
                              currency: "VND",
                           })}
                        </div>
                     </div>
                     <div className="mb-4 mt-8 grid grid-cols-12">
                        <div className="col-span-6">
                           <div className="font-semibold mb-2">
                              {trans.detailProduct.brand}:{" "}
                              <span className="font-medium">{post.brand}</span>
                           </div>
                           <div className="font-semibold mb-2">
                              {trans.detailProduct.origin}:{" "}
                              <span className="font-medium">{post.origin}</span>
                           </div>
                           <div className="font-semibold">
                              {trans.detailProduct.manufacturer}:{" "}
                              <span className="font-medium">
                                 {post.manufacturer}
                              </span>
                           </div>
                        </div>
                        <div className="col-span-6">
                           <div className="font-semibold mb-2">
                              {trans.detailProduct.category}:{" "}
                              <span className="font-medium">
                                 {post.category.name}
                              </span>
                           </div>
                           <div className="font-semibold mb-2">
                              {trans.detailProduct.date_of_sale}:{" "}
                              <span className="font-medium">
                                 {new Date(post.createdDate).toLocaleDateString(
                                    "en-GB"
                                 )}
                              </span>
                           </div>
                           <div className="font-semibold">
                              {trans.detailProduct.merchant}:{" "}
                              <span className="font-medium">
                                 {post.agency.name}
                              </span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         ) : (
            <>
               <div className="flex justify-center my-8">
                  <ClipLoader size={35} color="#FF8500" />
               </div>
            </>
         )}
      </div>
   );
};

export default QuickView;
