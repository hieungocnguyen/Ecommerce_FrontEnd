/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper";
import Image from "next/image";

const imageList = [
   {
      id: 1,
      url: "https://img.freepik.com/free-vector/banner-black-friday-super-sale-realistic-3d-black-shopping-basket_548887-26.jpg?w=1380&t=st=1667118921~exp=1667119521~hmac=ca9ae8237e37466c08b3dc33d2da9904d08cc2b39b0e151f88025f93ab0409e8",
      title: "Test title 123",
   },
   {
      id: 2,
      url: "https://res.cloudinary.com/ngnohieu/image/upload/v1681111574/0Mesa_de_trabajo_1_w8fhfs.png",
      title: "Test title 123",
   },
   {
      id: 3,
      url: "https://res.cloudinary.com/ngnohieu/image/upload/v1681112909/digital-wardrobe-transparent-screen_og5gh4.jpg",
      title: "Test title 123",
   },
   {
      id: 4,
      url: "https://res.cloudinary.com/ngnohieu/image/upload/v1681114151/6034430_f2xjwx.jpg",
      title: "Test title 123",
   },
];

const Advertise = () => {
   return (
      <div className="h-[550px] grid grid-cols-4 gap-6 ">
         <div className="col-span-3">
            <div className="h-full w-full">
               <Swiper
                  loop={true}
                  autoplay={{
                     delay: 3000,
                     disableOnInteraction: false,
                  }}
                  modules={[Autoplay]}
                  className="mySwiper h-full w-full rounded-lg overflow-hidden"
               >
                  {imageList.map((image) => (
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
            </div>
         </div>
         <div className="col-span-1 flex flex-col gap-6">
            <div className="h-1/2 w-full bg-blue-main rounded-lg">
               <div className="relative h-full w-full rounded-lg overflow-hidden">
                  <Image
                     src="https://images.unsplash.com/photo-1612731486606-2614b4d74921?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1120&q=80"
                     alt=""
                     layout="fill"
                     className="object-cover"
                  />
               </div>
            </div>
            <div className="h-1/2 w-full bg-blue-main rounded-lg">
               <div className="relative h-full w-full rounded-lg overflow-hidden">
                  <Image
                     src="https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                     alt=""
                     layout="fill"
                     className="object-cover"
                  />
               </div>
            </div>
         </div>
      </div>
   );
};

export default Advertise;
