/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Scrollbar } from "swiper";

const Advertise = () => {
   return (
      <Swiper
         rewind={true}
         className="mySwiper h-[550px] rounded-lg overflow-hidden"
      >
         <SwiperSlide>
            <img
               src="https://img.freepik.com/free-vector/banner-black-friday-super-sale-realistic-3d-black-shopping-basket_548887-26.jpg?w=1380&t=st=1667118921~exp=1667119521~hmac=ca9ae8237e37466c08b3dc33d2da9904d08cc2b39b0e151f88025f93ab0409e8"
               alt="img"
               className="w-[100%] object-cover"
            />
         </SwiperSlide>
         <SwiperSlide>
            <img
               src="https://img.freepik.com/premium-vector/online-shopping-concept-shopping-cart-with-bags-standing-upon-big-mobile-phone-flat-vector-design_196604-35.jpg?w=1380"
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
