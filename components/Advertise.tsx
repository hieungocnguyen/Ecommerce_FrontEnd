/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper";
import Image from "next/image";

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
   return (
      <div className="sm:h-[550px] h-[300px] grid grid-cols-4 sm:gap-6 gap-4 ">
         <div className="sm:col-span-3 col-span-4">
            <div className="h-full w-full">
               <Swiper
                  loop={true}
                  autoplay={{
                     delay: 3000,
                     disableOnInteraction: false,
                  }}
                  spaceBetween={20}
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
         <div className="sm:col-span-1 col-span-4 flex sm:flex-col sm:gap-6 gap-4">
            <div className="sm:h-1/2 h-full w-full bg-primary-color rounded-lg">
               <div className="relative h-full w-full rounded-lg overflow-hidden">
                  <Image
                     src="https://res.cloudinary.com/ngnohieu/image/upload/v1683624331/6339694_Medium_owicrl.png"
                     alt=""
                     layout="fill"
                     className="object-cover"
                  />
               </div>
            </div>
            <div className="sm:h-1/2 h-full w-full bg-primary-color rounded-lg">
               <div className="relative h-full w-full rounded-lg overflow-hidden">
                  <Image
                     src="https://res.cloudinary.com/ngnohieu/image/upload/v1683623770/7943870_ygu77g.png"
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
