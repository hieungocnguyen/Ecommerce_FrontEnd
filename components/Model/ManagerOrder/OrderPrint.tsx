import toast from "react-hot-toast";
import API, { endpoints } from "../../../API";

const OrderPrint = ({ setIDOpenOrderPrintModel, IDOpenOrderPrintModel }) => {
   const printOrder = async () => {
      if (IDOpenOrderPrintModel > -1) {
         try {
            const res = await API.get(
               endpoints["get_print_order"](IDOpenOrderPrintModel)
            );
            if (res.data.data.urlPrintOrder) {
               window.open(res.data.data.urlPrintOrder, "_blank").focus();
            }
            setIDOpenOrderPrintModel(-1);
         } catch (error) {
            toast.error(`${error.response.data.message}`, {
               position: "top-center",
            });
            setIDOpenOrderPrintModel(-1);
         }
      }
   };

   return (
      <div className="dark:bg-neutral-800 bg-light-primary rounded-lg p-8 w-full h-full shadow-lg">
         <div className="text-xl text-center mb-5 font-semibold">
            Are you sure you want to print this order?
         </div>
         <div className="flex justify-center gap-4">
            <button
               title="yes"
               className="px-5 py-3 text-lg font-semibold rounded-lg bg-blue-main text-white"
               onClick={printOrder}
            >
               Yes
            </button>
            <button
               title="cancel"
               className="px-5 py-3 text-lg font-semibold rounded-lg bg-red-600 text-white"
               onClick={() => setIDOpenOrderPrintModel(-1)}
            >
               Cancel
            </button>
         </div>
      </div>
   );
};

export default OrderPrint;
