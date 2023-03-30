import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import API, { endpoints } from "../../API";
import { Store } from "../../utils/Store";

const AddToAddressBook = ({ setIsOpenAddAddress }) => {
   const [provinces, setProvinces] = useState([]);
   const [districts, setDistricts] = useState([]);
   const [wards, setWards] = useState([]);
   const [street, setStreet] = useState("empty");
   const [address, setAddress] = useState("");
   const [wardID, setWardID] = useState(0);
   const { state, dispatch } = useContext(Store);
   const { userInfo } = state;
   const wrapperRef = useRef(null);
   const [addressFull, setAddressFull] = useState<any>({});
   const [isDisableStreet, setIsDisableStreet] = useState<boolean>(true);
   const [resetForm, setResetForm] = useState(false);

   const fetchProvinceAll = async () => {
      try {
         const res = await API.get(endpoints["get_providers"]);
         setProvinces(res.data.data.provinces);
      } catch (error) {
         console.log(error);
      }
   };

   const handleSelectProvince = (provinceID: string) => {
      const fetchDistrictByProvinceID = async (provinceID) => {
         try {
            const res = await API.get(
               `${endpoints["get_districts"]}?provinceID=${provinceID}`
            );
            setDistricts(res.data.data.districts);
            setWards([]);
         } catch (error) {
            console.log(error);
         }
      };
      fetchDistrictByProvinceID(provinceID);
   };

   const handleSelectDistrict = (districtID: string) => {
      const fetchWardByDistrictID = async (districtID) => {
         try {
            const res = await API.get(
               `${endpoints["get_wards"]}?districtID=${districtID}`
            );
            setWards(res.data.data.wards);
         } catch (error) {
            console.log(error);
         }
      };
      fetchWardByDistrictID(districtID);
   };

   useEffect(() => {
      fetchProvinceAll();

      function handleClickOutside(event) {
         if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setIsOpenAddAddress(false);
         }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [wrapperRef]);

   const handleSubmitAddToAddressBook = async (e) => {
      e.preventDefault();
      e.target.reset();
      try {
         const resCreate = await API.post(endpoints["create_address"], {
            addressType: addressFull.addressType,
            customerID: userInfo.id,
            deliveryPhone: addressFull.deliveryPhone,
            description: addressFull.description,
            fullAddress: `${addressFull.street}, ${addressFull.WardName}, ${addressFull.DistrictName}, ${addressFull.ProvinceName}`,
            toAddress: addressFull.street,
            provinceID: Number(addressFull.ProvinceID),
            toProvinceName: addressFull.ProvinceName,
            districtID: Number(addressFull.DistrictID),
            toDistrictName: addressFull.DistrictName,
            wardID: Number(addressFull.WardID),
            toWardName: addressFull.WardName,
            customerName: addressFull.customerName,
         });
         if (resCreate.data.code == "201") {
            setIsOpenAddAddress(false);
            setResetForm(!resetForm);
            toast.success("Add sucessful", { position: "top-center" });
         }
         if (resCreate.data.code == "400") {
            toast.error(resCreate.data.message, { position: "top-center" });
         }
      } catch (error) {
         console.log(error);
      }
   };

   return (
      <div
         className="dark:bg-neutral-800 bg-light-primary rounded-lg p-8 w-full h-full relative shadow-lg border-2 border-blue-main"
         ref={wrapperRef}
      >
         <div>
            <form
               className="grid grid-cols-12 gap-4 text-left font-medium"
               onSubmit={handleSubmitAddToAddressBook}
            >
               <div className="col-span-12">
                  <label htmlFor="customerName" className="pl-2 text-sm">
                     Name
                  </label>
                  <input
                     type="text"
                     id="customerName"
                     required
                     placeholder="Name"
                     className="w-full p-3 rounded-lg bg-light-bg dark:bg-dark-bg"
                     onChange={(e) => {
                        setAddressFull({
                           ...addressFull,
                           customerName: e.target.value,
                        });
                     }}
                  />
               </div>
               <div className="col-span-6">
                  <label htmlFor="deliveryPhone" className="pl-2 text-sm">
                     Delivery Phone
                  </label>
                  <input
                     type="number"
                     id="deliveryPhone"
                     required
                     placeholder="Delivery Phone"
                     className="w-full p-3 rounded-lg bg-light-bg dark:bg-dark-bg"
                     onChange={(e) => {
                        setAddressFull({
                           ...addressFull,
                           deliveryPhone: e.target.value,
                        });
                     }}
                  />
               </div>
               <div className="col-span-6">
                  <label htmlFor="addressType" className="pl-2 text-sm">
                     Address Type
                  </label>
                  <select
                     id="addressType"
                     className="w-full p-3 rounded-lg bg-light-bg dark:bg-dark-bg"
                     required
                     onChange={(e) => {
                        setAddressFull({
                           ...addressFull,
                           addressType: e.target.value,
                        });
                     }}
                  >
                     <option value="">--Choose address type--</option>
                     <option value="HOME" className="">
                        HOME
                     </option>
                     <option value="OFFICE">OFFICE</option>
                  </select>
               </div>
               <div className="col-span-12">
                  <label htmlFor="description" className="pl-2 text-sm">
                     Description
                  </label>
                  <input
                     type="text"
                     id="description"
                     required
                     placeholder="Description"
                     className="w-full p-3 rounded-lg bg-light-bg dark:bg-dark-bg"
                     onChange={(e) => {
                        setAddressFull({
                           ...addressFull,
                           description: e.target.value,
                        });
                     }}
                  />
               </div>
               <div className="col-span-4">
                  <label htmlFor="province" className="font-semibold text-sm">
                     Province
                  </label>
                  <select
                     id="province"
                     required
                     className="bg-light-bg dark:bg-dark-bg p-4 rounded-lg w-full font-medium focus:outline-blue-main disabled:cursor-not-allowed"
                     onChange={(e) => {
                        handleSelectProvince(e.target.value);
                        setAddressFull({
                           ...addressFull,
                           ProvinceID: e.target.value,
                           ProvinceName: provinces.find(
                              (d) => d.ProvinceID == e.target.value
                           ).ProvinceName,
                        });
                     }}
                  >
                     <option value="" className="hidden">
                        --Select Province--
                     </option>
                     {provinces
                        .sort((a, b) => (a.ProvinceID < b.ProvinceID ? -1 : 1))
                        .map((province) => (
                           <option
                              key={province.ProvinceID}
                              value={province.ProvinceID}
                              className=""
                           >
                              {province.ProvinceName}
                           </option>
                        ))}
                  </select>
               </div>
               <div className="col-span-4 text-left">
                  <label htmlFor="district" className="font-semibold text-sm">
                     District
                  </label>
                  <select
                     id="district"
                     required
                     className="bg-light-bg dark:bg-dark-bg p-4 rounded-lg w-full font-medium focus:outline-blue-main disabled:cursor-not-allowed"
                     onChange={(e) => {
                        handleSelectDistrict(e.target.value);
                        setAddressFull({
                           ...addressFull,
                           DistrictID: e.target.value,
                           DistrictName: districts.find(
                              (d) => d.DistrictID == e.target.value
                           ).DistrictName,
                        });
                     }}
                     disabled={districts.length > 0 ? false : true}
                  >
                     <option value="" className="hidden">
                        --Select District--
                     </option>
                     {districts
                        .sort((a, b) => (a.DistrictID < b.DistrictID ? -1 : 1))
                        .map((district) => (
                           <option
                              key={district.DistrictID}
                              value={district.DistrictID}
                           >
                              {district.DistrictName}
                           </option>
                        ))}
                  </select>
               </div>
               <div className="col-span-4 text-left">
                  <label htmlFor="ward" className="font-semibold text-sm">
                     Ward
                  </label>
                  <select
                     id="ward"
                     required
                     className="bg-light-bg dark:bg-dark-bg p-4 rounded-lg w-full font-medium focus:outline-blue-main disabled:cursor-not-allowed"
                     disabled={wards.length > 0 ? false : true}
                     onChange={(e) => {
                        setIsDisableStreet(false);
                        setAddressFull({
                           ...addressFull,
                           WardID: e.target.value,
                           WardName: wards.find(
                              (ward) => ward.WardCode == e.target.value
                           ).WardName,
                        });
                     }}
                  >
                     <option value="" className="hidden">
                        --Select Ward--
                     </option>
                     {wards
                        .sort((a, b) => (a.WardID < b.WardID ? -1 : 1))
                        .map((ward) => (
                           <option key={ward.WardID} value={ward.WardCode}>
                              {ward.WardName}
                           </option>
                        ))}
                  </select>
               </div>
               <div className="col-span-12 text-left">
                  <div>
                     <label htmlFor="street" className="font-semibold text-sm">
                        Street
                     </label>
                     <input
                        id="street"
                        name="street"
                        required
                        type="text"
                        placeholder="Street"
                        className="bg-light-bg dark:bg-dark-bg p-4 rounded-lg w-full font-medium focus:outline-blue-main disabled:cursor-not-allowed"
                        disabled={isDisableStreet}
                        onChange={(e) => {
                           setAddressFull({
                              ...addressFull,
                              street: e.target.value,
                           });
                        }}
                     />
                  </div>
               </div>
               <div className="col-span-12 flex justify-center">
                  <button
                     type="submit"
                     className="px-4 py-3 bg-blue-main hover:shadow-lg hover:shadow-blue-main text-white rounded-lg font-semibold"
                  >
                     Add to Address Book
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
};

export default AddToAddressBook;
