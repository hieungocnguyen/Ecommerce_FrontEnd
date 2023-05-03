import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import API, { authAxios, endpoints } from "../API";
import Layout from "../components/Layout/Layout";
import Loader from "../components/Loader";
import { Store } from "../utils/Store";
import Cookies from "js-cookie";
import { BiArrowBack, BiCloudUpload } from "react-icons/bi";
import { log } from "console";
import { toast } from "react-hot-toast";

const RegisterAgency = () => {
   const [selectedImage, setSelectedImage] = useState();
   const [importImage, setImportImage] = useState(false);
   const [name, setName] = useState("");
   const [avatar, setAvatar] = useState("");
   const [address, setAddress] = useState("");
   const [hotline, setHotline] = useState("");
   const [field, setField] = useState(1);
   const { state, dispatch } = useContext(Store);
   const { userInfo } = state;
   const router = useRouter();
   const [loading, setLoading] = useState(false);
   const [provinces, setProvinces] = useState([]);
   const [districts, setDistricts] = useState([]);
   const [wards, setWards] = useState([]);
   const [street, setStreet] = useState<string>();
   const [isDisableStreet, setIsDisableStreet] = useState<boolean>(true);
   const [addressFull, setAddressFull] = useState<any>({});

   const fetchProvinceAll = async () => {
      const res = await API.get(endpoints["get_provinces"]);
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
      fetchProvinceAll();
   }, []);

   const imageChange = (e) => {
      if (e.target.files[0] === undefined) {
         setImportImage(false);
      } else {
         // size < 2MB
         if (e.target.files[0].size <= 2097152) {
            setSelectedImage(e.target.files[0]);
            setImportImage(true);
         } else {
            setImportImage(false);
            toast.error("Maximum upload size is 2MB, please try other image");
         }
      }
   };

   const handleRegister = async (e) => {
      e.preventDefault();
      if (!importImage) {
         toast.error("Please select avatar for your agency!");
         return;
      }
      try {
         setLoading(true);
         const resUploadCloudinary = await API.post(
            endpoints["upload_cloudinary"],
            { file: selectedImage },
            {
               headers: {
                  "Content-Type": "multipart/form-data",
               },
            }
         );
         setAvatar(resUploadCloudinary.data.data);
         const resRegister = await authAxios().post(
            endpoints["register_agency"],
            {
               address: addressFull.ProvinceName,
               fromAddress: `${street}, ${addressFull.WardName}, ${addressFull.DistrictName}, ${addressFull.ProvinceName}`,
               provinceID: Number(addressFull.ProvinceID),
               fromProvinceName: addressFull.ProvinceName,
               districtID: Number(addressFull.DistrictID),
               fromDistrictName: addressFull.DistrictName,
               wardID: addressFull.WardID,
               fromWardName: addressFull.WardName,
               avatar: resUploadCloudinary.data.data,
               fieldID: Number(field),
               hotline: hotline,
               managerID: Number(userInfo.id),
               name: name,
            }
         );
         const dataCurrentUser = await authAxios().get(
            endpoints["user_current_user"]
         );

         Cookies.set("userInfo", JSON.stringify(dataCurrentUser.data.data));
         dispatch({ type: "USER_LOGIN", payload: dataCurrentUser.data.data });

         if (resRegister.data.code === "201") {
            setLoading(false);
            router.push("/profile");
            toast.success("Register agency successfully!");
         } else {
            setLoading(false);
            toast.error(resRegister.data.message);
         }
      } catch (error) {
         setLoading(false);
         console.log(error);
         toast.error("Something wrong, please try again!");
      }
   };
   return (
      <Layout title="Register Agency">
         <div className="flex gap-4 items-center m-6">
            <div
               className="bg-primary-color text-white p-3 text-2xl rounded-lg cursor-pointer hover:shadow-lg hover:shadow-primary-color"
               onClick={() => router.back()}
            >
               <BiArrowBack />
            </div>
            <div className="font-semibold text-2xl">
               / Register to become an agency
            </div>
         </div>
         <form
            className="grid grid-cols-12 gap-8 mx-24"
            onSubmit={handleRegister}
         >
            <div className="col-span-3">
               <div className="relative overflow-hidden w-full aspect-square rounded-xl">
                  <Image
                     src={
                        selectedImage
                           ? URL.createObjectURL(selectedImage)
                           : "https://res.cloudinary.com/ngnohieu/image/upload/v1678612328/avatar2Artboard_1-100_impj99.jpg"
                     }
                     alt="avatar"
                     layout="fill"
                     className="object-cover"
                  />
                  <label
                     className={`absolute w-full h-full top-0 left-0 dark:hover:bg-dark-primary hover:bg-light-primary hover:opacity-90 opacity-0  z-20 cursor-pointer`}
                     htmlFor="upload-photo"
                  >
                     <div className="w-full h-full text-5xl flex justify-center items-center">
                        <BiCloudUpload />
                     </div>
                     <input
                        type="file"
                        name="photo"
                        id="upload-photo"
                        className="hidden"
                        onChange={imageChange}
                        accept="image/png, image/jpeg"
                     />
                  </label>
               </div>
               <div className="mt-2 text-gray-500 font-medium text-sm italic">
                  *Maximum image size 2MB
               </div>
            </div>

            <div className="col-span-9">
               <div className="grid grid-cols-12 gap-4 text-left font-medium">
                  <div className="col-span-12">
                     <label htmlFor="name" className="">
                        Name
                     </label>
                     <input
                        type="text"
                        id="name"
                        required
                        className="p-4 rounded-lg bg-light-primary dark:bg-dark-primary w-full"
                        onChange={(e) => {
                           setName(e.target.value);
                        }}
                     />
                  </div>
                  <div className="col-span-6">
                     <label htmlFor="hotline" className="">
                        Hotline
                     </label>
                     <input
                        type="text"
                        id="hotline"
                        required
                        className="p-4 rounded-lg bg-light-primary dark:bg-dark-primary w-full"
                        onChange={(e) => {
                           setHotline(e.target.value);
                        }}
                     />
                  </div>
                  <div className="col-span-6">
                     <label htmlFor="fields" className="">
                        Field
                     </label>
                     <select
                        name="fields"
                        id="fields"
                        required
                        className="p-4 rounded-lg bg-light-primary dark:bg-dark-primary w-full"
                        onChange={(e) => {
                           setField(Number(e.target.value));
                        }}
                     >
                        <option value="">--Choose field--</option>
                        <option value={1}>Thời trang</option>
                        <option value={2}>Dược phẩm</option>
                        <option value={3}>Đồ gia dụng</option>
                        <option value={4}>Đồ handmade - Mỹ nghệ</option>
                        <option value={5}>Thực phẩm</option>
                        <option value={6}>Phụ kiện công nghệ</option>
                        <option value={7}>Đồ chơi trẻ em</option>
                        <option value={8}>Phụ kiện - Trang sức</option>
                        <option value={9}>Sách</option>
                        <option value={10}>Văn phòng phẩm</option>
                        <option value={11}>Chăm sóc thú cưng</option>
                        <option value={12}>Thể thao - Du lịch</option>
                        <option value={13}>Mỹ phẩm - Chăm sóc sắc đẹp</option>
                        <option value={14}>Dịch vụ</option>
                        <option value={15}>Xe - Phụ kiện xe</option>
                        <option value={16}>Khác</option>
                     </select>
                  </div>
                  <div className="col-span-12">
                     <div className="grid grid-cols-12 gap-4">
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
                              className="bg-light-primary dark:bg-dark-primary p-4 rounded-lg w-full font-medium focus:outline-primary-color disabled:cursor-not-allowed"
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
                              className="bg-light-primary dark:bg-dark-primary p-4 rounded-lg w-full font-medium focus:outline-primary-color disabled:cursor-not-allowed"
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
                           <label
                              htmlFor="ward"
                              className="font-semibold text-sm"
                           >
                              Ward
                           </label>
                           <select
                              id="ward"
                              required
                              className="bg-light-primary dark:bg-dark-primary p-4 rounded-lg w-full font-medium focus:outline-primary-color disabled:cursor-not-allowed"
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
                                    <option
                                       key={ward.WardID}
                                       value={ward.WardCode}
                                    >
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
                                 className="bg-light-primary dark:bg-dark-primary p-4 rounded-lg w-full font-medium focus:outline-primary-color disabled:cursor-not-allowed"
                                 disabled={isDisableStreet}
                                 onChange={(e) => {
                                    setStreet(e.target.value);
                                 }}
                              />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div className="col-span-12 my-8">
               <button
                  className="px-4 py-3 bg-primary-color text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-primary-color transition-all"
                  type="submit"
               >
                  Register to become an agency
               </button>
            </div>
            {loading ? <Loader /> : <></>}
         </form>
      </Layout>
   );
};

export default RegisterAgency;
