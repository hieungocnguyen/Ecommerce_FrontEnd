const test = () => {
   return (
      <div>
         <div>
            <input
               className="orderstate"
               id="radio_1"
               type="radio"
               name="radio"
            />
            <label
               className="flex w-fit p-4 border-2 border-gray-400 cursor-pointer"
               htmlFor="radio_1"
               onClick={(e) => console.log(e.target)}
            >
               <span className="text-xs font-semibold uppercase">Small</span>
            </label>
         </div>
      </div>
   );
};

export default test;
