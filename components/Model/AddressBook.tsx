import { useContext, useEffect, useRef, useState } from "react";
import API, { endpoints } from "../../API";
import { Store } from "../../utils/Store";

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

   const fetchAddressList = async () => {
      const res = await API.get(endpoints["get_address_book"](userInfo.id));
      setAddressList(res.data.data);
   };

   useEffect(() => {
      fetchAddressList();
      function handleClickOutside(event) {
         if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setIsOpenAddressBook(false);
         }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [wrapperRef, isOpenAddAddress]);

   return (
      <div
         className="dark:bg-neutral-800 bg-light-primary rounded-lg w-full h-full relative p-8 shadow-lg shadow-blue-main"
         ref={wrapperRef}
      >
         <div className="flex justify-between items-center mb-2 mx-8">
            <div className="text-lg font-semibold">Address Book</div>
            <button
               className="px-3 py-2 text-white bg-blue-main rounded-lg hover:shadow-blue-main hover:shadow-lg font-semibold"
               onClick={() => setIsOpenAddAddress(true)}
            >
               Add new address
            </button>
         </div>
         <div className=" absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] h-[32rem]">
            <div className="h-[90%] w-full px-4 overflow-auto">
               {addressList.map((address) => (
                  <div key={address.id}>
                     <label className="cursor-pointer">
                        <input
                           type="radio"
                           className="peer sr-only"
                           name="pricing"
                           onChange={() => setAddress(address)}
                        />
                        <div className="rounded-lg ring-2 bg-light-spot ring-slate-200 mb-4 p-3  transition-all hover:shadow peer-checked:ring-blue-main text-left  font-medium">
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
                              <span className="font-semibold">Address:</span>{" "}
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
            <div>
               <button
                  className="bg-blue-main rounded-lg px-4 py-3 text-white font-semibold mt-4 hover:shadow-lg hover:shadow-blue-main"
                  onClick={() => setIsOpenAddressBook(false)}
               >
                  Choose this address
               </button>
            </div>
         </div>
      </div>
   );
};

export default AddressBook;
