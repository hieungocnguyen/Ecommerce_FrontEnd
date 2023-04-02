/* eslint-disable react-hooks/exhaustive-deps */
import dynamic from "next/dynamic";
import { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import {
   BiBlock,
   BiCalendarCheck,
   BiDetail,
   BiEditAlt,
   BiFoodMenu,
   BiMoney,
   BiPrinter,
   BiReceipt,
} from "react-icons/bi";
import API, { endpoints } from "../../API";
import LayoutDashboard from "../../components/Dashboard/LayoutDashboardManager";
import { Store } from "../../utils/Store";
import stateorder1 from "../../public/stateorder1.png";
import stateorder2 from "../../public/stateorder2.png";
import stateorder3 from "../../public/stateorder3.png";
import stateorder4 from "../../public/stateorder4.png";
import stateorder5 from "../../public/stateorder5.png";
import stateorder6 from "../../public/stateorder6.png";
import Image from "next/image";
import OrderState from "../../components/Model/ManagerOrder/OrderState";
import OrderItems from "../../components/Model/ManagerOrder/OrderItems";
import OrderPrint from "../../components/Model/ManagerOrder/OrderPrint";
import CancelOrder from "../../components/Model/ManagerOrder/OrderCancel";
import OrderReview from "../../components/Model/ManagerOrder/OrderReview";
import OrderPickShift from "../../components/Model/ManagerOrder/OrderPickShift";

const Orders = () => {
   const { state, dispatch } = useContext(Store);
   const { agencyInfo } = state;
   const [orders, setOrders] = useState([]);
   const [IDOpenModelChangeState, setIDOpenModelChangeState] = useState(-1);
   const [IDOpenModalOrderItems, setIDOpenModelOrderItems] = useState(-1);
   const [stateCurrentID, setStateCurrentID] = useState(-1);
   const [IDOpenOrderPrintModel, setIDOpenOrderPrintModel] = useState(-1);
   const [IDOpenOrderCancelModel, setIDOpenOrderCancelModel] = useState(-1);
   const [IDOpenOrderReviewModel, setIDOpenOrderReviewModel] = useState(-1);
   const [IDOpenOrderPickShiftModel, setIDOpenOrderPickShiftModel] =
      useState(-1);

   const loadOrders = async () => {
      try {
         const resOrders = await API.get(
            endpoints["order_agency"](agencyInfo.id)
         );
         setOrders(resOrders.data.data);
      } catch (error) {}
   };

   useEffect(() => {
      loadOrders();
   }, [stateCurrentID, IDOpenOrderCancelModel]);

   return (
      <>
         <LayoutDashboard title="Orders">
            <div className="w-[95%] mx-auto my-8">
               <div className="font-semibold text-2xl">Orders Tracking</div>
               <div className="mt-8">
                  <div className="grid grid-cols-12 font-semibold px-4 py-4 dark:bg-dark-primary bg-light-primary mb-4 rounded-lg text-center">
                     <div className="col-span-1 ">Items</div>
                     <div className="col-span-2 ">Date</div>
                     <div className="col-span-5 ">State</div>
                     <div className="col-span-4"></div>
                  </div>
                  {orders
                     .sort((a, b) => (a.id > b.id ? -1 : 1))
                     .map((order) => (
                        <div
                           key={order.id}
                           className="grid grid-cols-12 gap-4 items-center  dark:bg-dark-primary bg-light-spot rounded-lg mb-4 p-6 font-medium text-center"
                        >
                           <div className="col-span-1">
                              <button
                                 className="text-2xl p-3 bg-blue-main text-white rounded-lg hover:shadow-lg hover:shadow-blue-main"
                                 onClick={() => {
                                    setIDOpenModelOrderItems(order.id);
                                 }}
                                 title="Show items of order"
                              >
                                 <BiDetail />
                              </button>
                           </div>
                           <div className="col-span-2">
                              {"["}
                              {new Date(order.orders.createdDate).getHours()}
                              {":"}
                              {new Date(order.orders.createdDate).getMinutes()}
                              {"] | "}
                              {new Date(
                                 order.orders.createdDate
                              ).toLocaleDateString("en-US")}
                           </div>
                           <div className="col-span-5">
                              <div
                                 className={`relative overflow-hidden h-12 ${
                                    order.orderState.id === 6
                                       ? "opacity-50"
                                       : ""
                                 }`}
                              >
                                 <Image
                                    src={
                                       order.orderState.id === 1
                                          ? stateorder1
                                          : order.orderState.id === 2
                                          ? stateorder2
                                          : order.orderState.id === 3
                                          ? stateorder3
                                          : order.orderState.id === 4
                                          ? stateorder4
                                          : order.orderState.id === 5
                                          ? stateorder5
                                          : order.orderState.id === 6
                                          ? stateorder6
                                          : stateorder1
                                    }
                                    alt="state"
                                    layout="fill"
                                    objectFit="contain"
                                    className=""
                                 />
                              </div>
                           </div>
                           <div className="col-span-4 flex justify-center gap-4">
                              <button
                                 className={`text-2xl p-3  text-white rounded-lg disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none bg-blue-main hover:shadow-lg hover:shadow-blue-main
                                 `}
                                 onClick={() => {
                                    setIDOpenModelChangeState(order.id);
                                    setStateCurrentID(order.orderState.id);
                                 }}
                                 disabled={
                                    order.orderState.id === 6 ||
                                    order.orderState.id === 5
                                       ? true
                                       : false
                                 }
                                 title="Change state of order"
                              >
                                 <BiEditAlt />
                              </button>
                              <button
                                 className="text-2xl p-3 bg-blue-main text-white rounded-lg hover:shadow-lg hover:shadow-blue-main"
                                 title="Review information of order"
                                 onClick={() => {
                                    setIDOpenOrderReviewModel(order.id);
                                 }}
                              >
                                 <BiReceipt />
                              </button>
                              <button
                                 className={`text-2xl p-3  text-white rounded-lg
                                       disabled:bg-gray-300 bg-blue-main hover:shadow-lg hover:shadow-blue-main disabled:cursor-not-allowed disabled:shadow-none
                                 `}
                                 disabled={
                                    order.orderState.id === 6 ||
                                    order.orderState.id === 5 ||
                                    order.orderState.id === 4
                                       ? true
                                       : false
                                 }
                                 title="Pick shift delivery of order"
                                 onClick={() => {
                                    setIDOpenOrderPickShiftModel(order.id);
                                 }}
                              >
                                 <BiCalendarCheck />
                              </button>
                              <button
                                 className={`text-2xl p-3 text-white rounded-lg 
                                       disabled:bg-gray-300 bg-blue-main hover:shadow-lg hover:shadow-blue-main disabled:cursor-not-allowed disabled:shadow-none
                                 `}
                                 onClick={() => {
                                    setIDOpenOrderPrintModel(order.id);
                                 }}
                                 disabled={
                                    order.orderState.id === 6 ? true : false
                                 }
                                 title="Print order"
                              >
                                 <BiPrinter />
                              </button>
                              <button
                                 className={`text-2xl p-3 text-white rounded-lg disabled:cursor-not-allowed disabled:shadow-none disabled:bg-gray-300 bg-red-600 hover:shadow-lg hover:shadow-red-600`}
                                 onClick={() => {
                                    setIDOpenOrderCancelModel(order.id);
                                 }}
                                 disabled={
                                    order.orderState.id === 6 ||
                                    order.orderState.id === 5 ||
                                    order.orderState.id === 4
                                       ? true
                                       : false
                                 }
                                 title="Cancel order"
                              >
                                 <BiBlock />
                              </button>
                           </div>
                        </div>
                     ))}
                  <div
                     className={`fixed top-0 right-0 w-full h-screen backdrop-blur-sm items-center justify-center z-20 ${
                        IDOpenModalOrderItems > -1 ? "flex" : "hidden"
                     }`}
                  >
                     <div className="w-3/5 h-fit">
                        <OrderItems
                           setIDOpenModelOrderItems={setIDOpenModelOrderItems}
                           IDOpenModalOrderItems={IDOpenModalOrderItems}
                        />
                     </div>
                  </div>
                  <div
                     className={`fixed top-0 right-0 w-full h-screen backdrop-blur-sm items-center justify-center z-20 ${
                        IDOpenModelChangeState > -1 ? "flex" : "hidden"
                     }`}
                  >
                     <div className="w-3/5  h-fit">
                        <OrderState
                           setIDOpenModelChangeState={setIDOpenModelChangeState}
                           IDOpenModelChangeState={IDOpenModelChangeState}
                           stateCurrentID={stateCurrentID}
                           setStateCurrentID={setStateCurrentID}
                        />
                     </div>
                  </div>

                  <div
                     className={`fixed top-0 right-0 w-full h-screen backdrop-blur-sm items-center justify-center z-20 ${
                        IDOpenOrderReviewModel > -1 ? "flex" : "hidden"
                     }`}
                  >
                     <div className="w-2/5  h-fit">
                        <OrderReview
                           IDOpenOrderReviewModel={IDOpenOrderReviewModel}
                           setIDOpenOrderReviewModel={setIDOpenOrderReviewModel}
                        />
                     </div>
                  </div>

                  <div
                     className={`fixed top-0 right-0 w-full h-screen backdrop-blur-sm items-center justify-center z-20 ${
                        IDOpenOrderPickShiftModel > -1 ? "flex" : "hidden"
                     }`}
                  >
                     <div className="w-1/2  h-fit">
                        <OrderPickShift
                           IDOpenOrderPickShiftModel={IDOpenOrderPickShiftModel}
                           setIDOpenOrderPickShiftModel={
                              setIDOpenOrderPickShiftModel
                           }
                        />
                     </div>
                  </div>

                  <div
                     className={`fixed top-0 right-0 w-full h-screen backdrop-blur-sm items-center justify-center z-20 ${
                        IDOpenOrderPrintModel > -1 ? "flex" : "hidden"
                     }`}
                  >
                     <div className="w-1/2  h-fit">
                        <OrderPrint
                           setIDOpenOrderPrintModel={setIDOpenOrderPrintModel}
                           IDOpenOrderPrintModel={IDOpenOrderPrintModel}
                        />
                     </div>
                  </div>
                  <div
                     className={`fixed top-0 right-0 w-full h-screen backdrop-blur-sm items-center justify-center z-20 ${
                        IDOpenOrderCancelModel > -1 ? "flex" : "hidden"
                     }`}
                  >
                     <div className="w-1/3 h-fit">
                        <CancelOrder
                           setIDOpenOrderCancelModel={setIDOpenOrderCancelModel}
                           IDOpenOrderCancelModel={IDOpenOrderCancelModel}
                        />
                     </div>
                  </div>
               </div>
            </div>
            <Toaster />
         </LayoutDashboard>
      </>
   );
};

// export default Orders;
export default dynamic(() => Promise.resolve(Orders), { ssr: false });
