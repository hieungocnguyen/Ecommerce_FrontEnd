import dynamic from "next/dynamic";
import { Suspense, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiShowAlt } from "react-icons/bi";
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
import Image from "next/image";

const Orders = () => {
   const { state, dispatch } = useContext(Store);
   const { userInfo } = state;
   const [orders, setOrders] = useState([]);
   const [orderAgencyID, setOrderAgencyID] = useState(0);
   const [orderInfo, setOrderInfo] = useState({});

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

   return (
      <Layout title="Your Order">
         <div className="font-semibold text-2xl py-6">Your Orders</div>
         <div className="rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 p-5 dark:bg-dark-primary bg-light-primary items-center font-semibold">
               <div className="col-span-2">Date</div>
               <div className="col-span-2 text-right">Price</div>
               <div className="col-span-3">Agency</div>
               <div className="col-span-4">State</div>
               <div className="col-span-1">View Detail</div>
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
                        className="grid grid-cols-12 p-5 items-center dark:hover:bg-dark-spot hover:bg-light-spot font-medium"
                     >
                        <div className="col-span-2">
                           {new Date(order.orders.createdDate).getHours()}
                           {":"}
                           {new Date(order.orders.createdDate).getMinutes()}
                           {"  |  "}
                           {new Date(
                              order.orders.createdDate
                           ).toLocaleDateString("en-US")}
                        </div>
                        <div className="col-span-2 text-right text-blue-main font-medium">
                           {order.totalPrice.toLocaleString("it-IT", {
                              style: "currency",
                              currency: "VND",
                           })}
                        </div>
                        <div className="col-span-3">{order.agency.name}</div>
                        <div className="col-span-4">
                           <div
                              className={`relative overflow-hidden h-12 ${
                                 order.orderState.id === 6 ? "opacity-50" : ""
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
                        <div className="col-span-1">
                           <button
                              className="p-3 text-2xl bg-blue-main hover:shadow-lg hover:shadow-blue-main text-white rounded-lg"
                              onClick={() => {
                                 setOrderAgencyID(order.id);
                                 setOrderInfo(order);
                              }}
                           >
                              <BiShowAlt />
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
               <div className="w-3/5 h-fit ">
                  <OrderView
                     orderInfo={orderInfo}
                     orderAgencyID={orderAgencyID}
                     setOrderAgencyID={setOrderAgencyID}
                     setOrderInfo={setOrderInfo}
                  />
               </div>
            </div>
         </div>
      </Layout>
   );
};

// export default Orders;
export default dynamic(() => Promise.resolve(Orders), { ssr: false });
