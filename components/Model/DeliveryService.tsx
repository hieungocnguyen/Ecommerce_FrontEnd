import { useEffect, useRef, useState } from "react";

const DeliveryService = ({
   agencyServices,
   setIdOpenDeliveryServices,
   address,
   setItemsInCart,
   itemsInCart,
}) => {
   const [service, setService] = useState<any>({});
   useEffect(() => {}, []);

   const handleCloseModel = (e) => {
      setIdOpenDeliveryServices(0);
   };

   const handleSelectService = (service) => {
      setService(service);
   };
   const handleChooseServiceButton = () => {
      itemsInCart.find(
         (service) => service.id === agencyServices.id
      ).selectedService = service;
      setItemsInCart(itemsInCart);
      setIdOpenDeliveryServices(0);
   };

   return (
      <div className="dark:bg-neutral-800 bg-light-primary rounded-lg w-full h-full relative p-8 shadow-lg border-2 border-primary-color">
         <div className="flex justify-between items-center mb-4">
            <div className="font-semibold text-xl">Select service delivery</div>
            <div
               className="px-4 py-2 cursor-pointer bg-primary-color text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-primary-color"
               onClick={handleCloseModel}
            >
               Close
            </div>
         </div>
         {address ? (
            <div className="my-7">
               <span className="text-sm font-medium bg-secondary-color rounded-full p-2 text-white">
                  {agencyServices.fromWardName},{" "}
                  {agencyServices.fromDistrictName},{" "}
                  {agencyServices.fromProvinceName}
               </span>
               <span className="font-bold mx-2">-{">"}</span>
               <span className="text-sm font-medium bg-primary-color rounded-full p-2 text-white">
                  {address.toWardName}, {address.toDistrictName},{" "}
                  {address.toProvinceName}
               </span>
            </div>
         ) : (
            <></>
         )}
         <div className="overflow-auto max-h-96 h-fit p-3">
            {agencyServices.services ? (
               <>
                  {agencyServices.services.map((service) => (
                     <div key={service.id}>
                        <label className="cursor-pointer">
                           <input
                              type="radio"
                              className="peer sr-only"
                              name="pricing"
                              onChange={() => handleSelectService(service)}
                           />
                           <div className="rounded-lg ring-2 bg-light-spot dark:bg-dark-bg ring-light-spot dark:ring-dark-bg mb-4 p-3 transition-all hover:shadow peer-checked:ring-secondary-color text-left font-medium">
                              <div className="text-sm mb-2">
                                 <span className="font-semibold">
                                    Devilery service:
                                 </span>{" "}
                                 {service.short_name}
                              </div>
                              <div className="text-sm mb-2">
                                 <span className="font-semibold">
                                    Ship fee :
                                 </span>
                                 <span className="">
                                    {service.serviceInfoWithCOD.isSuccess === 1
                                       ? `${service.serviceInfoWithCOD.shipFee.toLocaleString(
                                            "it-IT",
                                            {
                                               style: "currency",
                                               currency: "VND",
                                            }
                                         )} [COD]`
                                       : ""}
                                    {service.serviceInfoWithCOD.isSuccess ===
                                       1 &&
                                    service.serviceInfoWithPrePayment
                                       .isSuccess === 1
                                       ? " | "
                                       : ""}
                                    {service.serviceInfoWithPrePayment
                                       .isSuccess === 1
                                       ? `${service.serviceInfoWithPrePayment.shipFee.toLocaleString(
                                            "it-IT",
                                            {
                                               style: "currency",
                                               currency: "VND",
                                            }
                                         )} [MOMO]`
                                       : ""}
                                 </span>
                              </div>
                              <div className="text-sm font-medium ">
                                 <span className="font-bold">
                                    Expected Delivery Time:
                                 </span>
                                 <span>
                                    {" "}
                                    {new Date(
                                       service.serviceInfoWithCOD.expectedTimeDelivery
                                    ).toLocaleDateString("en-GB")}
                                 </span>
                              </div>
                           </div>
                        </label>
                     </div>
                  ))}
               </>
            ) : (
               <>123</>
            )}
         </div>
         <div className="flex justify-center mt-2">
            <button
               className="px-5 py-3 bg-primary-color rounded-lg hover:shadow-lg hover:shadow-primary-color font-semibold text-white"
               title="choose service"
               onClick={handleChooseServiceButton}
            >
               Choose this service delivery
            </button>
         </div>
      </div>
   );
};

export default DeliveryService;
