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
         <div className="font-semibold text-2xl pt-4 pb-10">Your Orders</div>
         <div className="grid grid-cols-4 border-b pb-4 border-gray-200 dark:border-gray-600">
            <div>Date</div>
            <div>Price</div>
            <div>Payment Type</div>
            <div>State</div>
         </div>
         <div>
            {orders.map((i) => (
               <div
                  key={i.id}
                  className="grid grid-cols-4 py-4 border-b border-gray-200 dark:border-gray-600"
               >
                  <div>
                     {new Date(i.orders.createdDate).toLocaleDateString(
                        "en-US"
                     )}
                  </div>
                  <div>{i.orders.totalPrice}</div>
                  <div>{i.orders.paymentType.name}</div>
                  <div>{i.orderState.name}</div>
               </div>
            ))}
         </div>
      </Layout>
   );
};

export default Orders;
