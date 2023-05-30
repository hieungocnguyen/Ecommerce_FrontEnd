/* eslint-disable react-hooks/exhaustive-deps */
import dynamic from "next/dynamic";
import { Suspense, useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
   BiArrowBack,
   BiFilter,
   BiFilterAlt,
   BiMessageAltError,
   BiShowAlt,
   BiTrashAlt,
   BiX,
} from "react-icons/bi";
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
import emptyBox from "../public/empty-box.png";
import Image from "next/image";
import router from "next/router";
import ConfirmModel from "../components/Model/ConfirmModel";
import useTrans from "../hook/useTrans";
import PaginationComponent from "../components/Pagination";

const Orders = () => {
   const { state } = useContext(Store);
   const { userInfo } = state;
   const [orders, setOrders] = useState([]);
   const [orderAgencyID, setOrderAgencyID] = useState(0);
   const [orderInfo, setOrderInfo] = useState<any>({});
   const [isOpenConfirmModelCancel, setIsOpenConfirmModelCancel] =
      useState(false);
   const [orderIDCancel, setOrderIDCancel] = useState(-1);
   const [isOpenConfirmModelChangeState, setIsOpenConfirmModelChangeState] =
      useState(false);
   const [isOpenFilter, setIsOpenFilter] = useState(false);
   const [dateOrder, setDateOrder] = useState([
      "2017-06-01",
      new Date(Date.now() + 604800 * 1000).toISOString().slice(0, 10),
   ]);
   const trans = useTrans();
   const refKeyword = useRef(null);

   //pagination
   const lengthOfPage = 4;
   const [pageCurrent, setPageCurrent] = useState(1);
   const [totalPage, setTotalPage] = useState(0);
   //
   const [keywordCode, setKeywordCode] = useState("");
   const [filterState, setFilterState] = useState(0);

   const loadOrder = async () => {
      try {
         const resOrder = await API.get(endpoints["order_user"](userInfo.id));
         setOrders(resOrder.data.data);
         setTotalPage(Math.ceil(resOrder.data.data.length / lengthOfPage));
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      loadOrder();
   }, []);

   useEffect(() => {
      setTotalPage(Math.ceil(FilterArray(orders).length / lengthOfPage));
   }, [filterState, keywordCode, dateOrder]);

   const handleCancelButton = async (order) => {
      try {
         const resOrder = await API.get(endpoints["order_user"](userInfo.id));
         setOrders(resOrder.data.data);
         if (
            resOrder.data.data.find((o) => o.id === order.id).orderState.id !=
            order.orderState.id
         ) {
            toast.error(
               "The status of this order has just been changed by merchant, please try again!"
            );
         } else {
            setOrderIDCancel(order.id);
            if (order.orderState.id === 1) {
               setIsOpenConfirmModelCancel(true);
            }
            if (order.orderState.id === 2 || order.orderState.id === 3) {
               setIsOpenConfirmModelChangeState(true);
            }
         }
      } catch (error) {
         console.log(error);
      }
   };

   const handleCancelOrder = async () => {
      try {
         const res = await API.patch(endpoints["cancel_order"](orderIDCancel));
         if (res.data.code === "200") {
            toast.success("Cancel order successful!");
            const resNotify = await API.post(endpoints["send_notify"], {
               details: `The order #${orderInfo.orderExpressID} is canceled by the user`,
               image: "https://res.cloudinary.com/ngnohieu/image/upload/v1682708935/cancel_rtlc2h.webp",
               recipientID: `agency-${orderInfo.agency.id}`,
               title: "An order is cancelled from user",
               type: "Order Processing",
            });
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
            toast.success("Successful! Please waiting for merchant accept");
            const resNotify = await API.post(endpoints["send_notify"], {
               details: `User requested to cancel the order #${orderInfo.orderExpressID}`,
               image: "https://res.cloudinary.com/ngnohieu/image/upload/v1682708935/cancel_rtlc2h.webp",
               recipientID: `agency-${orderInfo.agency.id}`,
               title: "Have a request to cancel order from user",
               type: "Order Processing",
            });
         } else {
            toast.error(res.data.message);
         }
         loadOrder();
      } catch (error) {
         console.log(error);
      }
   };

   const FilterArray = (array) => {
      let resultArray = array
         .filter((order) => order.orderExpressID.search(keywordCode) >= 0)
         .filter((order) =>
            filterState > 0 ? order.orderState.id == filterState : true
         )
         .filter(
            (order) =>
               Date.parse(
                  new Date(order.orders.createdDate).toISOString().slice(0, 10)
               ) >= Date.parse(dateOrder[0]) &&
               Date.parse(
                  new Date(order.orders.createdDate).toISOString().slice(0, 10)
               ) <= Date.parse(dateOrder[1])
         );

      return resultArray;
   };

   const clearFilter = () => {
      setKeywordCode("");
      refKeyword.current.value = "";
      setDateOrder([
         "2017-06-01",
         new Date(Date.now() + 604800 * 1000).toISOString().slice(0, 10),
      ]);
      setFilterState(0);
      toast.success("Cleared filter");
   };

   return (
      <Layout title="Your Order">
         <div className="flex justify-between items-center my-4">
            <div className="flex gap-4 items-center">
               <div
                  className="bg-primary-color text-white p-3 text-2xl rounded-lg cursor-pointer hover:shadow-lg hover:shadow-primary-color"
                  onClick={() => router.back()}
               >
                  <BiArrowBack />
               </div>
               <div className="font-semibold text-2xl">
                  / {trans.order.title}
               </div>
            </div>
            <div
               className="p-3 text-white bg-primary-color rounded-lg cursor-pointer hover:shadow-lg hover:shadow-primary-color hover:brightness-90 flex items-center gap-1"
               onClick={() => setIsOpenFilter(!isOpenFilter)}
            >
               <BiFilterAlt className="text-2xl" />
               <div className="font-semibold">Filter</div>
            </div>
         </div>

         <div
            className={`bg-primary-color overflow-hidden transition-all duration-100 rounded-lg flex justify-center gap-6 ${
               isOpenFilter ? "h-fit p-4 mb-2" : "h-0 p-0 mb-0"
            }`}
         >
            <input
               type="text"
               placeholder="🔎Order Code"
               id="keywordCodeFilterOrder"
               ref={refKeyword}
               className={`rounded-lg ${isOpenFilter ? "p-3" : "p-0"}`}
               onChange={(e) => {
                  setKeywordCode(e.target.value.toUpperCase());
                  setPageCurrent(1);
               }}
            />
            <div className="flex items-center bg-white rounded-lg">
               <label className="pl-3 font-medium" htmlFor="fromDate">
                  From date:
               </label>
               <input
                  type="date"
                  id="fromDate"
                  className={`rounded-lg ${isOpenFilter ? "p-3" : "p-0"}`}
                  value={dateOrder[0]}
                  onChange={(e) => {
                     setDateOrder([e.target.value, dateOrder[1]]);
                  }}
               />
            </div>
            <div className="flex items-center bg-white rounded-lg">
               <label className="pl-3 font-medium" htmlFor="toDate">
                  To date:
               </label>
               <input
                  type="date"
                  id="toDate"
                  className={`rounded-lg ${isOpenFilter ? "p-3" : "p-0"}`}
                  value={dateOrder[1]}
                  onChange={(e) => {
                     setDateOrder([dateOrder[0], e.target.value]);
                  }}
               />
            </div>
            <select
               name=""
               id=""
               className={`w-52 rounded-lg ${isOpenFilter ? "p-3" : "p-0"}`}
               value={filterState}
               onChange={(e) => setFilterState(Number(e.target.value))}
            >
               <option value={0}>All order state</option>
               <option value={1}>Waiting to confirm</option>
               <option value={2}>Accepted</option>
               <option value={3}>Packed</option>
               <option value={4}>Shipped</option>
               <option value={5}>Complete</option>
               <option value={6}>Cancelled</option>
            </select>
            <div
               className="p-3 bg-secondary-color rounded-lg font-semibold text-dark-primary cursor-pointer hover:shadow-lg hover:shadow-secondary-color hover:brightness-90 flex gap-1 items-center"
               onClick={clearFilter}
            >
               <BiTrashAlt className="text-2xl" />
               Clear filter
            </div>
         </div>

         <div className="rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-5 dark:bg-dark-primary bg-light-primary items-center font-semibold">
               <div className="col-span-1">{trans.order.code}</div>
               <div className="col-span-2">{trans.order.date}</div>
               <div className="col-span-2 text-right">
                  {trans.order.price_ship}
               </div>
               <div className="col-span-2">{trans.order.merchant}</div>
               <div className="col-span-3">{trans.order.state}</div>
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
                  {FilterArray(orders).length > 0 ? (
                     FilterArray(orders)
                        .slice(
                           (pageCurrent - 1) * lengthOfPage,
                           (pageCurrent - 1) * lengthOfPage + lengthOfPage
                        )
                        .map((order) => (
                           <div
                              key={order.id}
                              className={`grid grid-cols-12 gap-4 p-5 items-center dark:hover:bg-dark-spot hover:bg-light-spot font-medium `}
                           >
                              <div className="col-span-1 text-secondary-color font-semibold text-center">
                                 {order.orderExpressID ? (
                                    `#${order.orderExpressID}`
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
                                 {"h"}
                                 {new Date(
                                    order.orders.createdDate
                                 ).getMinutes()}
                                 {"p"}
                                 <br />
                                 {new Date(
                                    order.orders.createdDate
                                 ).toLocaleDateString("en-GB")}
                              </div>

                              <div className="col-span-2 text-right text-primary-color font-semibold">
                                 {order.totalPrice.toLocaleString("it-IT", {
                                    style: "currency",
                                    currency: "VND",
                                 })}
                                 <br />
                                 <span className="text-secondary-color text-sm">
                                    {order.shipFee
                                       ? `+ ${order.shipFee.toLocaleString(
                                            "it-IT",
                                            {
                                               style: "currency",
                                               currency: "VND",
                                            }
                                         )}`
                                       : ""}
                                 </span>
                              </div>
                              <div className="col-span-2">
                                 {order.agency.name}
                              </div>

                              <div className="col-span-3">
                                 <div
                                    className={`relative overflow-hidden h-12`}
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
                                          : "bg-primary-color hover:shadow-primary-color"
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
                                    disabled={
                                       order.orderState.id > 3 ? true : false
                                    }
                                    onClick={() => {
                                       handleCancelButton(order);
                                       setOrderInfo(order);
                                    }}
                                 >
                                    <BiX />
                                 </button>
                              </div>
                           </div>
                        ))
                  ) : (
                     <div>
                        <div className="relative overflow-hidden aspect-square w-1/4 mx-auto">
                           <Image
                              src={emptyBox}
                              alt="empty"
                              layout="fill"
                              className="object-cover"
                           />
                        </div>
                     </div>
                  )}
                  {/* paginate */}
                  <PaginationComponent
                     totalPage={totalPage}
                     pageCurrent={pageCurrent}
                     setPageCurrent={setPageCurrent}
                  />
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
                        content={trans.order.cancel}
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
                        content={trans.order.confirm}
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
