import Image from "next/image";
import Link from "next/link";

const HotCategory = ({ categoryList }) => {
   console.log(categoryList);

   return (
      <div className="grid grid-cols-5 gap-10">
         {categoryList.map((i) => (
            <div key={i.id}>
               <CardCategory category={i} />
            </div>
         ))}
      </div>
   );
};

export const CardCategory = ({ category }) => {
   return (
      <Link href={`/category/${category.id}`}>
         <div className="bg-light-primary dark:bg-dark-primary rounded-lg p-4 cursor-pointer">
            <div className="relative overflow-hidden w-3/4 mx-auto aspect-square bg-light-primary dark:bg-dark-primary rounded-xl">
               <Image
                  src={category.avatar}
                  alt=""
                  layout="fill"
                  className="object-cover"
               />
            </div>
            <div className="text-center font-semibold mt-4">
               {category.name}
            </div>
         </div>
      </Link>
   );
};

export default HotCategory;
