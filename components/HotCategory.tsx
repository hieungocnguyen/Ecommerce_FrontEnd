import Image from "next/image";
import Link from "next/link";
import useTrans from "../hook/useTrans";
import { useRouter } from "next/router";
import { AiFillFire } from "react-icons/ai";

const HotCategory = ({ categoryList }) => {
   const trans = useTrans();
   return (
      <div className="mb-4 hidden sm:block">
         <div className="flex justify-center items-center gap-1 font-bold text-2xl my-4">
            <span>
               <AiFillFire className="text-xl" />
            </span>
            {trans.home.trendingCategory}
         </div>
         <div className="grid grid-cols-5 gap-10">
            {categoryList.map((i) => (
               <div key={i.id}>
                  <CardCategory category={i} />
               </div>
            ))}
         </div>
      </div>
   );
};

export const CardCategory = ({ category }) => {
   const { locale } = useRouter();
   return (
      <Link href={`/category/${category.id}`}>
         <div className="bg-light-primary dark:bg-dark-primary rounded-lg p-4 cursor-pointer hover:shadow-lg">
            <div className="relative overflow-hidden w-3/4 mx-auto aspect-square bg-light-primary dark:bg-dark-primary rounded-xl">
               <Image
                  src={category.avatar}
                  alt="img"
                  layout="fill"
                  className="object-cover"
               />
            </div>
            <div className="text-center font-bold mt-4 uppercase h-12 text-primary-color line-clamp-2">
               {locale == "vi" ? category.nameVi : category.name}
            </div>
         </div>
      </Link>
   );
};

export default HotCategory;
