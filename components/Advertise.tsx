/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Scrollbar } from "swiper";

const Advertise = () => {
   return (
      <Swiper
         rewind={true}
         className="mySwiper h-[500px] rounded-lg overflow-hidden"
      >
         <SwiperSlide>
            <img
               src="https://images.unsplash.com/photo-1601924994987-69e26d50dc26?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
               alt="img"
               className="w-[100%] object-cover"
            />
         </SwiperSlide>
         <SwiperSlide>
            <img
               src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8c2hvcHBpbmd8ZW58MHx8MHx8&auto=format&fit=crop&w=1000&q=60"
               alt="img"
               className="w-[100%] object-cover"
            />
         </SwiperSlide>
         <SwiperSlide>
            <img
               src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
               alt="img"
               className="w-[100%] object-cover"
            />
         </SwiperSlide>
         <SwiperSlide>
            <img
               src="https://images.unsplash.com/photo-1573855619003-97b4799dcd8b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTl8fHNob3BwaW5nfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=1000&q=60"
               alt="img"
               className="w-[100%] object-cover"
            />
         </SwiperSlide>
         <SwiperSlide>
            <img
               src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fHNob3BwaW5nfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=1000&q=60"
               alt="img"
               className="w-[100%] object-cover"
            />
         </SwiperSlide>
      </Swiper>
   );
};

export default Advertise;
