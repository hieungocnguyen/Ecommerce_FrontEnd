import { useContext, useEffect, useRef, useState } from "react";
import API, { endpoints } from "../../API";
import { Store } from "../../utils/Store";
import emptyBox from "../../public/empty-box.png";
import Image from "next/image";
import { toast } from "react-hot-toast";

const AddressBook = ({
   setIsOpenAddressBook,
   setAddress,
   setIsOpenAddAddress,
   isOpenAddAddress,
}) => {
   const wrapperRef = useRef(null);
   const [addressList, setAddressList] = useState([]);
   const { state, dispatch } = useContext(Store);
   const { userInfo } = state;
   const [addressSelected, setAddressSelected] = useState<any>({});

   const fetchAddressList = async () => {
      try {
         const res = await API.get(endpoints["get_address_book"](userInfo.id));
         setAddressList(res.data.data);
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      fetchAddressList();
      function handleClickOutside(event) {
         if (
            wrapperRef.current &&
            !wrapperRef.current.contains(event.target) &&
            !isOpenAddAddress
         ) {
            setIsOpenAddressBook(false);
         }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [wrapperRef, isOpenAddAddress]);

   const handleDeleteAddress = async () => {
      try {
         const res = await API.delete(
            endpoints["delete_address"](addressSelected.id)
         );
         toast.success("Delete address sucessful", {
            position: "top-center",
         });
         fetchAddressList();

         //set new current address when delete
         if (addressList.length > 0) {
            setAddress(addressList.sort((a, b) => (a.id > b.id ? -1 : 1))[0]);
         } else {
            setAddress();
         }
      } catch (error) {
         console.log(error);
         toast.error("Delete address failed", {
            position: "top-center",
         });
      }
   };

   return (
      <div
         className="dark:bg-neutral-800 bg-light-primary rounded-lg w-full h-full relative p-8 shadow-lg shadow-light-primary dark:shadow-dark-primary border-2 border-primary-color"
         ref={wrapperRef}
      >
         <div className="flex justify-between items-center mb-2 mx-8">
            <div className="text-lg font-semibold">Address Book</div>
            <button
               className="px-3 py-2 text-white bg-primary-color rounded-lg hover:shadow-primary-color hover:shadow-lg font-semibold"
               onClick={() => setIsOpenAddAddress(true)}
            >
               Add new address
            </button>
         </div>
         <div className=" absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] h-[32rem]">
            <div className="h-[90%] w-full p-4 overflow-auto">
               {addressList.length > 0 ? (
                  <div>
                     {addressList.map((address) => (
                        <div key={address.id}>
                           <label className="cursor-pointer">
                              <input
                                 type="radio"
                                 className="peer sr-only"
                                 name="pricing"
                                 onChange={() => setAddressSelected(address)}
                              />
                              <div className="rounded-lg ring-2 bg-light-spot ring-slate-200 mb-4 p-3  transition-all hover:shadow peer-checked:ring-secondary-color text-left  font-medium">
                                 <div>
                                    <span className="font-semibold">
                                       Name:{" "}
                                    </span>
                                    {address.customerName}
                                 </div>
                                 <div>
                                    <span className="font-semibold">
                                       Delivery Phone:
                                    </span>{" "}
                                    {address.deliveryPhone}
                                 </div>
                                 <div>
                                    <span className="font-semibold">Type:</span>{" "}
                                    {address.addressType}
                                 </div>
                                 <div>
                                    <span className="font-semibold">
                                       Address:
                                    </span>{" "}
                                    {address.fullAddress}
                                 </div>
                                 <div>
                                    <span className="font-semibold">
                                       Description:
                                    </span>{" "}
                                    {address.description}
                                 </div>
                              </div>
                           </label>
                        </div>
                     ))}
                  </div>
               ) : (
                  <div className="relative overflow-hidden w-1/2 aspect-square mx-auto">
                     <Image
                        src={emptyBox}
                        alt="empty"
                        layout="fill"
                        className="object-cover"
                     />
                  </div>
               )}
            </div>
            <div>
               {addressList.length > 0 ? (
                  <div className=" flex gap-8 justify-center">
                     <button
                        className="bg-red-500 rounded-lg px-4 py-3 transition-all text-white font-semibold mt-4 hover:shadow-lg hover:shadow-red-500 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:hover:shadow-gray-400"
                        disabled={addressSelected.id ? false : true}
                        onClick={handleDeleteAddress}
                     >
                        Delete this address
                     </button>
                     <button
                        className="bg-secondary-color rounded-lg px-7 py-3 transition-all text-white font-semibold mt-4 hover:shadow-lg hover:shadow-secondary-color disabled:cursor-not-allowed disabled:bg-gray-400 disabled:hover:shadow-gray-400"
                        disabled={addressSelected.id ? false : true}
                        onClick={() => {
                           setAddress(addressSelected);
                           setIsOpenAddressBook(false);
                        }}
                     >
                        Choose this address
                     </button>
                  </div>
               ) : (
                  <div></div>
               )}
            </div>
         </div>
      </div>
   );
};

export default AddressBook;
