import Link from "next/link";
import React from "react";
import { Pagination } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import axios from "axios";

const CategoryList = ({ categories }) => {
   return (
      <div className="my-5">
         <Swiper
            slidesPerView={5}
            spaceBetween={20}
            loop={true}
            className="mySwiper h-[40px]"
         >
            {categories.map((i) => (
               <SwiperSlide
                  key={i.id}
                  className="bg-blue-main text-white rounded-lg font-semibold text-sm hover:opacity-80 flex justify-center"
               >
                  <Link href={`/category/${i.id}`}>
                     <a className="flex items-center w-[100%] justify-center active:cursor-grab">
                        {i.name}
                     </a>
                  </Link>
               </SwiperSlide>
            ))}
         </Swiper>
      </div>
   );
};

export default CategoryList;
