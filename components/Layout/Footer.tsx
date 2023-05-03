import Link from "next/link";
import React from "react";
import Logo from "../Logo";
import {
   AiFillFacebook,
   AiFillGithub,
   AiFillInstagram,
   AiFillLinkedin,
   AiOutlineTwitter,
} from "react-icons/ai";
import Image from "next/image";
import ghnLogo from "../../public/ghnlogo.png";
import momoLogo from "../../public/momologo.png";

const Footer = () => {
   return (
      <div className="bg-light-primary dark:bg-dark-primary w-[90%] mx-auto rounded-t-lg py-10 px-20 grid grid-cols-3">
         <div className="pt-5">
            <div>
               <div className="font-semibold text-2xl mb-3">About</div>
               <div className=" font-semibold">
                  <div className="mb-2">Introduction</div>
                  <div className="mb-2">Career</div>
                  <div className="mb-2">Privacy Policy</div>
                  <div className="mb-2">Terms</div>
                  <div className="mb-2">Genuine</div>
               </div>
            </div>
            <div className="font-semibold text-2xl mt-5">Linked services</div>
            <div className="flex gap-4 mt-3">
               <div className="relative overflow-hidden w-14 aspect-square">
                  <Image
                     src={ghnLogo}
                     alt=""
                     layout="fill"
                     className="object-cover"
                  />
               </div>
               <div className="relative overflow-hidden w-14 aspect-square">
                  <Image
                     src={momoLogo}
                     alt=""
                     layout="fill"
                     className="object-cover"
                  />
               </div>
            </div>
         </div>
         <div className="text-center flex flex-col justify-between">
            <div className="flex flex-col items-center gap-6">
               <div>
                  <Link href="/" title="Home">
                     <div className="cursor-pointer">
                        <Logo width="125" />
                     </div>
                  </Link>
               </div>
               <div className="text-center">
                  Lorem ipsum dolor sit amet consectetur. Praesent phasellus est
                  sapien nibh. Semper nam dignissim amet risus ac dictumst.
               </div>
            </div>
            <div className="flex flex-col gap-3">
               <div className="font-semibold text-2xl mb-3">Follow us</div>
               <div className="flex gap-3 justify-center text-4xl">
                  <AiFillGithub className="hover:text-primary-color hover:cursor-pointer" />
                  <AiFillFacebook className="hover:text-primary-color hover:cursor-pointer" />
                  <AiFillInstagram className="hover:text-primary-color hover:cursor-pointer" />
                  <AiOutlineTwitter className="hover:text-primary-color hover:cursor-pointer" />
                  <AiFillLinkedin className="hover:text-primary-color hover:cursor-pointer" />
               </div>
            </div>
         </div>
         <div className=" flex flex-col justify-between pt-5 text-right">
            <div>
               <div className="font-semibold text-2xl mb-3">Contact</div>
               <div className="">
                  <div className="mb-2">
                     <div className="font-semibold">Email</div>
                     <div className="">ou.ecommerce.manager@gmail.com</div>
                  </div>
                  <div className="mb-2">
                     <div className="font-semibold">Hotline</div>
                     <div className="">094540746</div>
                  </div>
                  <div className="mb-2">
                     <div className="font-semibold">Address</div>
                     <div className="">317 Nguyen Kiem, Go Vap</div>
                  </div>
                  <div className="mb-2">
                     <div className="font-semibold">Hours</div>
                     <div className="">Monday - Friday, 8AM- 7PM</div>
                  </div>
               </div>
            </div>
            <div className="italic text-sm">@Copyright OpenMarket</div>
         </div>
         {/* <div className="flex flex-col items-center mb-5">
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
         </div> */}
      </div>
   );
};

export default Footer;
