/* eslint-disable react-hooks/exhaustive-deps */
import dynamic from "next/dynamic";
import { useContext, useEffect, useState } from "react";
import API, { authAxios, endpoints } from "../../API";
import Layout from "../../components/Layout/Layout";
import { Store } from "../../utils/Store";
import Image from "next/image";
import cashpaymentimage from "../../public/cash_payment.png";
import momopaymentimage from "../../public/momo_payment.png";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../../components/Loader";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import AddressBook from "../../components/Model/AddressBook";
import AddToAddressBook from "../../components/Model/AddToAddressBook";
import Link from "next/link";
import { log } from "console";
import { BiArrowBack, BiStore } from "react-icons/bi";
import { ClipLoader } from "react-spinners";
import DeliveryService from "../../components/Model/DeliveryService";

const Payment = () => {
   const { state, dispatch } = useContext(Store);
   const { userInfo } = state;
   const router = useRouter();
   const [paymentType, setPaymentType] = useState(0);
   const [loading, setLoading] = useState(false);
   const [isOpenAddressBook, setIsOpenAddressBook] = useState(false);
   const [isOpenAddAddress, setIsOpenAddAddress] = useState(false);
   const [address, setAddress] = useState<any>({});
   const [itemsInCart, setItemsInCart] = useState<any>([]);
   const [isLoadCompleted, setIsLoadComplete] = useState(false);
   const [idOpenDeliveryServices, setIdOpenDeliveryServices] = useState(0);
   const [amountShipFee, setAmountShipFee] = useState(0);
   const [totalOrder, setTotalOrder] = useState(0);

   const fetchCartData = async () => {
      const temp = [];
      let currentAddress: any; //to get value address

      try {
         //get addressbook by userid
         const resAddressBook = await API.get(
            endpoints["get_address_book"](userInfo.id)
         );
         if (resAddressBook.data.data.length > 0) {
            setAddress(
               resAddressBook.data.data.sort((a, b) =>
                  a.id > b.id ? -1 : 1
               )[0]
            );
            currentAddress = resAddressBook.data.data.sort((a, b) =>
               a.id > b.id ? -1 : 1
            )[0];
         } else {
            setAddress({});
         }

         const resCart = await API.get(
            endpoints["get_cart_checkout"](userInfo.id)
         );

         await resCart.data.data.map(async (i) => {
            //get infor of agency by id
            const resAgencyInfo = await API.get(
               endpoints["agency_info"](i.agencyID)
            );

            //get service package by addressBookID and agencyID
            if (currentAddress) {
               const resDeliveryService = await API.get(
                  `${endpoints["get_service_package"]}?addressBookID=${currentAddress.id}&agencyID=${i.agencyID}`
               );
               temp.push({
                  ...i,
                  ...resAgencyInfo.data.data,
                  ...resDeliveryService.data.data,
                  ...{
                     selectedService:
                        resDeliveryService.data.data.services.sort((a, b) =>
                           a.shipFeeService.shipFee < b.shipFeeService.shipFee
                              ? -1
                              : 1
                        )[0],
                  },
               });
            } else {
               temp.push({
                  ...i,
                  ...resAgencyInfo.data.data,
               });
            }
            //make sure to render the items correctly
            if (temp.length === resCart.data.data.length) {
               setIsLoadComplete(true);
               CalcTotalOrder(temp);
               setItemsInCart(temp);
            }
         });
      } catch (error) {}
   };

   useEffect(() => {
      fetchCartData();
   }, [isOpenAddressBook]);

   useEffect(() => {
      CalcTotalOrder(itemsInCart);
   }, [idOpenDeliveryServices]);

   const CalcTotalOrder = (items) => {
      let tempTotalOrder = 0;

      if (items.length > 0 && items[0].selectedService) {
         items.map(
            (item) =>
               (tempTotalOrder +=
                  item.calculatorPrice +
                  item.selectedService.shipFeeService.shipFee)
         );
         setTotalOrder(tempTotalOrder);
      } else {
         setTotalOrder(-1);
      }

      console.log(tempTotalOrder);
   };
   const CalcAmountShipFee = () => {
      let amount = 0;
      itemsInCart.map(
         (item) => (amount += item.selectedService.shipFeeService.shipFee)
      );
      setAmountShipFee(amount);
   };

   const handlePayment = () => {
      CalcAmountShipFee();

      if (paymentType === 0) {
         toast.error("Please choise a payment mothod!", {
            position: "top-center",
         });
      } else if (paymentType === 1) {
         handlePaymentbyCash();
      } else {
         handlePaymentMomo();
      }
   };

   const handlePaymentbyCash = async () => {
      setLoading(true);
      try {
         const resPayment = await authAxios().post(
            endpoints["payment_cart"](1, address.id)
         );

         if (resPayment.data.code === "200") {
            Cookies.remove("cartItems");
            toast.success("Payment successful!", {
               position: "top-center",
            });
            router.push("/checkout/stateofpayment");
         } else {
            toast.error(resPayment.data.message, {
               position: "top-center",
            });
         }

         setLoading(false);
      } catch (error) {
         console.log(error);
         setLoading(false);
      }
   };

   const handlePaymentMomo = async () => {
      setLoading(true);
      try {
         const res = await authAxios().post(
            `${endpoints["momo_payment_info"]}?amountShipFee=${amountShipFee}`
         );
         if (res) {
            router.push(res.data.data.payUrl);
            setLoading(false);
            dispatch({ type: "ADD_ADDRESS_PAYMENT", payload: address.id });
         }
      } catch (error) {
         console.log(error);
         setLoading(false);
      }
   };

   return (
      <Layout title="Payment">
         <div className="flex gap-4 items-center m-6">
            <div
               className="bg-blue-main text-white p-3 text-2xl rounded-lg cursor-pointer hover:shadow-lg hover:shadow-blue-main"
               onClick={() => router.back()}
            >
               <BiArrowBack />
            </div>
            <div className="font-semibold text-2xl">/ Checkout</div>
         </div>
         <div className="grid grid-cols-12 gap-8 my-8">
            <div className="col-span-6 dark:bg-dark-primary bg-light-primary rounded-lg p-4 h-fit">
               {isLoadCompleted ? (
                  <>
                     {itemsInCart
                        .sort((a, b) => (a.id > b.id ? -1 : 1))
                        .map((i) => (
                           <div key={i.id} className="mb-4">
                              {/* agency name */}
                              <div className="bg-dark-text dark:bg-dark-bg px-5 py-3 rounded-t-xl w-fit text-left font-medium flex gap-2 items-center hover:text-primary-color transition-all cursor-pointer">
                                 <BiStore className="text-2xl" />
                                 {i.name}
                              </div>
                              <div className="bg-dark-text dark:bg-dark-bg p-2  rounded-b-xl rounded-tr-xl ">
                                 {/* items each agency */}
                                 <div>
                                    {i.cartItems
                                       .sort((a, b) => (a.id < b.id ? -1 : 1))
                                       .map((item) => (
                                          <div key={item.id}>
                                             <div className="grid grid-cols-12 items-center mx-2 my-4 font-medium text-left">
                                                <div className="col-span-2">
                                                   <div className="relative overflow-hidden rounded-lg aspect-square w-2/3">
                                                      <Image
                                                         src={
                                                            item.itemPost.avatar
                                                         }
                                                         alt="avatar"
                                                         layout="fill"
                                                      />
                                                   </div>
                                                </div>
                                                <div className="col-span-5">
                                                   {item.itemPost.name}
                                                </div>
                                                <div className="col-span-1">
                                                   x{item.quantity}
                                                </div>
                                                <div className="col-span-4 font-semibold text-right mr-6">
                                                   {(
                                                      item.quantity *
                                                      item.itemPost.unitPrice
                                                   ).toLocaleString("it-IT", {
                                                      style: "currency",
                                                      currency: "VND",
                                                   })}
                                                </div>
                                             </div>
                                             <div className="bg-light-primary dark:bg-dark-primary h-[2px] w-[90%] mx-auto"></div>
                                          </div>
                                       ))}
                                 </div>
                                 {/* service delivery */}
                                 <div className="grid grid-cols-12 gap-4 my-6 justify-center">
                                    <div className="col-span-6 bg-light-primary dark:bg-dark-primary rounded-xl p-4 relative">
                                       {/* selected delivery */}
                                       {i.services ? (
                                          <>
                                             <div
                                                className="cursor-pointer"
                                                onClick={() => {
                                                   setIdOpenDeliveryServices(
                                                      i.agencyID
                                                   );
                                                }}
                                             >
                                                <div
                                                   key={i.selectedService}
                                                   className="text-left"
                                                >
                                                   <div className="font-medium text-sm">
                                                      {
                                                         i.selectedService
                                                            .short_name
                                                      }
                                                   </div>
                                                   <div className="font-bold text-sm">
                                                      {i.selectedService.shipFeeService.shipFee.toLocaleString(
                                                         "it-IT",
                                                         {
                                                            style: "currency",
                                                            currency: "VND",
                                                         }
                                                      )}
                                                   </div>
                                                   <div className="text-sm font-medium">
                                                      Expected Delivery Time:{" "}
                                                      {/* Unix timestamp return is second, Date() using milisecond */}
                                                      <span className="font-bold">
                                                         {new Date(
                                                            i.selectedService
                                                               .expectedDeliveryTime
                                                               .leadTime * 1000
                                                         ).toLocaleDateString(
                                                            "en-GB"
                                                         )}
                                                      </span>
                                                   </div>
                                                </div>
                                             </div>
                                          </>
                                       ) : (
                                          <div className="font-semibold ">
                                             No address selected
                                          </div>
                                       )}
                                       <div
                                          className={`fixed top-0 right-0 w-full h-screen backdrop-blur-sm items-center justify-center z-20 ${
                                             idOpenDeliveryServices ===
                                             i.agencyID
                                                ? "flex"
                                                : "hidden"
                                          }`}
                                       >
                                          <div className="w-fit h-fit">
                                             <DeliveryService
                                                agencyServices={i}
                                                setIdOpenDeliveryServices={
                                                   setIdOpenDeliveryServices
                                                }
                                                address={address}
                                                setItemsInCart={setItemsInCart}
                                                itemsInCart={itemsInCart}
                                             />
                                          </div>
                                       </div>
                                    </div>
                                    {i.services ? (
                                       <>
                                          <div className="col-span-6 text-right mr-8 flex flex-col justify-center gap-1">
                                             <div className="text-primary-color font-semibold text-lg">
                                                +{" "}
                                                {i.selectedService.shipFeeService.shipFee.toLocaleString(
                                                   "it-IT",
                                                   {
                                                      style: "currency",
                                                      currency: "VND",
                                                   }
                                                )}
                                             </div>
                                             <div className="font-bold text-2xl text-blue-main">
                                                {(
                                                   i.calculatorPrice +
                                                   i.selectedService
                                                      .shipFeeService.shipFee
                                                ).toLocaleString("it-IT", {
                                                   style: "currency",
                                                   currency: "VND",
                                                })}
                                             </div>
                                          </div>
                                       </>
                                    ) : (
                                       <></>
                                    )}
                                 </div>
                              </div>
                           </div>
                        ))}
                     {totalOrder === -1 ? (
                        <div className="bg-dark-text dark:bg-dark-bg p-6 rounded-xl text-xl font-semibold">
                           No Selected address
                        </div>
                     ) : (
                        <div className="text-3xl font-bold text-blue-main bg-dark-text dark:bg-dark-bg p-6 rounded-xl">
                           {totalOrder.toLocaleString("it-IT", {
                              style: "currency",
                              currency: "VND",
                           })}
                        </div>
                     )}
                  </>
               ) : (
                  <div className="flex justify-center my-8">
                     <ClipLoader size={35} color="#FF8500" />
                  </div>
               )}
            </div>
            {/* right part */}
            <div className="col-span-6">
               <div className="dark:bg-dark-primary bg-light-primary rounded-lg p-4 mb-8">
                  <div className="text-lg font-semibold mb-4">
                     Information Delivery
                  </div>
                  {userInfo ? (
                     <>
                        {address !== undefined && address.id ? (
                           <>
                              <div className="mb-2 text-left">
                                 <label
                                    htmlFor="name"
                                    className="font-medium text-sm pl-2"
                                 >
                                    Name
                                 </label>
                                 <input
                                    id="name"
                                    type="text"
                                    required
                                    value={address.customerName}
                                    disabled
                                    className="bg-dark-text dark:bg-dark-bg w-full p-4 rounded-lg font-medium disabled:bg-slate-50"
                                 />
                              </div>
                              <div className="mb-2 text-left">
                                 <label
                                    htmlFor="address"
                                    className="font-medium text-sm pl-2"
                                 >
                                    Full Address
                                 </label>
                                 <input
                                    type="text"
                                    name="address"
                                    required
                                    value={address.fullAddress}
                                    disabled
                                    className="bg-dark-text dark:bg-dark-bg w-full p-4 rounded-lg font-medium disabled:bg-slate-50"
                                 />
                              </div>
                              <div className="mb-2 text-left">
                                 <label
                                    htmlFor="phone"
                                    className="font-medium text-sm pl-2"
                                 >
                                    Number Phone
                                 </label>
                                 <input
                                    type="number"
                                    name="phone"
                                    required
                                    value={address.deliveryPhone}
                                    disabled
                                    className="bg-dark-text dark:bg-dark-bg w-full p-4 rounded-lg font-medium disabled:bg-slate-50"
                                 />
                              </div>
                              <div className="mb-2 text-left">
                                 <label
                                    htmlFor="description"
                                    className="font-medium text-sm pl-2"
                                 >
                                    Description
                                 </label>
                                 <input
                                    type="text"
                                    name="description"
                                    required
                                    value={address.description}
                                    disabled
                                    className="bg-dark-text dark:bg-dark-bg w-full p-4 rounded-lg font-medium disabled:bg-slate-50 "
                                 />
                              </div>
                              <div className="flex justify-center my-6">
                                 <button
                                    className="py-3 px-4 rounded-lg bg-blue-main text-white font-semibold hover:shadow-lg hover:shadow-blue-main"
                                    onClick={() => setIsOpenAddressBook(true)}
                                 >
                                    Choose other address in address book
                                 </button>
                              </div>
                           </>
                        ) : (
                           <>
                              <div className="flex justify-center my-6">
                                 <button
                                    className="py-3 px-4 rounded-lg bg-blue-main text-white font-semibold hover:shadow-lg hover:shadow-blue-main"
                                    onClick={() => setIsOpenAddressBook(true)}
                                 >
                                    Please add an new address!
                                 </button>
                              </div>
                           </>
                        )}
                     </>
                  ) : (
                     <></>
                  )}
                  <div
                     className={`fixed top-0 right-0 w-full h-screen backdrop-blur-sm items-center justify-center z-20 ${
                        isOpenAddressBook ? "flex" : "hidden"
                     }`}
                  >
                     <div className="w-1/2 h-[40rem]">
                        <AddressBook
                           setIsOpenAddressBook={setIsOpenAddressBook}
                           setAddress={setAddress}
                           setIsOpenAddAddress={setIsOpenAddAddress}
                           isOpenAddAddress={isOpenAddAddress}
                        />
                     </div>
                  </div>
                  <div
                     className={`fixed top-0 right-0 w-full h-screen backdrop-blur-sm items-center justify-center z-20 ${
                        isOpenAddAddress ? "flex" : "hidden"
                     }`}
                  >
                     <div className="w-1/2 h-fit ">
                        <AddToAddressBook
                           setIsOpenAddAddress={setIsOpenAddAddress}
                        />
                     </div>
                  </div>
               </div>
               <div className=" dark:bg-dark-primary bg-light-primary rounded-lg py-8 ">
                  <div className="text-lg font-semibold">Payment Type</div>
                  <div className="flex justify-center gap-4 my-6">
                     <label className="cursor-pointer">
                        <input
                           type="radio"
                           className="peer sr-only"
                           name="pricing"
                           onChange={() => setPaymentType(1)}
                        />
                        <div className="rounded-lg p-2 ring-4 ring-transparent transition-all hover:shadow peer-checked:ring-blue-main">
                           <div className="relative overflow-hidden rounded-lg w-20 h-20">
                              <Image
                                 src={cashpaymentimage}
                                 alt=""
                                 layout="fill"
                                 className="object-cover"
                              />
                           </div>
                        </div>
                     </label>
                     <label className="cursor-pointer">
                        <input
                           type="radio"
                           className="peer sr-only"
                           name="pricing"
                           onChange={() => setPaymentType(2)}
                        />
                        <div className=" rounded-lg p-2 ring-4 ring-transparent transition-all hover:shadow peer-checked:ring-blue-main">
                           <div className="relative overflow-hidden w-20 h-20 rounded-lg">
                              <Image
                                 src={momopaymentimage}
                                 alt=""
                                 layout="fill"
                                 className="object-cover"
                              />
                           </div>
                        </div>
                     </label>
                  </div>
                  <button
                     className="py-4 px-10 h-fit bg-blue-main rounded-lg font-semibold text-white hover:shadow-blue-main hover:shadow-lg w-fit disabled:bg-gray-400 disabled:hover:shadow-gray-400 disabled:cursor-not-allowed"
                     disabled={address.id ? false : true}
                     onClick={handlePayment}
                  >
                     {address.id
                        ? paymentType === 1
                           ? " Payment by cash on delivery (COD)"
                           : paymentType === 2
                           ? " Payment by Momo"
                           : "Please choice your payment method"
                        : "Please choose address before payment!"}
                  </button>
               </div>
            </div>
         </div>

         {loading ? <Loader /> : <></>}
         <Toaster />
      </Layout>
   );
};

// export default Payment;
export default dynamic(() => Promise.resolve(Payment), { ssr: false });
