import Image from "next/image";

const ItemsInPost = ({ items, setIsOpenItemsModal }) => {
   return (
      <div className="bg-neutral-800 rounded-lg p-8 w-full h-full relative">
         <div className="mb-8 font-semibold text-lg">Choose items</div>
         <div className="overflow-auto">
            {items.map((i) => (
               <div
                  key={i.id}
                  className="grid grid-cols-12 gap-4 items-center mb-4"
               >
                  <div className=" col-span-5 p-3 bg-dark-spot text-left rounded-lg flex items-center gap-4">
                     <div className="overflow-hidden relative w-12 h-12">
                        <Image
                           src={i.avatar}
                           alt="avatar"
                           layout="fill"
                           className="object-cover"
                        />
                     </div>
                     <div className="font-semibold">
                        {i.name} - {i.description}
                     </div>
                  </div>
                  <div className="col-span-2">
                     <label htmlFor="quantity"></label>
                     <input
                        type="number"
                        name="quantity"
                        id="quantity"
                        min="0"
                        max={i.inventory}
                        step="1"
                        defaultValue={0}
                        className="p-4 rounded-lg font-semibold "
                     />
                  </div>
                  <div className="col-span-2 font-semibold">{i.unitPrice}</div>
                  <div className="col-span-2 font-semibold">
                     In stock: {i.inventory}
                  </div>
               </div>
            ))}
         </div>
         <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-8 items-center">
            <div className="text-blue-main text-2xl font-semibold">XXXX</div>
            <button className="bg-blue-main p-3 text-dark-text font-semibold text-lg rounded-lg">
               Add to your cart
            </button>
         </div>
      </div>
   );
};

export default ItemsInPost;
