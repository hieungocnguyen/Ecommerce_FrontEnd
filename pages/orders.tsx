import dynamic from "next/dynamic";
import { useContext, useEffect, useState } from "react";
import { BiShowAlt } from "react-icons/bi";
import API, { endpoints } from "../API";
import Layout from "../components/Layout/Layout";
import OrderView from "../components/Model/OrderView";
import { Store } from "../utils/Store";

const Orders = () => {
   const { state, dispatch } = useContext(Store);
   const { cart, userInfo } = state;
   const [orders, setOrders] = useState([]);
   const [orderAgencyID, setOrderAgencyID] = useState(0);
   const [orderInfo, setOrderInfo] = useState({});

   useEffect(() => {
      const loadOrder = async () => {
         const resOrder = await API.get(endpoints["order_user"](userInfo.id));
         setOrders(resOrder.data.data);
      };
      loadOrder();
   }, []);

   return (
      <Layout title="Your Order">
         <div className="font-semibold text-2xl py-6">Your Orders</div>
         <div className="rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 p-5 dark:bg-dark-primary bg-light-primary items-center font-semibold">
               <div className="col-span-2">Date</div>
               <div className="col-span-3">Price</div>
               <div className="col-span-2">Payment Type</div>
               <div className="col-span-4">State</div>
               <div className="col-span-1">View Detail</div>
            </div>
            {orders.map((i) => (
               <div
                  key={i.id}
                  className="grid grid-cols-12 p-5 items-center dark:hover:bg-dark-spot hover:bg-light-spot font-medium"
               >
                  <div className="col-span-2">
                     {new Date(i.orders.createdDate).toLocaleDateString(
                        "en-US"
                     )}
                  </div>
                  <div className="col-span-3">
                     {i.totalPrice.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                     })}
                  </div>
                  <div className="col-span-2">{i.orders.paymentType.name}</div>
                  <div className="col-span-4">{i.orderState.name}</div>
                  <div className="col-span-1">
                     <button
                        className="p-3 text-2xl bg-blue-main hover:shadow-lg hover:shadow-blue-main text-white rounded-lg"
                        onClick={() => {
                           setOrderAgencyID(i.id);
                           setOrderInfo(i);
                        }}
                     >
                        <BiShowAlt />
                     </button>
                  </div>
               </div>
            ))}
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
