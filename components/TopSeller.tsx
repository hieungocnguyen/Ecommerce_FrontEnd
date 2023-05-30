import Image from "next/image";
import Link from "next/link";
import { AiFillFire } from "react-icons/ai";

const TopSeller = ({ itemsHot }) => {
   return (
      <>
         <h1 className="flex justify-center items-center gap-1 font-bold text-2xl my-4 ">
            <AiFillFire className="text-xl" />
            Best selling items
         </h1>
         <div className="grid grid-cols-6 gap-4">
            {itemsHot.length > 0 &&
               itemsHot.map((item) => (
                  <Link href={`/sale_post/${item[1].id}`} key={item.id}>
                     <div className="bg-light-primary dark:bg-dark-primary rounded-lg p-3 cursor-pointer hover:shadow-lg">
                        <div className="relative overflow-hidden w-3/4 aspect-square mx-auto rounded-xl">
                           <Image
                              src={item[6]}
                              alt="item"
                              layout="fill"
                              className="object-cover"
                           />
                        </div>
                        <div className="font-semibold mt-2 line-clamp-1">
                           {item[2]}
                        </div>
                        <div className="font-semibold text-sm opacity-75 line-clamp-1">
                           {item[5]}
                        </div>
                        <div className="text-primary-color font-bold mt-1 text-lg">
                           {item[3].toLocaleString("it-IT", {
                              style: "currency",
                              currency: "VND",
                           })}
                        </div>
                        <div className="font-semibold text-sm opacity-75 line-clamp-1">
                           Sold: {item[4]}
                        </div>
                     </div>
                  </Link>
               ))}
         </div>
      </>
   );
};

export default TopSeller;
