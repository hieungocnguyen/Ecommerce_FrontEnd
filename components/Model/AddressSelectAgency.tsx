import { positions } from "@mui/system";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { BiCaretLeft, BiPencil } from "react-icons/bi";
import API, { endpoints } from "../../API";

const AddressSelectAgency = ({
   setAddress,
   setAddressCode,
   setIsOpenAddressSelect,
   isOpenAddressSelect,
}) => {
   const wrapperRef = useRef(null);
   const [provinces, setProvinces] = useState([]);
   const [districts, setDistricts] = useState([]);
   const [wards, setWards] = useState([]);
   const [addressFull, setAddressFull] = useState<any>({});
   const [isDisableStreet, setIsDisableStreet] = useState<boolean>(true);

   const fetchProvinceAll = async () => {
      const res = await API.get(endpoints["get_providers"]);
      setProvinces(res.data.data.provinces);
   };

   const handleSelectProvince = (provinceID: string) => {
      const fetchDistrictByProvinceID = async (provinceID) => {
         const res = await API.get(
            `${endpoints["get_districts"]}?provinceID=${provinceID}`
         );
         setDistricts(res.data.data.districts);
         setWards([]);
      };
      fetchDistrictByProvinceID(provinceID);
   };

   const handleSelectDistrict = (districtID: string) => {
      const fetchWardByDistrictID = async (districtID) => {
         const res = await API.get(
            `${endpoints["get_wards"]}?districtID=${districtID}`
         );
         setWards(res.data.data.wards);
      };
      fetchWardByDistrictID(districtID);
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

   const handleSubmitAddress = (e) => {
      e.preventDefault();
      try {
         setAddress(
            `${addressFull.street}, ${addressFull.WardName}, ${addressFull.DistrictName}, ${addressFull.ProvinceName}`
         );
         setAddressCode(addressFull);
         setIsOpenAddressSelect(false);
      } catch (error) {}
   };

   return (
      <div
         className="dark:bg-neutral-800 bg-light-primary rounded-lg p-8"
         ref={wrapperRef}
      >
         <div className="flex justify-between items-center mb-6">
            <div className="font-semibold text-xl">Select new address</div>
         </div>
         {isOpenAddressSelect ? (
            <>
               <form
                  className="grid grid-cols-12 gap-4"
                  onSubmit={handleSubmitAddress}
               >
                  <div className="col-span-4">
                     <label
                        htmlFor="province"
                        className="font-semibold text-sm"
                     >
                        Province
                     </label>
                     <select
                        id="province"
                        required
                        className="bg-light-bg dark:bg-dark-bg p-4 rounded-lg w-full font-medium focus:outline-primary-color disabled:cursor-not-allowed"
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
                           .sort((a, b) =>
                              a.ProvinceID < b.ProvinceID ? -1 : 1
                           )
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
                     <label
                        htmlFor="district"
                        className="font-semibold text-sm"
                     >
                        District
                     </label>
                     <select
                        id="district"
                        required
                        className="bg-light-bg dark:bg-dark-bg p-4 rounded-lg w-full font-medium focus:outline-primary-color disabled:cursor-not-allowed"
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
                           .sort((a, b) =>
                              a.DistrictID < b.DistrictID ? -1 : 1
                           )
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
                        className="bg-light-bg dark:bg-dark-bg p-4 rounded-lg w-full font-medium focus:outline-primary-color disabled:cursor-not-allowed"
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
                        <label
                           htmlFor="street"
                           className="font-semibold text-sm"
                        >
                           Street
                        </label>
                        <input
                           id="street"
                           name="street"
                           required
                           type="text"
                           placeholder="Street"
                           className="bg-light-bg dark:bg-dark-bg p-4 rounded-lg w-full font-medium focus:outline-primary-color disabled:cursor-not-allowed"
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
                  <div className="col-span-12">
                     <button
                        type="submit"
                        className="px-4 py-3 bg-primary-color rounded-lg text-white font-semibold hover:shadow-lg transition-all hover:shadow-primary-color"
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

export default AddressSelectAgency;
