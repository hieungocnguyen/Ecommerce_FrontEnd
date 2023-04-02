import API, { endpoints } from "../../../API";

const CancelOrder = ({ setIDOpenOrderCancelModel, IDOpenOrderCancelModel }) => {
   const CancelOrderHandle = async () => {
      try {
         const res = await API.patch(
            endpoints["cancel_order"](IDOpenOrderCancelModel)
         );
         if (res) {
            setIDOpenOrderCancelModel(-1);
         }
      } catch (error) {
         setIDOpenOrderCancelModel(-1);
      }
   };
   return (
      <div className="dark:bg-neutral-800 bg-light-primary rounded-lg p-8 w-full h-full shadow-lg">
         <div className="text-xl text-center mb-5 font-semibold">
            Are you sure you want to cancel this order?
         </div>
         <div className="flex justify-center gap-4">
            <button
               title="yes"
               className="px-5 py-3 text-lg font-semibold rounded-lg bg-blue-main text-white"
               onClick={CancelOrderHandle}
            >
               Yes
            </button>
            <button
               title="cancel"
               className="px-5 py-3 text-lg font-semibold rounded-lg bg-red-600 text-white"
               onClick={() => setIDOpenOrderCancelModel(-1)}
            >
               Cancel
            </button>
         </div>
      </div>
   );
};

export default CancelOrder;
