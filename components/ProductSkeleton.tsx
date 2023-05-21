const ProductSkeleton = () => {
   return (
      <div className="bg-gray-200 dark:bg-gray-800 rounded-lg p-6 cursor-pointer hover:shadow-lg">
         <div className="relative">
            <div className="w-full aspect-square relative overflow-hidden rounded-2xl hover:scale-105 transition-all bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
         </div>
         <div className="text-left font-bold text-xl uppercase mt-4 mb-2 h-14 bg-gray-300 dark:bg-gray-700 w-full animate-pulse"></div>
         <div className="text-left">
            <div className="text-2xl font-bold bg-gray-300 dark:bg-gray-700 h-8 animate-pulse"></div>
            <div className="bg-gray-300 dark:bg-gray-700 h-6 mt-2 animate-pulse"></div>
         </div>

         <div className="flex gap-4 mt-4">
            <button className="w-24 h-14 rounded-2xl flex justify-center items-center bg-gray-300 dark:bg-gray-700 animate-pulse"></button>
            <button className="w-14 h-14 rounded-2xl flex justify-center items-center text-white bg-gray-300 dark:bg-gray-700 animate-pulse"></button>
            <button className="w-14 h-14 rounded-2xl flex justify-center items-center text-white bg-gray-300 dark:bg-gray-700 animate-pulse"></button>
         </div>
      </div>
   );
};

export default ProductSkeleton;
