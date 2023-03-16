import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import API, { endpoints } from "../../API";
import { Store } from "../../utils/Store";

const AddToAddressBook = ({ setIsOpenAddAddress }) => {
   const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
   } = useForm();
   const [province, setProvince] = useState([]);
   const [district, setDistrict] = useState([]);
   const [ward, setWard] = useState([]);
   const [street, setStreet] = useState("empty");
   const [address, setAddress] = useState("");
   const [wardID, setWardID] = useState(0);
   const { state, dispatch } = useContext(Store);
   const { userInfo } = state;
   const router = useRouter();
   const wrapperRef = useRef(null);

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

   const handleSubmitAddToAddressBook = async ({
      deliveryPhone,
      addressType,
      description,
      street,
   }) => {
      try {
         let location = "";
         const resGetLocation = await API.get(
            endpoints["get_full_address"](wardID)
         );
         location = resGetLocation.data.data;
         const resCreate = await API.post(endpoints["create_address"], {
            addressType: addressType,
            customerID: userInfo.id,
            deliveryPhone: deliveryPhone,
            description: description,
            fullAddress: `${street} ${location}`,
         });
         if (resCreate.data.code == "201") {
            setIsOpenAddAddress(false);
            toast.success("Add sucessful", { position: "top-center" });
         }
      } catch (error) {
         console.log(error);
      }
   };

   return (
      <div
         className="dark:bg-neutral-800 bg-light-primary rounded-lg p-8 w-full h-full relative shadow-lg shadow-blue-main"
         ref={wrapperRef}
      >
         <div>
            <form
               className="grid grid-cols-12 gap-4 text-left font-medium"
               onSubmit={handleSubmit(handleSubmitAddToAddressBook)}
            >
               <div className="col-span-6">
                  <label htmlFor="deliveryPhone" className="pl-2 text-sm">
                     Delivery Phone
                  </label>
                  <input
                     {...register("deliveryPhone")}
                     type="number"
                     id="deliveryPhone"
                     className="w-full p-3 rounded-lg"
                  />
               </div>
               <div className="col-span-6">
                  <label htmlFor="addressType" className="pl-2 text-sm">
                     Address Type
                  </label>
                  <select
                     id="addressType"
                     className="w-full p-3 rounded-lg"
                     {...register("addressType")}
                  >
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
                     {...register("description")}
                     type="text"
                     id="description"
                     className="w-full p-3 rounded-lg"
                  />
               </div>
               <div className="col-span-4">
                  <label htmlFor="province" className="pl-2 text-sm">
                     Province
                  </label>
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
               <div className="col-span-4">
                  <label htmlFor="district" className="pl-2 text-sm">
                     District
                  </label>
                  <select
                     id="district"
                     className="p-4 rounded-lg w-full font-medium focus:outline-blue-main disabled:cursor-not-allowed"
                     onChange={(e) => handleSelectDistrict(e.target.value)}
                     disabled={district.length > 0 ? false : true}
                  >
                     <option value={0} className="hidden">
                        Select District
                     </option>
                     {district.map((p) => (
                        <option key={p.districtID} value={p.districtID}>
                           {p.districtName}
                        </option>
                     ))}
                  </select>
               </div>
               <div className="col-span-4">
                  <label htmlFor="ward" className="pl-2 text-sm">
                     Ward
                  </label>
                  <select
                     id="ward"
                     className="p-4 rounded-lg w-full font-medium focus:outline-blue-main disabled:cursor-not-allowed"
                     disabled={ward.length > 0 ? false : true}
                     onChange={(e) => {
                        setStreet("");
                        setWardID(Number(e.target.value));
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
               <div className="col-span-12">
                  <label htmlFor="street" className="pl-2 text-sm">
                     Street
                  </label>
                  <input
                     {...register("street")}
                     id="street"
                     name="street"
                     required
                     type="text"
                     placeholder="Street"
                     className="p-4 rounded-lg w-full font-medium focus:outline-blue-main disabled:bg-light-bg disabled:cursor-not-allowed"
                     disabled={street == "" ? false : true}
                  />
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
