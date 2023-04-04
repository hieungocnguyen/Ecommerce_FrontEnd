import { positions } from "@mui/system";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { BiPencil } from "react-icons/bi";
import API, { endpoints } from "../../API";

const AddressSelect = ({
   setAddress,
   setIsOpenAddressSelect,
   isOpenAddressSelect,
}) => {
   const wrapperRef = useRef(null);
   const [province, setProvince] = useState([]);
   const [district, setDistrict] = useState([]);
   const [ward, setWard] = useState([]);
   const [street, setStreet] = useState("empty");
   const [wardID, setWardID] = useState(0);
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm();

   const fetchProvinceAll = async () => {
      try {
         const res = await API.get(
            "http://localhost:8080/ou-ecommerce/api/location/provinces/all"
         );
         setProvince(res.data.data);
      } catch (error) {
         console.log(error);
      }
   };
   const handleSelectProvince = (provinceID: string) => {
      try {
         const fetchDistrictByProvinceID = async (provinceID) => {
            const res = await API.get(
               `http://localhost:8080/ou-ecommerce/api/location/districts/get-districts-by-province-id/${provinceID}`
            );
            setDistrict(res.data.data);
            setWard([]);
            setStreet("empty");
         };
         fetchDistrictByProvinceID(provinceID);
      } catch (error) {
         console.log(error);
      }
   };
   const handleSelectDistrict = (districtID: string) => {
      try {
         const fetchWardByDistrictID = async (districtID) => {
            const res = await API.get(
               `http://localhost:8080/ou-ecommerce/api/location/wards/get-wards-by-district-id/${districtID}`
            );
            setWard(res.data.data);
            setStreet("empty");
         };
         fetchWardByDistrictID(districtID);
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      if (isOpenAddressSelect) {
         fetchProvinceAll();
      }

      function handleClickOutside(event) {
         if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setIsOpenAddressSelect(false);
         }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [wrapperRef, isOpenAddressSelect]);

   const submitHandler = async ({ street }) => {
      try {
         const resGetLocation = await API.get(
            endpoints["get_full_address"](wardID)
         );
         setAddress(`${street}, ${resGetLocation.data.data}`);
         setIsOpenAddressSelect(false);
         toast.success("Select new address successful!", {
            position: "top-center",
         });
      } catch (error) {
         console.log(error);
         toast.error("Something wrong, please try again later!", {
            position: "top-center",
         });
      }
   };

   return (
      <div
         className="dark:bg-neutral-800 bg-light-primary rounded-lg p-8"
         ref={wrapperRef}
      >
         <div className="font-semibold text-xl mb-4">Select new address</div>
         {isOpenAddressSelect ? (
            <>
               <form
                  className="grid grid-cols-12 gap-4"
                  onSubmit={handleSubmit(submitHandler)}
               >
                  <div className="col-span-4 text-left">
                     <label
                        htmlFor="province"
                        className="font-semibold text-sm"
                     >
                        Province
                     </label>
                     <select
                        id="province"
                        className="bg-light-bg dark:bg-dark-bg p-4 rounded-lg w-full font-medium focus:outline-blue-main disabled:cursor-not-allowed"
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
                  <div className="col-span-4 text-left">
                     <label
                        htmlFor="district"
                        className="font-semibold text-sm"
                     >
                        District
                     </label>
                     <select
                        id="district"
                        className="bg-light-bg dark:bg-dark-primary p-4 rounded-lg w-full font-medium focus:outline-blue-main disabled:cursor-not-allowed"
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
                  <div className="col-span-4 text-left">
                     <label htmlFor="ward" className="font-semibold text-sm">
                        Ward
                     </label>
                     <select
                        id="ward"
                        className="bg-light-bg dark:bg-dark-primary p-4 rounded-lg w-full font-medium focus:outline-blue-main disabled:cursor-not-allowed"
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
                  <div className="col-span-12 text-left">
                     <div>
                        <label
                           htmlFor="street"
                           className="font-semibold text-sm"
                        >
                           Street
                        </label>
                        <input
                           {...register("street")}
                           id="street"
                           name="street"
                           required
                           type="text"
                           placeholder="Street"
                           className="bg-light-bg dark:bg-dark-bg p-4 rounded-lg w-full font-medium focus:outline-blue-main disabled:bg-light-bg disabled:cursor-not-allowed"
                           disabled={street == "empty" ? true : false}
                        />
                     </div>
                  </div>
                  <div className="col-span-12">
                     <button
                        type="submit"
                        className="px-4 py-3 bg-blue-main rounded-lg text-white font-semibold hover:shadow-lg transition-all hover:shadow-blue-main"
                     >
                        Submit this address
                     </button>
                  </div>
               </form>
            </>
         ) : (
            <></>
         )}
      </div>
   );
};

export default AddressSelect;
