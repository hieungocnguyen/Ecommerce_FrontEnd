import dynamic from "next/dynamic";
import { useContext, useEffect, useState } from "react";
import API, { endpoints } from "../API";
import Layout from "../components/Layout/Layout";
import { Store } from "../utils/Store";

const Orders = () => {
   const { state, dispatch } = useContext(Store);
   const { cart, userInfo } = state;
   const [orders, setOrders] = useState([]);
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
               <div className="col-span-3">Date</div>
               <div className="col-span-3">Price</div>
               <div className="col-span-2">Payment Type</div>
               <div className="col-span-4">State</div>
            </div>
            {orders.map((i) => (
               <div
                  key={i.id}
                  className="grid grid-cols-12 p-5 items-center dark:hover:bg-dark-spot hover:bg-light-spot font-medium"
               >
                  <div className="col-span-3">
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
               </div>
            ))}
         </div>
      </Layout>
   );
};

// export default Orders;
export default dynamic(() => Promise.resolve(Orders), { ssr: false });
