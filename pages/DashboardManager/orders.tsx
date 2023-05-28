/* eslint-disable react-hooks/exhaustive-deps */
import dynamic from "next/dynamic";
import { useContext, useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
   BiBlock,
   BiCalendarCheck,
   BiDetail,
   BiEditAlt,
   BiErrorCircle,
   BiFilterAlt,
   BiMessageAltX,
   BiPrinter,
   BiReceipt,
   BiTrashAlt,
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
import stateorder7 from "../../public/stateorder7.png";
import emptyBox from "../../public/empty-box.png";
import Image from "next/image";
import OrderState from "../../components/Model/ManagerOrder/OrderState";
import OrderItems from "../../components/Model/ManagerOrder/OrderItems";
import OrderPrint from "../../components/Model/ManagerOrder/OrderPrint";
import CancelOrder from "../../components/Model/ManagerOrder/OrderCancel";
import OrderReview from "../../components/Model/ManagerOrder/OrderReview";
import OrderPickShift from "../../components/Model/ManagerOrder/OrderPickShift";
import OrderAcceptCancel from "../../components/Model/ManagerOrder/OrderAcceptCancel";
import PaginationComponent from "../../components/Pagination";

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
   const [orderInfoModel, setOrderInfoModel] = useState<any>({});
   const [IDOpenAcceptCancelModel, setIDOpenAcceptCancelModel] = useState(-1);
   const [IDUserRequest, setIDUserRequest] = useState(-1);

   //pagination
   const lengthOfPage = 4;
   const [pageCurrent, setPageCurrent] = useState(1);
   const [totalPage, setTotalPage] = useState(0);
   const [keywordCode, setKeywordCode] = useState("");
   const [filterState, setFilterState] = useState(0);
   const [isOpenFilter, setIsOpenFilter] = useState(false);
   const [dateOrder, setDateOrder] = useState([
      "2001-03-20",
      new Date(Date.now() + 604800 * 1000).toISOString().slice(0, 10),
   ]);
   const refKeyword = useRef(null);

   const loadOrders = async () => {
      try {
         const resOrders = await API.get(
            endpoints["order_agency"](agencyInfo.id)
         );
         setOrders(resOrders.data.data);
         setTotalPage(Math.ceil(resOrders.data.data.length / lengthOfPage));
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      loadOrders();
   }, [stateCurrentID, IDOpenOrderCancelModel, IDOpenAcceptCancelModel]);

   useEffect(() => {
      setTotalPage(Math.ceil(FilterArray(orders).length / lengthOfPage));
   }, [filterState, keywordCode, dateOrder]);

   const handleChangeStateOrder = async (order) => {
      try {
         const resOrders = await API.get(
            endpoints["order_agency"](agencyInfo.id)
         );
         setOrders(resOrders.data.data);

         if (
            resOrders.data.data.find((o) => o.id === order.id).orderState.id ==
               7 ||
            resOrders.data.data.find((o) => o.id === order.id).orderState.id ==
               6
         ) {
            toast.error(
               "The status of this order has just been changed by user, please try again!"
            );
         } else {
            setIDOpenModelChangeState(order.id);
            setStateCurrentID(order.orderState.id);
         }
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
      <>
         <LayoutDashboard title="Orders">
            <div className="w-full mx-auto my-8">
               <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-2xl">Orders Tracking</div>
                  <div
                     className="p-3 text-white bg-primary-color rounded-lg cursor-pointer hover:shadow-lg hover:shadow-primary-color hover:brightness-90 flex items-center gap-1"
                     onClick={() => setIsOpenFilter(!isOpenFilter)}
                  >
                     <BiFilterAlt className="text-2xl" />
                     <div className="font-semibold">Filter</div>
                  </div>
               </div>
               <div
                  className={`bg-primary-color overflow-hidden transition-all duration-100 rounded-lg flex justify-center gap-4 ${
                     isOpenFilter ? "h-fit p-3 mb-2" : "h-0 p-0 mb-0"
                  }`}
               >
                  <input
                     type="text"
                     placeholder="🔎Order Code"
                     id="keywordCodeFilterOrder"
                     ref={refKeyword}
                     className={`rounded-lg ${isOpenFilter ? "p-3" : "p-0"}`}
                     onChange={(e) =>
                        setKeywordCode(e.target.value.toUpperCase())
                     }
                  />
                  <div className="flex items-center bg-white rounded-lg">
                     <label
                        className="pl-3 font-medium whitespace-nowrap"
                        htmlFor="fromDate"
                     >
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
                     <label
                        className="pl-3 font-medium whitespace-nowrap"
                        htmlFor="toDate"
                     >
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
                     className={`w-52 rounded-lg ${
                        isOpenFilter ? "p-3" : "p-0"
                     }`}
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
               <div className="grid grid-cols-12 font-semibold px-4 py-4 dark:bg-dark-primary bg-light-primary my-2 rounded-lg text-center">
                  <div className="col-span-1 ">Order Code</div>
                  <div className="col-span-1 ">Items</div>
                  <div className="col-span-2 ">Date</div>
                  <div className="col-span-4 ">State</div>
                  <div className="col-span-4"></div>
               </div>
               {FilterArray(orders).length > 0 ? (
                  <>
                     <div className="">
                        {FilterArray(orders)
                           .sort((a, b) => (a.id > b.id ? -1 : 1))
                           .slice(
                              (pageCurrent - 1) * lengthOfPage,
                              (pageCurrent - 1) * lengthOfPage + lengthOfPage
                           )
                           .map((order) => (
                              <div
                                 key={order.id}
                                 className="grid grid-cols-12 gap-4 items-center  dark:bg-dark-primary bg-light-spot rounded-lg mb-4 p-6 font-medium text-center"
                              >
                                 <div className="col-span-1 font-bold text-secondary-color whitespace-nowrap">
                                    {order.orderExpressID ? (
                                       `# ${order.orderExpressID}`
                                    ) : (
                                       <span className="flex justify-center">
                                          <BiErrorCircle className="text-3xl" />
                                       </span>
                                    )}
                                 </div>
                                 <div className="col-span-1">
                                    <button
                                       className={`text-2xl p-3 bg-primary-color text-white rounded-lg hover:shadow-lg hover:shadow-primary-color disabled:bg-gray-300 disabled:shadow-none  `}
                                       onClick={() => {
                                          setIDOpenModelOrderItems(order.id);
                                       }}
                                       disabled={
                                          order.orderExpressID ? false : true
                                       }
                                       title="Show items of order"
                                    >
                                       <BiDetail />
                                    </button>
                                 </div>
                                 <div className="col-span-2">
                                    {"["}
                                    {new Date(
                                       order.orders.createdDate
                                    ).getHours()}
                                    {":"}
                                    {new Date(
                                       order.orders.createdDate
                                    ).getMinutes()}
                                    {"] | "}
                                    {new Date(
                                       order.orders.createdDate
                                    ).toLocaleDateString("en-GB")}
                                 </div>
                                 <div className="col-span-4">
                                    <div
                                       className={`relative overflow-hidden h-12 `}
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
                                 <div className="col-span-4 flex justify-center gap-4">
                                    <button
                                       className="text-2xl p-3 bg-primary-color text-white rounded-lg hover:shadow-lg hover:shadow-primary-color disabled:bg-gray-300 disabled:shadow-none "
                                       title="Review information of order"
                                       disabled={
                                          order.orderExpressID ? false : true
                                       }
                                       onClick={() => {
                                          setIDOpenOrderReviewModel(order.id);
                                          setOrderInfoModel(order);
                                       }}
                                    >
                                       <BiReceipt />
                                    </button>
                                    <button
                                       className={`text-2xl p-3  text-white rounded-lg disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none bg-primary-color hover:shadow-lg hover:shadow-primary-color
                                 `}
                                       onClick={() => {
                                          // setIDOpenModelChangeState(order.id);
                                          // setStateCurrentID(
                                          //    order.orderState.id
                                          // );
                                          handleChangeStateOrder(order);
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
                                       className={`text-2xl p-3  text-white rounded-lg
                                       disabled:bg-gray-300 bg-primary-color hover:shadow-lg hover:shadow-primary-color disabled:cursor-not-allowed disabled:shadow-none
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
                                          setIDOpenOrderPickShiftModel(
                                             order.id
                                          );
                                       }}
                                    >
                                       <BiCalendarCheck />
                                    </button>
                                    <button
                                       className={`text-2xl p-3 text-white rounded-lg 
                                       disabled:bg-gray-300 bg-primary-color hover:shadow-lg hover:shadow-primary-color disabled:cursor-not-allowed disabled:shadow-none
                                 `}
                                       onClick={() => {
                                          setIDOpenOrderPrintModel(order.id);
                                       }}
                                       disabled={
                                          order.orderState.id === 6
                                             ? true
                                             : false
                                       }
                                       title="Print order"
                                    >
                                       <BiPrinter />
                                    </button>
                                    {order.orderState.id === 7 ? (
                                       <button
                                          className={`text-2xl p-3 text-white rounded-lg disabled:cursor-not-allowed disabled:shadow-none disabled:bg-gray-300 bg-secondary-color hover:shadow-lg hover:shadow-secondary-color`}
                                          onClick={() => {
                                             setIDOpenAcceptCancelModel(
                                                order.id
                                             );
                                             setIDUserRequest(
                                                order.deliveryInfo.customer.id
                                             );
                                          }}
                                          title="Accept cancel request"
                                       >
                                          <BiMessageAltX />
                                       </button>
                                    ) : (
                                       <button
                                          className={`text-2xl p-3 text-white rounded-lg disabled:cursor-not-allowed disabled:shadow-none disabled:bg-gray-300 bg-red-500 hover:shadow-lg hover:shadow-red-500`}
                                          onClick={() => {
                                             setIDOpenOrderCancelModel(
                                                order.id
                                             );
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
                                    )}
                                 </div>
                              </div>
                           ))}
                        <div
                           className={`fixed top-0 right-0 w-full h-screen backdrop-blur-md items-center justify-center z-20 ${
                              IDOpenModalOrderItems > -1 ? "flex" : "hidden"
                           }`}
                        >
                           <div className="w-3/5 h-fit">
                              <OrderItems
                                 setIDOpenModelOrderItems={
                                    setIDOpenModelOrderItems
                                 }
                                 IDOpenModalOrderItems={IDOpenModalOrderItems}
                              />
                           </div>
                        </div>
                        <div
                           className={`fixed top-0 right-0 w-full h-screen backdrop-blur-md items-center justify-center z-20 ${
                              IDOpenModelChangeState > -1 ? "flex" : "hidden"
                           }`}
                        >
                           <div className="w-3/5  h-fit">
                              <OrderState
                                 setIDOpenModelChangeState={
                                    setIDOpenModelChangeState
                                 }
                                 IDOpenModelChangeState={IDOpenModelChangeState}
                                 stateCurrentID={stateCurrentID}
                                 setStateCurrentID={setStateCurrentID}
                              />
                           </div>
                        </div>
                        <div
                           className={`fixed top-0 right-0 w-full h-screen backdrop-blur-md items-center justify-center z-20 ${
                              IDOpenOrderReviewModel > -1 ? "flex" : "hidden"
                           }`}
                        >
                           <div className="w-1/2  h-fit">
                              <OrderReview
                                 IDOpenOrderReviewModel={IDOpenOrderReviewModel}
                                 setIDOpenOrderReviewModel={
                                    setIDOpenOrderReviewModel
                                 }
                                 orderInfo={orderInfoModel}
                              />
                           </div>
                        </div>
                        <div
                           className={`fixed top-0 right-0 w-full h-screen backdrop-blur-md items-center justify-center z-20 ${
                              IDOpenOrderPickShiftModel > -1 ? "flex" : "hidden"
                           }`}
                        >
                           <div className="w-1/2  h-fit">
                              <OrderPickShift
                                 IDOpenOrderPickShiftModel={
                                    IDOpenOrderPickShiftModel
                                 }
                                 setIDOpenOrderPickShiftModel={
                                    setIDOpenOrderPickShiftModel
                                 }
                              />
                           </div>
                        </div>
                        <div
                           className={`fixed top-0 right-0 w-full h-screen backdrop-blur-md items-center justify-center z-20 ${
                              IDOpenOrderPrintModel > -1 ? "flex" : "hidden"
                           }`}
                        >
                           <div className="w-1/2  h-fit">
                              <OrderPrint
                                 setIDOpenOrderPrintModel={
                                    setIDOpenOrderPrintModel
                                 }
                                 IDOpenOrderPrintModel={IDOpenOrderPrintModel}
                              />
                           </div>
                        </div>
                        <div
                           className={`fixed top-0 right-0 w-full h-screen backdrop-blur-md items-center justify-center z-20 ${
                              IDOpenOrderCancelModel > -1 ? "flex" : "hidden"
                           }`}
                        >
                           <div className="w-1/3 h-fit">
                              <CancelOrder
                                 setIDOpenOrderCancelModel={
                                    setIDOpenOrderCancelModel
                                 }
                                 IDOpenOrderCancelModel={IDOpenOrderCancelModel}
                              />
                           </div>
                        </div>
                        <div
                           className={`fixed top-0 right-0 w-full h-screen backdrop-blur-md items-center justify-center z-20 ${
                              IDOpenAcceptCancelModel > -1 ? "flex" : "hidden"
                           }`}
                        >
                           <div className="w-1/3 h-fit">
                              <OrderAcceptCancel
                                 IDUserRequest={IDUserRequest}
                                 setIDUserRequest={setIDUserRequest}
                                 setIDOpenAcceptCancelModel={
                                    setIDOpenAcceptCancelModel
                                 }
                                 IDOpenAcceptCancelModel={
                                    IDOpenAcceptCancelModel
                                 }
                              />
                           </div>
                        </div>
                     </div>
                  </>
               ) : (
                  <>
                     <div className="relative overflow-hidden aspect-square w-1/4 mx-auto">
                        <Image
                           src={emptyBox}
                           alt="empty"
                           layout="fill"
                           className="object-cover"
                        />
                     </div>
                  </>
               )}
               {/* paginate */}
               <PaginationComponent
                  totalPage={totalPage}
                  pageCurrent={pageCurrent}
                  setPageCurrent={setPageCurrent}
               />
            </div>
            <Toaster />
         </LayoutDashboard>
      </>
   );
};

// export default Orders;
export default dynamic(() => Promise.resolve(Orders), { ssr: false });
