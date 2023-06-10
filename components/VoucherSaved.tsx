import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { BiClipboard } from "react-icons/bi";
import emptyBox from "../public/empty-box.png";

const VoucherSaved = ({ openVouchers }) => {
   const [vouchers, setVouchers] = useState<any>([]);

   useEffect(() => {
      setVouchers(
         JSON.parse(sessionStorage.getItem("vouchers"))
            ? JSON.parse(sessionStorage.getItem("vouchers"))
            : []
      );
   }, [openVouchers]);

   return (
      <div className="bg-light-primary dark:bg-dark-primary w-[400px] h-[500px] rounded-lg p-3 overflow-y-auto shadow-lg  flex flex-col space-y-2">
         {vouchers.length > 0 && (
            <div>
               <div>
                  {vouchers
                     .sort((a, b) => (a.agencyID < b.agencyID ? 1 : -1))
                     .map((voucher) => (
                        <div
                           key={voucher.id}
                           className="p-2 grid grid-cols-7 items-center gap-4 hover:from-green-300  hover:bg-gradient-to-l dark:bg-dark-primary cursor-pointer rounded-lg"
                           onClick={() => {
                              navigator.clipboard.writeText(voucher.code);
                              toast.success("Copied code to clipboard");
                           }}
                        >
                           <div className="relative overflow-hidden w-12 aspect-square rounded-lg">
                              <Image
                                 src={voucher.agencyAvatar}
                                 alt="img"
                                 layout="fill"
                                 className="object-cover"
                              />
                           </div>
                           <div className="col-span-5">
                              <div className="italic font-medium text-xs ">
                                 {voucher.agencyName}
                              </div>
                              <div className="text-primary-color font-semibold text-lg uppercase line-clamp-1">
                                 {voucher.code}
                              </div>
                           </div>
                           <div className="mx-auto">
                              <BiClipboard className="text-3xl text-green-600 opacity-95" />
                           </div>
                        </div>
                     ))}
               </div>
               <div
                  className="px-3 py-2 bg-red-500 text-white text-center font-semibold mt-2 rounded-lg cursor-pointer hover:brightness-90"
                  onClick={() => {
                     sessionStorage.removeItem("vouchers");
                     toast.success("Remove code saved sucessful");
                     setVouchers([]);
                  }}
               >
                  Remove all
               </div>
            </div>
         )}
         {vouchers.length == 0 && (
            <div className="col-span-2 relative overflow-hidden w-4/5 aspect-square mx-auto my-2">
               <Image
                  src={emptyBox}
                  alt="img"
                  className="object-cover"
                  layout="fill"
               />
            </div>
         )}
      </div>
   );
};

export default VoucherSaved;
