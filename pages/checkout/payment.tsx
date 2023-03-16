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

const Payment = () => {
   const { state, dispatch } = useContext(Store);
   const { userInfo } = state;
   const router = useRouter();
   const [paymentType, setPaymentType] = useState(0);
   const [loading, setLoading] = useState(false);
   const [isOpenAddressBook, setIsOpenAddressBook] = useState(false);
   const [isOpenAddAddress, setIsOpenAddAddress] = useState(false);
   const [address, setAddress] = useState<any>({});

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
         const res = await authAxios().post(endpoints["momo_payment_info"]);
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
   useEffect(() => {
      const fetchAddressList = async () => {
         const res = await API.get(endpoints["get_address_book"](userInfo.id));
         setAddress(res.data.data.sort((a, b) => (a.id > b.id ? -1 : 1))[0]);
      };
      fetchAddressList();
   }, []);

   return (
      <Layout title="Payment">
         <div className="grid grid-cols-12 gap-8 m-8">
            <div className="col-span-7 dark:bg-dark-primary bg-light-primary rounded-lg p-4">
               <div className="text-lg font-semibold mb-4">
                  Information Delivery
               </div>
               {userInfo ? (
                  <div className="text-left px-4">
                     <div className="mb-2">
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
                           value={`${userInfo.firstName} ${userInfo.lastName} `}
                           disabled
                           className="w-full p-4 rounded-lg font-medium disabled:bg-slate-50"
                        />
                     </div>
                     <div className="">
                        <label
                           htmlFor="email"
                           className="font-medium text-sm pl-2"
                        >
                           Email
                        </label>
                        <input
                           type="text"
                           name="email"
                           required
                           value={userInfo.email}
                           disabled
                           className="w-full p-4 rounded-lg font-medium disabled:bg-slate-50"
                        />
                     </div>
                     {address.fullAddress ? (
                        <>
                           <div>
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
                                 className="w-full p-4 rounded-lg font-medium disabled:bg-slate-50"
                              />
                           </div>
                           <div>
                              <label
                                 htmlFor="phone"
                                 className="font-medium text-sm pl-2"
                              >
                                 Address
                              </label>
                              <input
                                 type="number"
                                 name="phone"
                                 required
                                 value={address.deliveryPhone}
                                 disabled
                                 className="w-full p-4 rounded-lg font-medium disabled:bg-slate-50"
                              />
                           </div>
                           <div>
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
                                 className="w-full p-4 rounded-lg font-medium disabled:bg-slate-50"
                              />
                           </div>
                        </>
                     ) : (
                        <></>
                     )}

                     <div className="flex justify-center my-4">
                        <button
                           className="py-3 px-4 rounded-lg bg-blue-main text-white font-semibold hover:shadow-lg hover:shadow-blue-main"
                           onClick={() => setIsOpenAddressBook(true)}
                        >
                           Address Book
                        </button>
                     </div>
                  </div>
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
            <div className="col-span-5 dark:bg-dark-primary bg-light-primary rounded-lg p-4">
               <div className="text-lg font-semibold">Cart</div>
               <div>Update later...</div>
            </div>
         </div>
         <div className="grid grid-cols-12 gap-8 m-8">
            <div className="col-span-7 dark:bg-dark-primary bg-light-primary rounded-lg py-8">
               <div className="text-lg font-semibold">Shipping Method</div>
               <div>Update later...</div>
            </div>
            <div className="col-span-5 dark:bg-dark-primary bg-light-primary rounded-lg py-8 ">
               <div className="text-lg font-semibold">Payment Type</div>
               <div className="flex justify-center gap-4 my-6">
                  <label className="cursor-pointer">
                     <input
                        type="radio"
                        className="peer sr-only"
                        name="pricing"
                        onChange={() => setPaymentType(1)}
                     />
                     <div className="rounded-lg p-1 ring-4 ring-transparent transition-all hover:shadow peer-checked:ring-blue-main">
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
                     <div className=" rounded-lg p-1 ring-4 ring-transparent transition-all hover:shadow peer-checked:ring-blue-main">
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
                  className="py-4 px-10 h-fit bg-blue-main rounded-lg font-semibold text-white hover:shadow-blue-main hover:shadow-md w-fit "
                  onClick={handlePayment}
               >
                  {paymentType === 1
                     ? " Payment by Cash"
                     : paymentType === 2
                     ? " Payment by Momo"
                     : "Please choice your payment method"}
               </button>
            </div>
         </div>
         {loading ? <Loader /> : <></>}
         <Toaster />
      </Layout>
   );
};

// export default Payment;
export default dynamic(() => Promise.resolve(Payment), { ssr: false });
