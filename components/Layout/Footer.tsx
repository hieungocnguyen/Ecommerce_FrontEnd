import Link from "next/link";
import React from "react";
import Logo from "../Logo";
import { AiFillFacebook, AiFillInstagram } from "react-icons/ai";

const Footer = () => {
   return (
      <div className="bg-light-primary dark:bg-dark-primary w-[90%] mx-auto rounded-t-lg py-[20px]">
         <div className="flex flex-col items-center mb-5">
            <Link href="/" title="Home">
               <div className="cursor-pointer">
                  <Logo width="125" />
               </div>
            </Link>
            <div className="text-sm font-medium">Leading in quality</div>
         </div>
         <div className="grid grid-cols-3 mx-10">
            <div className="text-center">
               <div className="font-semibold text-sm">Customer Support:</div>
               <div className="text-sm">Hotline: 18001234</div>
               <div className="text-sm">Email: mallity@gmail.com</div>
            </div>
            <div className="text-center">
               <div className="font-semibold text-sm">Social</div>
               <div className="flex text-[28px] justify-center mt-[10px] gap-2">
                  <Link href="/">
                     <div className="cursor-pointer">
                        <AiFillFacebook />
                     </div>
                  </Link>
                  <Link href="/">
                     <div className="cursor-pointer">
                        <AiFillInstagram />
                     </div>
                  </Link>
               </div>
            </div>
            <div className="text-center">
               <div className="font-semibold text-sm">About Malltity</div>
               <div className="text-sm">Introduce</div>
               <div className="text-sm">Career</div>
            </div>
         </div>
      </div>
   );
};

export default Footer;
