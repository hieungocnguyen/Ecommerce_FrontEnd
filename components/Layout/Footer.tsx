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
import useTrans from "../../hook/useTrans";

const Footer = () => {
   const trans = useTrans();

   return (
      <div className="bg-light-primary dark:bg-dark-primary sm:w-[90%] w-full mx-auto rounded-t-lg py-10 sm:px-20 px-10 flex flex-wrap">
         <div className="flex-1 pt-5 text-center sm:text-left order-1">
            <div>
               <div className="font-semibold text-2xl mb-3">
                  {trans.footer.about}
               </div>
               <div className=" font-semibold">
                  <div className="mb-2">{trans.footer.introduction}</div>
                  <div className="mb-2">{trans.footer.career}</div>
                  <div className="mb-2">{trans.footer.terms}</div>
               </div>
            </div>
            <div className="font-semibold text-2xl mt-5">
               {trans.footer.linked_services}
            </div>
            <div className="flex gap-4 mt-3 sm:justify-start justify-center">
               <div className="relative overflow-hidden w-14 aspect-square">
                  <Image
                     src={ghnLogo}
                     alt="img"
                     layout="fill"
                     className="object-cover"
                  />
               </div>
               <div className="relative overflow-hidden w-14 aspect-square">
                  <Image
                     src={momoLogo}
                     alt="img"
                     layout="fill"
                     className="object-cover"
                  />
               </div>
            </div>
         </div>
         <div className="flex-1 text-center flex flex-col justify-between sm:order-2 order-first">
            <div className="flex flex-col items-center gap-6">
               <div>
                  <Link href="/" title="Home">
                     <div className="cursor-pointer">
                        <Logo width="125" />
                     </div>
                  </Link>
               </div>
               <div className="text-center">{trans.footer.slogan}</div>
            </div>
            <div className="flex flex-col gap-3">
               <div className="font-semibold text-2xl mb-3">
                  {trans.footer.about}
               </div>
               <div className="flex gap-3 justify-center text-4xl">
                  <AiFillGithub className="hover:text-primary-color hover:cursor-pointer" />
                  <AiFillFacebook className="hover:text-primary-color hover:cursor-pointer" />
                  <AiFillInstagram className="hover:text-primary-color hover:cursor-pointer" />
                  <AiOutlineTwitter className="hover:text-primary-color hover:cursor-pointer" />
                  <AiFillLinkedin className="hover:text-primary-color hover:cursor-pointer" />
               </div>
            </div>
         </div>
         <div className="flex-1 flex flex-col justify-between pt-5 sm:text-right text-center order-3">
            <div>
               <div className="font-semibold text-2xl mb-3">
                  {trans.footer.contact}
               </div>
               <div className="">
                  <div className="mb-2">
                     <div className="font-semibold">Email</div>
                     <div className="">ou.ecommerce.manager@gmail.com</div>
                  </div>
                  <div className="mb-2">
                     <div className="font-semibold">{trans.footer.hotline}</div>
                     <div className="">094540746</div>
                  </div>
                  <div className="mb-2">
                     <div className="font-semibold">{trans.footer.address}</div>
                     <div className="">317 Nguyen Kiem, Go Vap</div>
                  </div>
               </div>
            </div>
            <div className="italic text-sm">@Copyright OpenMarket</div>
         </div>
      </div>
   );
};

export default Footer;
