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
         <div>
            {orders.map((i) => (
               <div key={i.id}>
                  <div>{i.orders.totalPrice}</div>
               </div>
            ))}
         </div>
      </Layout>
   );
};

export default Orders;
