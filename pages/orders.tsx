/* eslint-disable react-hooks/exhaustive-deps */
import dynamic from "next/dynamic";
import { Suspense, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiArrowBack, BiMessageAltError, BiShowAlt, BiX } from "react-icons/bi";
import API, { endpoints } from "../API";
import Layout from "../components/Layout/Layout";
import OrderView from "../components/Model/OrderView";
import { Store } from "../utils/Store";
import { ClipLoader } from "react-spinners";
import stateorder1 from "../public/stateorder1.png";
import stateorder2 from "../public/stateorder2.png";
import stateorder3 from "../public/stateorder3.png";
import stateorder4 from "../public/stateorder4.png";
import stateorder5 from "../public/stateorder5.png";
import stateorder6 from "../public/stateorder6.png";
import stateorder7 from "../public/stateorder7.png";
import Image from "next/image";
import router from "next/router";
import ConfirmModel from "../components/Model/ConfirmModel";

const Orders = () => {
   const { state } = useContext(Store);
   const { userInfo } = state;
   const [orders, setOrders] = useState([]);
   const [orderAgencyID, setOrderAgencyID] = useState(0);
   const [orderInfo, setOrderInfo] = useState({});
   const [isOpenConfirmModelCancel, setIsOpenConfirmModelCancel] =
      useState(false);
   const [orderIDCancel, setOrderIDCancel] = useState(-1);
   const [isOpenConfirmModelChangeState, setIsOpenConfirmModelChangeState] =
      useState(false);

   const loadOrder = async () => {
      try {
         const resOrder = await API.get(endpoints["order_user"](userInfo.id));
         setOrders(resOrder.data.data);
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      loadOrder();
   }, []);

   const handleCancelOrder = async () => {
      try {
         const res = await API.patch(endpoints["cancel_order"](orderIDCancel));
         if (res.data.code === "200") {
            toast.success("Cancel order successful!");
         } else {
            toast.error(res.data.message);
         }
         loadOrder();
      } catch (error) {
         console.log(error);
      }
   };

   const handleChangeState = async () => {
      try {
         const res = await API.patch(
            endpoints["change_state"](orderIDCancel, 7)
         );
         if (res.data.code === "200") {
            toast.success("Successful! Please waiting for agency accept");
         } else {
            toast.error(res.data.message);
         }
         loadOrder();
      } catch (error) {
         console.log(error);
      }
   };

   return (
      <Layout title="Your Order">
         <div className="flex gap-4 items-center m-6">
            <div
               className="bg-blue-main text-white p-3 text-2xl rounded-lg cursor-pointer hover:shadow-lg hover:shadow-blue-main"
               onClick={() => router.back()}
            >
               <BiArrowBack />
            </div>
            <div className="font-semibold text-2xl">/ Your Orders</div>
         </div>

         <div className="rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-5 dark:bg-dark-primary bg-light-primary items-center font-semibold">
               <div className="col-span-1">Order code</div>
               <div className="col-span-2">Order date</div>
               <div className="col-span-2 text-right">Price + Ship fee</div>
               <div className="col-span-2">Agency</div>
               <div className="col-span-3">State</div>
               <div className="col-span-2"></div>
            </div>
            <div className="mb-8">
               <Suspense
                  fallback={
                     <div className="flex justify-center my-8">
                        <ClipLoader size={35} color="#FF8500" />
                     </div>
                  }
               >
                  {orders.map((order) => (
                     <div
                        key={order.id}
                        className={`grid grid-cols-12 gap-4 p-5 items-center dark:hover:bg-dark-spot hover:bg-light-spot font-medium `}
                     >
                        <div className="col-span-1 text-primary-color font-semibold text-center">
                           {order.orderExpressID ? (
                              `# ${order.orderExpressID}`
                           ) : (
                              <>
                                 <span
                                    className="flex justify-center cursor-pointer"
                                    onClick={() =>
                                       toast.error(
                                          "This order has an error, please wait for admin to process it"
                                       )
                                    }
                                 >
                                    <BiMessageAltError className="text-3xl text-red-600" />
                                 </span>
                              </>
                           )}
                        </div>
                        <div className="col-span-2">
                           {new Date(order.orders.createdDate).getHours()}
                           {":"}
                           {new Date(order.orders.createdDate).getMinutes()}
                           <br />
                           {new Date(
                              order.orders.createdDate
                           ).toLocaleDateString("en-GB")}
                        </div>

                        <div className="col-span-2 text-right text-blue-main font-semibold">
                           {order.totalPrice.toLocaleString("it-IT", {
                              style: "currency",
                              currency: "VND",
                           })}
                           <br />
                           <span className="text-primary-color text-sm">
                              {order.shipFee
                                 ? `+ ${order.shipFee.toLocaleString("it-IT", {
                                      style: "currency",
                                      currency: "VND",
                                   })}`
                                 : ""}
                           </span>
                        </div>
                        <div className="col-span-2">{order.agency.name}</div>

                        <div className="col-span-3">
                           <div className={`relative overflow-hidden h-12`}>
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
                                       : order.orderState.id === 7
                                       ? stateorder7
                                       : stateorder1
                                 }
                                 alt="state"
                                 layout="fill"
                                 objectFit="contain"
                                 className=""
                              />
                           </div>
                        </div>
                        <div className="col-span-2 flex gap-4 justify-center">
                           <button
                              className={`p-3 text-2xl  hover:shadow-lg text-white rounded-lg ${
                                 order.orderState.id === 5
                                    ? "bg-green-500 hover:shadow-green-500"
                                    : "bg-blue-main hover:shadow-blue-main"
                              }`}
                              title="View detail order"
                              onClick={() => {
                                 setOrderAgencyID(order.id);
                                 setOrderInfo(order);
                              }}
                           >
                              <BiShowAlt />
                           </button>
                           <button
                              className={`p-3 text-2xl bg-red-500 hover:shadow-lg hover:shadow-red-500 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none`}
                              title="Cancel order"
                              disabled={order.orderState.id > 3 ? true : false}
                              onClick={() => {
                                 setOrderIDCancel(order.id);
                                 if (order.orderState.id === 1) {
                                    setIsOpenConfirmModelCancel(true);
                                 }
                                 if (
                                    order.orderState.id === 2 ||
                                    order.orderState.id === 3
                                 ) {
                                    setIsOpenConfirmModelChangeState(true);
                                 }
                              }}
                           >
                              <BiX />
                           </button>
                        </div>
                     </div>
                  ))}
               </Suspense>
            </div>
            <div
               className={`fixed top-0 right-0 w-full h-screen backdrop-blur-sm items-center justify-center z-20 ${
                  orderAgencyID > 0 ? "flex" : "hidden"
               }`}
            >
               {orderAgencyID > 0 && (
                  <div className="w-2/3 h-fit ">
                     <OrderView
                        orderInfo={orderInfo}
                        orderAgencyID={orderAgencyID}
                        setOrderAgencyID={setOrderAgencyID}
                        setOrderInfo={setOrderInfo}
                     />
                  </div>
               )}
            </div>
            <div
               className={`fixed top-0 right-0 w-full h-screen backdrop-blur-sm items-center justify-center z-20 ${
                  isOpenConfirmModelCancel ? "flex" : "hidden"
               }`}
            >
               {isOpenConfirmModelCancel && (
                  <div className="w-1/3 h-fit">
                     <ConfirmModel
                        functionConfirm={() => {
                           handleCancelOrder();
                           setOrderIDCancel(0);
                        }}
                        content={"Your order will be canceled immediately!"}
                        isOpenConfirm={isOpenConfirmModelCancel}
                        setIsOpenConfirm={setIsOpenConfirmModelCancel}
                     />
                  </div>
               )}
            </div>
            <div
               className={`fixed top-0 right-0 w-full h-screen backdrop-blur-sm items-center justify-center z-20 ${
                  isOpenConfirmModelChangeState ? "flex" : "hidden"
               }`}
            >
               {isOpenConfirmModelChangeState && (
                  <div className="w-1/3 h-fit">
                     <ConfirmModel
                        functionConfirm={() => {
                           handleChangeState();
                           setOrderIDCancel(0);
                        }}
                        content={
                           "Your order will have to wait for the agency accept to cancel"
                        }
                        isOpenConfirm={isOpenConfirmModelChangeState}
                        setIsOpenConfirm={setIsOpenConfirmModelChangeState}
                     />
                  </div>
               )}
            </div>
         </div>
      </Layout>
   );
};

// export default Orders;
export default dynamic(() => Promise.resolve(Orders), { ssr: false });
