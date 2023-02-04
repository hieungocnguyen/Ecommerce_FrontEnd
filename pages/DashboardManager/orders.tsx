import { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { BiMoney } from "react-icons/bi";
import API, { endpoints } from "../../API";
import LayoutDashboard from "../../components/Dashboard/LayoutDashboardManager";
import { Store } from "../../utils/Store";

const Orders = () => {
   const { state, dispatch } = useContext(Store);
   const { userInfo, agencyInfo } = state;
   const [orders, setOrders] = useState([]);
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
   }, []);
   const handleUnpaid = async () => {};
   const changeStateOrder = () => {};
   return (
      <>
         <LayoutDashboard>
            <div className="w-[90%] mx-auto my-8">
               <div className="font-semibold text-2xl">Orders</div>
               <div className="mt-8">
                  <div className="grid grid-cols-4 font-semibold px-8 py-4">
                     <div>Date</div>
                     <div>Price</div>
                     <div>Custommer</div>
                     <div>State</div>
                  </div>
                  {orders.map((o) => (
                     <div
                        key={o.id}
                        className="grid grid-cols-4 items-center  dark:bg-dark-primary bg-light-primary rounded-lg p-8 mb-4"
                     >
                        <div>
                           {new Date(o.orders.createdDate).toLocaleDateString(
                              "en-US"
                           )}
                        </div>
                        <div>
                           <div className="py-2 font-semibold">
                              {o.orders.totalPrice}
                           </div>
                           <div>{o.orders.paymentType.name}</div>
                           <div>
                              {o.orders.paymentState === 0 ? (
                                 <div className="text-red-500 p-2 bg-red-200 w-fit rounded-lg my-2 font-semibold">
                                    Unpaid
                                 </div>
                              ) : (
                                 <div className="text-green-500">Paid</div>
                              )}
                           </div>
                        </div>
                        <div>
                           <div className="py-2 font-semibold">
                              {o.orders.author.lastName}{" "}
                              {o.orders.author.firstName}
                           </div>
                           <div>{o.orders.author.address}</div>
                           <div>{o.orders.author.phone}</div>
                        </div>
                        <div>{o.orderState.name}</div>
                     </div>
                  ))}
               </div>
            </div>
            <Toaster />
         </LayoutDashboard>
      </>
   );
};

export default Orders;
