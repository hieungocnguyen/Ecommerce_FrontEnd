/* eslint-disable react-hooks/exhaustive-deps */
import dynamic from "next/dynamic";
import { useContext, useEffect, useRef, useState } from "react";
import API, { authAxios, endpoints } from "../../API";
import Layout from "../../components/Layout/Layout";
import { Store } from "../../utils/Store";
import Image from "next/image";
import cashpaymentimage from "../../public/cash_payment.png";
import momopaymentimage from "../../public/momo_payment.png";
import cashDisabled from "../../public/cash_disabled.png";
import momoDisabled from "../../public/momo_disabled.png";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../../components/Loader";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import AddressBook from "../../components/Model/AddressBook";
import AddToAddressBook from "../../components/Model/AddToAddressBook";
import Link from "next/link";
import {
   BiArrowBack,
   BiChevronDown,
   BiError,
   BiErrorAlt,
   BiStore,
} from "react-icons/bi";
import { ClipLoader } from "react-spinners";
import DeliveryService from "../../components/Model/DeliveryService";
import ConfirmModel from "../../components/Model/ConfirmModel";
import useTrans from "../../hook/useTrans";

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
   const [isLoadCompleted, setIsLoadComplete] = useState(true);
   const [idOpenDeliveryServices, setIdOpenDeliveryServices] = useState(0);
   const [amountShipFee, setAmountShipFee] = useState(0);
   const [totalOrder, setTotalOrder] = useState(0);
   //0: no disable, 1:cash, 2:momo,3:both
   const [isDisablePaymentMethod, setIsDisblePaymentMethod] = useState(0);
   const [isErrorGHNThirdParty, setIsErrorGHNThirdParty] =
      useState<boolean>(false);
   const [isDisableMoMoPayment, setIsDisableMoMoPayment] = useState(false);
   const [isDisableCODPayment, setIsDisableCODPayment] = useState(false);
   const refTotalBill = useRef(null);
   const [isOpenConfirmPayment, setIsOpenConfirmPayment] = useState(false);
   const trans = useTrans();
   const [previewDiscount, setPreviewDiscount] = useState<any>([]);
   const [voucher, setVoucher] = useState("");

   const fetchCartData = async () => {
      const temp = [];
      let currentAddress: any; //to get value address
      setIsLoadComplete(false);
      try {
         //get addressbook by userid
         const resAddressBook = await API.get(
            endpoints["get_address_book"](userInfo.id)
         );

         if (resAddressBook.data.data.length > 0) {
            if (address.id) {
               currentAddress = address;
            } else {
               setAddress(
                  resAddressBook.data.data.sort((a, b) =>
                     a.id > b.id ? -1 : 1
                  )[0]
               );
               currentAddress = resAddressBook.data.data.sort((a, b) =>
                  a.id > b.id ? -1 : 1
               )[0];
            }
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
               const resDeliveryService = await authAxios().get(
                  `${endpoints["get_service_package"]}?addressBookID=${currentAddress.id}&agencyID=${i.agencyID}`
               );

               //check null services
               let deliveryServiceResult;
               let notNullServices = false;
               resDeliveryService.data.data.services.map((service) => {
                  if (service.serviceInfoWithPrePayment.shipFee != null) {
                     notNullServices = true;
                  }
               });
               if (notNullServices) {
                  deliveryServiceResult = resDeliveryService.data.data.services
                     .filter(
                        (service) =>
                           service.serviceInfoWithPrePayment.shipFee != null
                     )
                     .sort((a, b) =>
                        a.serviceInfoWithPrePayment.shipFee <
                        b.serviceInfoWithPrePayment.shipFee
                           ? -1
                           : 1
                     )[0];
               } else {
                  deliveryServiceResult = resDeliveryService.data.data.services;
               }

               temp.push({
                  ...i,
                  ...resAgencyInfo.data.data,
                  ...resDeliveryService.data.data,
                  ...{
                     selectedService: deliveryServiceResult,
                  },
               });

               //cases no selected address
            } else {
               temp.push({
                  ...i,
                  ...resAgencyInfo.data.data,
               });
            }
            //make sure to render the items correctly
            if (temp.length === resCart.data.data.length) {
               setIsLoadComplete(true);
               setItemsInCart(temp);
               console.log(temp);

               if (currentAddress) {
                  CheckDisablePaymentType(temp);
                  CalcTotalOrder(temp);
                  CalcAmountShipFee(temp);
               }
            }
         });
      } catch (error) {
         console.log(error);
         setIsLoadComplete(true);
         setIsDisblePaymentMethod(3);
         toast.error(error.response.data.message, {
            position: "top-center",
         });
      }
   };

   useEffect(() => {
      if (isOpenAddressBook == false) {
         fetchCartData();
      }
   }, [isOpenAddressBook]);

   useEffect(() => {
      CalcTotalOrder(itemsInCart);
      CalcAmountShipFee(itemsInCart);
   }, [idOpenDeliveryServices, paymentType]);

   const CheckDisablePaymentType = (items) => {
      let tempDisablePaymentType = 0;
      let errorGHN = true;

      items.map((item) => {
         if (item.selectedService.serviceInfoWithCOD.isSuccess === 0) {
            //if 3=>3 if 1=>1
            if (tempDisablePaymentType === 2) {
               tempDisablePaymentType = 3;
            } else if (tempDisablePaymentType === 0) {
               tempDisablePaymentType = 1;
            }
         } else {
            errorGHN = false;
         }

         if (item.selectedService.serviceInfoWithPrePayment.isSuccess === 0) {
            //if 3=>3 if 2=>2
            if (tempDisablePaymentType === 1) {
               tempDisablePaymentType = 3;
            } else if (tempDisablePaymentType === 0) {
               tempDisablePaymentType = 2;
            }
         } else {
            errorGHN = false;
         }
      });
      setIsDisblePaymentMethod(tempDisablePaymentType);
      if (errorGHN === true) {
         setIsErrorGHNThirdParty(true);
      }
   };

   const CalcTotalOrder = (items) => {
      let tempTotalOrder = 0;
      let shipfeeMoMoPayment = 0;

      items.map((item) => {
         shipfeeMoMoPayment +=
            item.selectedService.serviceInfoWithPrePayment.shipFee;
         if (item.calculatorPrice > 50000000) {
            setIsDisableCODPayment(true);
         }
      });

      if (items.length > 0 && items[0].selectedService) {
         if (paymentType == 1) {
            items.map((item) => {
               tempTotalOrder +=
                  item.calculatorPrice +
                  item.selectedService.serviceInfoWithCOD.shipFee;
            });
         } else {
            items.map(
               (item) =>
                  (tempTotalOrder +=
                     item.calculatorPrice +
                     item.selectedService.serviceInfoWithPrePayment.shipFee)
            );
         }
         previewDiscount.map((p) => (tempTotalOrder -= p.discount));
         setTotalOrder(tempTotalOrder);
      } else {
         setTotalOrder(-1);
      }
      setIsDisableMoMoPayment(
         tempTotalOrder + shipfeeMoMoPayment > 50000000 ? true : false
      );
   };

   const CalcAmountShipFee = (items) => {
      let amount = 0;
      items.map((item) => {
         if (paymentType === 1) {
            amount += item.selectedService.serviceInfoWithCOD.shipFee;
         } else {
            amount += item.selectedService.serviceInfoWithPrePayment.shipFee;
         }
      });

      setAmountShipFee(amount);
   };

   const handlePayment = () => {
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
      let mapServiceInfo = {};
      setLoading(true);
      try {
         await itemsInCart.map((item) => {
            mapServiceInfo[item.id] = {
               serviceID: item.selectedService.service_id,
               serviceTypeID: item.selectedService.service_type_id,
               voucher:
                  previewDiscount.find((p) => p.id == item.agencyID) !=
                  undefined
                     ? previewDiscount.find((p) => p.id == item.agencyID)
                          .voucher
                     : null,
            };
         });

         console.log(mapServiceInfo);

         const resPayment = await authAxios().post(
            endpoints["payment_cart"](1, address.id),
            mapServiceInfo
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
         toast.error("Something wrong, please try again!");
      }
   };

   const handlePaymentMomo = async () => {
      const arrayInforPayment = [];
      itemsInCart.map((item) =>
         arrayInforPayment.push({
            agencyID: item.agencyID,
            serviceID: item.selectedService.service_id,
            serviceTypeID: item.selectedService.service_type_id,
         })
      );

      setLoading(true);
      try {
         const res = await authAxios().post(
            `${endpoints["momo_payment_info"]}?amountShipFee=${amountShipFee}`
         );

         if (res.data.data.payUrl) {
            setLoading(false);
            dispatch({ type: "ADD_ADDRESS_PAYMENT", payload: address.id });
            dispatch({
               type: "ADD_INFO_PAYMENT",
               payload: arrayInforPayment,
            });
            router.push(res.data.data.payUrl);
         } else {
            toast.error(res.data.data.message);
         }
         setLoading(false);
      } catch (error) {
         console.log(error);
         setLoading(false);
         toast.error("Something wrong, please try again!");
      }
   };

   const handlePreviewVoucher = async () => {
      try {
         const res = await API.get(
            endpoints["preview_discount_voucher"](userInfo.id, voucher)
         );
         if (res.data.code == "200") {
            const existItem = previewDiscount.find(
               (item) => item.id === res.data.data.agencyID
            );

            const updateDiscount = existItem
               ? previewDiscount.map((p) =>
                    p.id === existItem.id
                       ? {
                            ...p,
                            discount: res.data.data.discount,
                            voucher: voucher,
                         }
                       : p
                 )
               : [
                    ...previewDiscount,
                    {
                       id: res.data.data.agencyID,
                       discount: res.data.data.discount,
                       voucher: voucher,
                    },
                 ];
            console.log(updateDiscount);
            setPreviewDiscount(updateDiscount);
         } else {
            toast.error(res.data.message);
         }
      } catch (error) {
         console.log(error);
      }
   };
   return (
      <Layout title="Payment">
         <div className="flex gap-4 items-center m-6">
            <div
               className="bg-primary-color text-white p-3 text-2xl rounded-lg cursor-pointer hover:shadow-lg hover:shadow-primary-color"
               onClick={() => router.back()}
            >
               <BiArrowBack />
            </div>
            <div className="font-semibold text-2xl">
               / {trans.checkout.title}
            </div>
         </div>
         <div className="grid grid-cols-12 gap-8 my-8">
            <div className="col-span-6 dark:bg-dark-primary bg-light-primary rounded-lg p-4 h-fit">
               {isLoadCompleted ? (
                  <>
                     {itemsInCart
                        .sort((a, b) => (a.id > b.id ? -1 : 1))
                        .map((i) => (
                           <div key={i.id} className="mb-6">
                              {/* agency name */}
                              <div className="bg-dark-text dark:bg-dark-bg px-5 py-3 rounded-t-xl w-fit text-left font-medium flex gap-2 items-center hover:text-secondary-color transition-all cursor-pointer">
                                 <BiStore className="text-2xl" />
                                 {i.name}
                              </div>
                              <div className="bg-dark-text dark:bg-dark-bg p-2  rounded-b-xl rounded-tr-xl  shadow-lg">
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
                                                         className="object-cover"
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
                                 {isErrorGHNThirdParty ? (
                                    <>
                                       <div className="py-8 m-6 bg-red-600 bg-opacity-20 border-2 rounded-xl border-red-600 font-semibold">
                                          {trans.checkout.sth_wrong}
                                       </div>
                                    </>
                                 ) : (
                                    <>
                                       <div className="grid grid-cols-12 gap-4 my-4 justify-center">
                                          {/* selected delivery */}
                                          {i.services ? (
                                             <div
                                                className="col-span-12 bg-light-primary dark:bg-dark-primary rounded-xl p-4 mx-4 relative flex justify-between items-center cursor-pointer hover:shadow-lg"
                                                onClick={() => {
                                                   setIdOpenDeliveryServices(
                                                      i.agencyID
                                                   );
                                                }}
                                             >
                                                <div>
                                                   <div
                                                      key={i.selectedService}
                                                      className="text-left"
                                                   >
                                                      <div className="font-medium text-sm mb-1">
                                                         <span className="font-semibold">
                                                            {
                                                               trans.checkout
                                                                  .delivery
                                                            }
                                                            :
                                                         </span>{" "}
                                                         {
                                                            i.selectedService
                                                               .short_name
                                                         }
                                                      </div>
                                                      <div className="font-bold text-sm mb-1 ">
                                                         <span className="font-semibold">
                                                            {
                                                               trans.checkout
                                                                  .ship_fee
                                                            }
                                                            :{" "}
                                                         </span>
                                                         <span className="">
                                                            {i.selectedService
                                                               .serviceInfoWithCOD &&
                                                            i.selectedService
                                                               .serviceInfoWithCOD
                                                               .isSuccess === 1
                                                               ? `
                                                         ${i.selectedService.serviceInfoWithCOD.shipFee.toLocaleString(
                                                            "it-IT",
                                                            {
                                                               style: "currency",
                                                               currency: "VND",
                                                            }
                                                         )} [COD]`
                                                               : ""}
                                                            {i.selectedService
                                                               .serviceInfoWithCOD &&
                                                            i.selectedService
                                                               .serviceInfoWithCOD
                                                               .isSuccess ===
                                                               1 &&
                                                            i.selectedService
                                                               .serviceInfoWithPrePayment
                                                               .isSuccess === 1
                                                               ? " | "
                                                               : ""}
                                                            {i.selectedService
                                                               .serviceInfoWithCOD &&
                                                            i.selectedService
                                                               .serviceInfoWithPrePayment
                                                               .isSuccess === 1
                                                               ? `${i.selectedService.serviceInfoWithPrePayment.shipFee.toLocaleString(
                                                                    "it-IT",
                                                                    {
                                                                       style: "currency",
                                                                       currency:
                                                                          "VND",
                                                                    }
                                                                 )} [MOMO]`
                                                               : ""}
                                                         </span>
                                                      </div>
                                                      <div className="text-sm font-medium">
                                                         {
                                                            trans.checkout
                                                               .expect_time
                                                         }
                                                         :{" "}
                                                         <span className="font-bold">
                                                            {i.selectedService
                                                               .serviceInfoWithCOD &&
                                                            i.selectedService
                                                               .serviceInfoWithPrePayment
                                                               .isSuccess === 1
                                                               ? new Date(
                                                                    i.selectedService.serviceInfoWithPrePayment.expectedTimeDelivery
                                                                 ).toLocaleDateString(
                                                                    "en-GB"
                                                                 )
                                                               : ""}
                                                         </span>
                                                      </div>
                                                   </div>
                                                </div>
                                                <div className="text-4xl">
                                                   <BiChevronDown />
                                                </div>
                                             </div>
                                          ) : (
                                             <div className="col-span-12 bg-light-primary py-4 rounded-lg dark:bg-dark-primary font-semibold ">
                                                {
                                                   trans.checkout
                                                      .no_address_selected
                                                }
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
                                                   setItemsInCart={
                                                      setItemsInCart
                                                   }
                                                   itemsInCart={itemsInCart}
                                                />
                                             </div>
                                          </div>
                                       </div>
                                    </>
                                 )}
                                 {/* subtotal */}
                                 {i.services ? (
                                    <div className="mx-8 mb-4">
                                       <div className="flex justify-between items-center">
                                          <div className="font-medium">
                                             {trans.checkout.ship_fee}:{" "}
                                          </div>
                                          <div className="text-right text-secondary-color font-semibold text-lg">
                                             {paymentType === 1 &&
                                             i.selectedService
                                                .serviceInfoWithCOD
                                                .isSuccess === 1 ? (
                                                <span>
                                                   {i.selectedService.serviceInfoWithCOD.shipFee.toLocaleString(
                                                      "it-IT",
                                                      {
                                                         style: "currency",
                                                         currency: "VND",
                                                      }
                                                   )}
                                                   <span className="text-sm">
                                                      {" [COD]"}
                                                   </span>
                                                </span>
                                             ) : paymentType === 2 &&
                                               i.selectedService
                                                  .serviceInfoWithPrePayment
                                                  .isSuccess === 1 ? (
                                                <span>
                                                   {i.selectedService.serviceInfoWithPrePayment.shipFee.toLocaleString(
                                                      "it-IT",
                                                      {
                                                         style: "currency",
                                                         currency: "VND",
                                                      }
                                                   )}
                                                   <span className="text-sm">
                                                      {" [MOMO]"}
                                                   </span>
                                                </span>
                                             ) : (
                                                <>
                                                   <span>
                                                      {i.selectedService
                                                         .serviceInfoWithCOD &&
                                                      i.selectedService
                                                         .serviceInfoWithCOD
                                                         .isSuccess === 1 ? (
                                                         <span>
                                                            {i.selectedService.serviceInfoWithCOD.shipFee.toLocaleString(
                                                               "it-IT",
                                                               {
                                                                  style: "currency",
                                                                  currency:
                                                                     "VND",
                                                               }
                                                            )}{" "}
                                                            <span className="text-sm">
                                                               {" "}
                                                               [COD]
                                                            </span>
                                                         </span>
                                                      ) : (
                                                         <span> </span>
                                                      )}
                                                   </span>
                                                   <span>
                                                      {i.selectedService
                                                         .serviceInfoWithCOD &&
                                                      i.selectedService
                                                         .serviceInfoWithCOD
                                                         .isSuccess === 1 &&
                                                      i.selectedService
                                                         .serviceInfoWithPrePayment
                                                         .isSuccess === 1 ? (
                                                         <span>{"  |  "}</span>
                                                      ) : (
                                                         <span></span>
                                                      )}
                                                   </span>
                                                   <span>
                                                      {i.selectedService
                                                         .serviceInfoWithPrePayment &&
                                                      i.selectedService
                                                         .serviceInfoWithPrePayment
                                                         .isSuccess === 1 ? (
                                                         <span>
                                                            {i.selectedService.serviceInfoWithPrePayment.shipFee.toLocaleString(
                                                               "it-IT",
                                                               {
                                                                  style: "currency",
                                                                  currency:
                                                                     "VND",
                                                               }
                                                            )}{" "}
                                                            <span className="text-sm">
                                                               {" "}
                                                               [MOMO]
                                                            </span>
                                                         </span>
                                                      ) : (
                                                         <span> </span>
                                                      )}
                                                   </span>
                                                </>
                                             )}
                                          </div>
                                       </div>
                                       <div className="flex justify-between items-center">
                                          <div className="font-medium">
                                             {
                                                trans.checkout
                                                   .sub_total_wthout_ship
                                             }
                                             :
                                          </div>
                                          <div className="font-bold text-2xl text-primary-color">
                                             {i.calculatorPrice.toLocaleString(
                                                "it-IT",
                                                {
                                                   style: "currency",
                                                   currency: "VND",
                                                }
                                             )}
                                          </div>
                                       </div>
                                       {previewDiscount.find(
                                          (p) => p.id == i.agencyID
                                       ) != undefined && (
                                          <div className="flex justify-between items-center">
                                             <div className="font-medium">
                                                Discount by voucher:
                                             </div>
                                             <div className="text-right text-green-500 font-semibold text-lg">
                                                -
                                                {previewDiscount
                                                   .find(
                                                      (p) => p.id == i.agencyID
                                                   )
                                                   .discount.toLocaleString(
                                                      "it-IT",
                                                      {
                                                         style: "currency",
                                                         currency: "VND",
                                                      }
                                                   )}
                                             </div>
                                          </div>
                                       )}
                                    </div>
                                 ) : (
                                    <></>
                                 )}
                              </div>
                           </div>
                        ))}
                     <div className="bg-dark-text dark:bg-dark-bg p-6 rounded-xl border-2 mb-6 shadow-lg">
                        <div className="flex items-center justify-between">
                           <div className="font-semibold text-lg">Voucher:</div>
                           <div className="flex items-center justify-center gap-2">
                              <input
                                 type="text"
                                 name=""
                                 id=""
                                 className="bg-light-primary p-3 rounded-lg font-semibold"
                                 value={voucher}
                                 onKeyDown={(e) => {
                                    !/^[a-zA-Z0-9._\b]+$/.test(e.key) &&
                                       e.preventDefault();
                                 }}
                                 onChange={(e) =>
                                    setVoucher(e.target.value.toUpperCase())
                                 }
                              />
                              <button
                                 className="p-3 rounded-lg bg-primary-color text-white font-semibold"
                                 onClick={handlePreviewVoucher}
                              >
                                 Apply
                              </button>
                           </div>
                        </div>
                        {previewDiscount.length > 0 && (
                           <div className="flex items-center justify-between mt-2">
                              <div className="font-semibold">
                                 Voucher(s) applied:
                              </div>
                              <div className="text-green-500 font-semibold text-sm">
                                 {previewDiscount.map((p) => p.voucher)}
                              </div>
                           </div>
                        )}
                     </div>
                     {/* total bill */}
                     <div ref={refTotalBill}>
                        {!address.id ? (
                           <div className="bg-dark-text dark:bg-dark-bg p-6 rounded-xl text-xl font-semibold border-2 border-secondary-color shadow-lg">
                              {trans.checkout.please_add_an_address}
                           </div>
                        ) : paymentType === 1 ? (
                           <div className="p-6 bg-dark-text dark:bg-dark-bg rounded-xl border-2 border-secondary-color shadow-lg">
                              <div className="font-semibold mb-2">
                                 {trans.checkout.total_COD}
                              </div>
                              <div className="text-4xl font-bold text-primary-color">
                                 {totalOrder.toLocaleString("it-IT", {
                                    style: "currency",
                                    currency: "VND",
                                 })}
                              </div>
                           </div>
                        ) : paymentType === 2 ? (
                           <div className="p-6 bg-dark-text dark:bg-dark-bg rounded-xl border-2 border-secondary-color shadow-lg">
                              <div className="font-semibold mb-2">
                                 {trans.checkout.total_MoMo}
                              </div>
                              <div className="text-4xl font-bold text-primary-color">
                                 {totalOrder.toLocaleString("it-IT", {
                                    style: "currency",
                                    currency: "VND",
                                 })}
                              </div>
                           </div>
                        ) : (
                           <div className="bg-dark-text dark:bg-dark-bg p-6 rounded-xl text-lg font-semibold border-2 border-secondary-color shadow-lg">
                              {trans.checkout.display_total_bill}
                           </div>
                        )}
                     </div>
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
                     {trans.checkout.information_delivery}
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
                                    {trans.checkout.recripient_name}
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
                                    {trans.checkout.full_address}
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
                                    htmlFor="typeAddress"
                                    className="font-medium text-sm pl-2"
                                 >
                                    Type:
                                 </label>
                                 <input
                                    type="text"
                                    name="typeAddress"
                                    required
                                    value={address.addressType}
                                    disabled
                                    className="bg-dark-text dark:bg-dark-bg w-full p-4 rounded-lg font-medium disabled:bg-slate-50"
                                 />
                              </div>
                              <div className="mb-2 text-left">
                                 <label
                                    htmlFor="phone"
                                    className="font-medium text-sm pl-2"
                                 >
                                    {trans.checkout.phone_number}
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
                                    {trans.checkout.note}
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
                                    className="py-3 px-4 rounded-lg bg-primary-color text-white font-semibold hover:shadow-lg hover:shadow-primary-color"
                                    onClick={() => setIsOpenAddressBook(true)}
                                 >
                                    {trans.checkout.choose_another_address}
                                 </button>
                              </div>
                           </>
                        ) : (
                           <>
                              <div className="flex justify-center my-6">
                                 <button
                                    className="py-3 px-4 rounded-lg bg-primary-color text-white font-semibold hover:shadow-lg hover:shadow-primary-color"
                                    onClick={() => setIsOpenAddressBook(true)}
                                 >
                                    {trans.checkout.add_new_address}
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
               {/* Payment type? */}
               <div className=" dark:bg-dark-primary bg-light-primary rounded-lg py-6 px-8">
                  <div className="text-lg font-semibold mb-4">
                     {trans.checkout.payment_type}
                  </div>
                  {isDisableCODPayment ? (
                     <div className="bg-yellow-400 bg-opacity-30 border-2 border-yellow-500 rounded-lg px-3 py-4 font-semibold text-yellow-700 dark:text-yellow-200 flex justify-start gap-4 items-center mb-2">
                        <div>
                           <BiError className="text-2xl" />
                        </div>
                        <div className="text-sm">
                           {trans.checkout.over_50m_COD}
                        </div>
                     </div>
                  ) : (
                     <></>
                  )}
                  {isDisableMoMoPayment ? (
                     <div className="bg-yellow-400 bg-opacity-30 border-2 border-yellow-500 rounded-lg px-3 py-4 font-semibold text-yellow-700 dark:text-yellow-200 flex justify-start gap-4 items-center mb-2">
                        <div>
                           <BiError className="text-2xl" />
                        </div>
                        <div className="text-sm">
                           {trans.checkout.over_50m_MOMO}
                        </div>
                     </div>
                  ) : (
                     <></>
                  )}
                  {isDisableCODPayment && isDisableMoMoPayment ? (
                     <div className="bg-red-400 bg-opacity-30 border-2 border-red-500 rounded-lg px-3 py-4 font-semibold text-red-700 dark:text-red-200 flex justify-start gap-4 items-center ">
                        <div>
                           <BiErrorAlt className="text-2xl" />
                        </div>
                        <div className="text-sm">
                           {trans.checkout.cant_checkout}
                        </div>
                     </div>
                  ) : (
                     <></>
                  )}
                  <div className="flex justify-center gap-4 my-6">
                     <label
                        className={`${
                           isDisablePaymentMethod === 1 ||
                           isDisablePaymentMethod === 3 ||
                           !address.id
                              ? "cursor-not-allowed"
                              : "cursor-pointer"
                        }`}
                     >
                        <input
                           type="radio"
                           className="peer sr-only"
                           name="pricing"
                           onChange={() => {
                              setPaymentType(1);
                              // refTotalBill.current?.scrollIntoView({
                              //    behavior: "smooth",
                              // });
                           }}
                           disabled={
                              isDisablePaymentMethod === 1 ||
                              isDisablePaymentMethod === 3 ||
                              !address.id
                                 ? true
                                 : false
                           }
                        />
                        <div
                           className={`rounded-lg p-2 ring-4 transition-all hover:shadow ring-transparent peer-checked:ring-primary-color `}
                        >
                           <div className="relative overflow-hidden rounded-lg w-20 h-20">
                              <Image
                                 src={
                                    isDisablePaymentMethod === 1 ||
                                    isDisablePaymentMethod === 3 ||
                                    !address.id
                                       ? cashDisabled
                                       : cashpaymentimage
                                 }
                                 alt="img"
                                 layout="fill"
                                 className="object-cover"
                              />
                           </div>
                        </div>
                     </label>
                     <label
                        className={`${
                           isDisablePaymentMethod === 2 ||
                           isDisablePaymentMethod === 3 ||
                           isDisableMoMoPayment === true ||
                           !address.id
                              ? "cursor-not-allowed"
                              : "cursor-pointer"
                        }`}
                     >
                        <input
                           type="radio"
                           className="peer sr-only"
                           name="pricing"
                           disabled={
                              isDisablePaymentMethod === 2 ||
                              isDisablePaymentMethod === 3 ||
                              isDisableMoMoPayment === true ||
                              !address.id
                                 ? true
                                 : false
                           }
                           onChange={() => {
                              setPaymentType(2);
                              // refTotalBill.current?.scrollIntoView({
                              //    behavior: "smooth",
                              // });
                           }}
                        />
                        <div className=" rounded-lg p-2 ring-4 ring-transparent transition-all hover:shadow peer-checked:ring-primary-color">
                           <div className="relative overflow-hidden w-20 h-20 rounded-lg">
                              <Image
                                 src={
                                    isDisablePaymentMethod === 2 ||
                                    isDisablePaymentMethod === 3 ||
                                    isDisableMoMoPayment === true ||
                                    !address.id
                                       ? momoDisabled
                                       : momopaymentimage
                                 }
                                 alt="img"
                                 layout="fill"
                                 className="object-cover"
                              />
                           </div>
                        </div>
                     </label>
                  </div>
                  {isDisableCODPayment && isDisableMoMoPayment ? (
                     <></>
                  ) : (
                     <button
                        className={`py-4 px-10 mx-8 h-fit bg-primary-color rounded-lg font-semibold text-white hover:shadow-primary-color hover:shadow-lg w-fit disabled:bg-gray-400 disabled:hover:shadow-none disabled:cursor-not-allowed `}
                        disabled={
                           address.id &&
                           isDisablePaymentMethod !== 3 &&
                           paymentType > 0
                              ? false
                              : true
                        }
                        onClick={() => {
                           setIsOpenConfirmPayment(true);
                        }}
                     >
                        {address.id
                           ? paymentType === 1
                              ? trans.checkout.payment_by_COD
                              : paymentType === 2
                              ? trans.checkout.paymeny_by_MoMo
                              : isDisablePaymentMethod === 3
                              ? trans.checkout.problems_payment
                              : trans.checkout.please_choose_method
                           : trans.checkout.please_choose_address}
                     </button>
                  )}
               </div>
            </div>
         </div>
         <div
            className={`fixed top-0 right-0 w-full h-screen backdrop-blur-sm items-center justify-center z-20 ${
               isOpenConfirmPayment ? "flex" : "hidden"
            }`}
         >
            <div className="w-1/3  h-fit">
               <ConfirmModel
                  functionConfirm={() => handlePayment()}
                  content={`${trans.checkout.confirm} ${
                     paymentType === 2 ? "MoMo wallet" : "COD method"
                  }`}
                  isOpenConfirm={isOpenConfirmPayment}
                  setIsOpenConfirm={setIsOpenConfirmPayment}
               />
            </div>
         </div>
         {loading ? <Loader /> : <></>}
         <Toaster />
      </Layout>
   );
};

// export default Payment;
export default dynamic(() => Promise.resolve(Payment), { ssr: false });
