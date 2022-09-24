import Link from "next/link";
import React from "react";
import { Pagination } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";

const CategoryList = () => {
   const mockCate = [
      {
         id: 1,
         name: "Fashion",
      },
      {
         id: 2,
         name: "Technology",
      },
      {
         id: 3,
         name: "Book",
      },
      {
         id: 4,
         name: "Food",
      },
      {
         id: 5,
         name: "Phone",
      },
      {
         id: 6,
         name: "Laptop",
      },
      {
         id: 7,
         name: "Decorate",
      },
      {
         id: 8,
         name: "Something",
      },
   ];
   return (
      <div className="">
         <Swiper
            slidesPerView={4}
            spaceBetween={20}
            loop={true}
            className="mySwiper h-[40px]"
         >
            {mockCate.map((i) => (
               <SwiperSlide
                  key={i.id}
                  className="bg-blue-main text-white rounded-lg font-semibold text-sm hover:opacity-80 flex justify-center"
               >
                  <Link href={`/category/${i.name.toLocaleLowerCase()}`}>
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
