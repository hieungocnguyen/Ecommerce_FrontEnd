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

const Payment = () => {
   const { state, dispatch } = useContext(Store);
   const { userInfo } = state;
   const router = useRouter();
   const [province, setProvince] = useState([]);
   const [district, setDistrict] = useState([]);
   const [ward, setWard] = useState([]);
   const [street, setStreet] = useState("empty");
   const [address, setAddress] = useState({});
   const [paymentType, setPaymentType] = useState(0);
   const [loading, setLoading] = useState(false);

   const fetchProvinceAll = async () => {
      const res = await API.get(
         "http://localhost:8080/ou-ecommerce/api/location/provinces/all"
      );
      setProvince(res.data.data);
   };

   const handleSelectProvince = (provinceID: string) => {
      const fetchDistrictByProvinceID = async (provinceID) => {
         const res = await API.get(
            `http://localhost:8080/ou-ecommerce/api/location/districts/get-districts-by-province-id/${provinceID}`
         );
         setDistrict(res.data.data);
         setWard([]);
         setStreet("empty");
      };
      fetchDistrictByProvinceID(provinceID);
   };
   const handleSelectDistrict = (districtID: string) => {
      const fetchWardByDistrictID = async (districtID) => {
         const res = await API.get(
            `http://localhost:8080/ou-ecommerce/api/location/wards/get-wards-by-district-id/${districtID}`
         );
         setWard(res.data.data);
         setStreet("empty");
      };
      fetchWardByDistrictID(districtID);
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
      setLoading(true);
      try {
         const resPayment = await authAxios().post(
            endpoints["payment_cart"](1)
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
            console.log(resPayment);
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
         }
      } catch (error) {
         console.log(error);
         setLoading(false);
      }
   };
   useEffect(() => {
      fetchProvinceAll();
   }, [userInfo]);

   return (
      <Layout title="Payment">
         <div className="grid grid-cols-12 gap-8 m-8">
            <div className="col-span-7 dark:bg-dark-primary bg-light-primary rounded-lg p-4">
               <div className="text-lg font-semibold mb-6">
                  Information Delivery
               </div>
               {userInfo ? (
                  <div>
                     <div className=" grid grid-cols-2 gap-4 mb-6">
                        <div>
                           <input
                              required
                              value={userInfo.firstName}
                              disabled
                              className="w-full p-4 rounded-lg font-medium focus:outline-blue-main disabled:bg-light-bg"
                           />
                        </div>
                        <div>
                           <input
                              required
                              value={userInfo.lastName}
                              disabled
                              className="w-full p-4 rounded-lg font-medium focus:outline-blue-main disabled:bg-light-bg"
                           />
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                           <input
                              name="firstName"
                              required
                              value={userInfo.phone}
                              disabled
                              className="w-full p-4 rounded-lg font-medium focus:outline-blue-main disabled:bg-light-bg"
                           />
                        </div>
                        <div>
                           <input
                              name="firstName"
                              required
                              value={userInfo.email}
                              disabled
                              className="w-full p-4 rounded-lg font-medium focus:outline-blue-main disabled:bg-light-bg"
                           />
                        </div>
                     </div>
                     <div className="grid grid-cols-3 gap-4 mb-6">
                        <div>
                           <select
                              id="province"
                              className="p-4 rounded-lg w-full font-medium focus:outline-blue-main disabled:cursor-not-allowed"
                              onChange={(e) => {
                                 handleSelectProvince(e.target.value);
                              }}
                           >
                              <option value={0} className="hidden">
                                 Select Province
                              </option>
                              {province.map((p) => (
                                 <option
                                    key={p.provinceID}
                                    value={p.provinceID}
                                    className=""
                                 >
                                    {p.provinceName}
                                 </option>
                              ))}
                           </select>
                        </div>
                        <div>
                           <select
                              id="district"
                              className="p-4 rounded-lg w-full font-medium focus:outline-blue-main disabled:cursor-not-allowed"
                              onChange={(e) =>
                                 handleSelectDistrict(e.target.value)
                              }
                              disabled={district.length > 0 ? false : true}
                           >
                              <option value={0} className="hidden">
                                 Select District
                              </option>
                              {district.map((p) => (
                                 <option
                                    key={p.districtID}
                                    value={p.districtID}
                                 >
                                    {p.districtName}
                                 </option>
                              ))}
                           </select>
                        </div>
                        <div>
                           <select
                              id="ward"
                              className="p-4 rounded-lg w-full font-medium focus:outline-blue-main disabled:cursor-not-allowed"
                              disabled={ward.length > 0 ? false : true}
                              onChange={() => {
                                 setStreet("");
                              }}
                           >
                              <option value={0} className="hidden">
                                 Select Ward
                              </option>
                              {ward.map((p) => (
                                 <option key={p.wardID} value={p.wardID}>
                                    {p.wardName}
                                 </option>
                              ))}
                           </select>
                        </div>
                     </div>
                     <div>
                        <div>
                           <input
                              name="street"
                              required
                              type="text"
                              placeholder="Street"
                              className="p-4 rounded-lg w-full font-medium focus:outline-blue-main disabled:bg-light-bg disabled:cursor-not-allowed"
                              disabled={street == "" ? false : true}
                           />
                        </div>
                     </div>
                  </div>
               ) : (
                  <></>
               )}
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
                  className="py-4 px-10 h-fit bg-blue-main rounded-lg font-semibold text-white hover:shadow-blue-main hover:shadow-md w-fit transition-all"
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
