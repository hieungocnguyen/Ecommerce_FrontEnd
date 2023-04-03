const ConfirmModel = ({
   functionConfirm,
   content,
   isOpenConfirm,
   setIsOpenConfirm,
}) => {
   return (
      <div className="dark:bg-neutral-800 bg-light-primary rounded-lg w-full h-full relative p-8 shadow-lg border-2 border-blue-main">
         <div className="font-semibold text-lg text-center mb-4">{content}</div>
         <div className="flex justify-center gap-8 items-center">
            <button
               onClick={functionConfirm}
               className="px-4 py-3 bg-blue-main rounded-lg hover:shadow-lg hover:shadow-blue-main text-white font-semibold"
            >
               Yes
            </button>
            <button
               onClick={() => setIsOpenConfirm(false)}
               className="px-4 py-3 bg-red-500 rounded-lg hover:shadow-lg hover:shadow-red-500 text-white font-semibold"
            >
               Cancel
            </button>
         </div>
      </div>
   );
};

export default ConfirmModel;
