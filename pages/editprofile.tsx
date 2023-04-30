/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import API, { authAxios, endpoints } from "../API";
import Layout from "../components/Layout/Layout";
import { Store } from "../utils/Store";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import { BiArrowBack, BiCloudUpload, BiPencil } from "react-icons/bi";
import Loader from "../components/Loader";
import AddressSelect from "../components/Model/AddressSelect";
import ConfirmModel from "../components/Model/ConfirmModel";
import WayToSelectAddress from "../components/Model/WayToSelectAddress";
import GeoLocationAddress from "../components/Model/GeoLocationAddress";

const EditProfile = () => {
   const { state, dispatch } = useContext(Store);
   const { userInfo } = state;
   const [user, setUser] = useState<any>({});
   const [importImage, setImportImage] = useState(false);
   const router = useRouter();
   const {
      register,
      handleSubmit,
      watch,
      setValue,
      formState: { errors },
   } = useForm();
   const [selectedImage, setSelectedImage] = useState();
   const [loading, setLoading] = useState(false);
   const [address, setAddress] = useState();
   const [isOpenAddressSelect, setIsOpenAddressSelect] = useState(false);
   const [isOpenConfirm, setIsOpenConfirm] = useState(false);
   const [isChange, setIsChange] = useState(false);

   const [isOpenModelWaySelectAddress, setIsOpenModelWaySelectAddress] =
      useState(false);
   const [isOpenModelGeoLocation, setIsOpenModelGeoLocation] = useState(false);

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
   useEffect(() => {
      const loadUser = async () => {
         const resUser = await API.get(endpoints["user"](userInfo.id));
         setUser(resUser.data.data);
      };
      if (userInfo) {
         loadUser();
         setValue("firstName", userInfo.firstName ? userInfo.firstName : "");
         setValue("lastName", userInfo.lastName ? userInfo.lastName : "");
         setValue("phone", userInfo.phone ? userInfo.phone : "");
      }
   }, [userInfo]);

   useEffect(() => {
      if (userInfo) {
         setValue("address", address ? address : userInfo.address);
      }
      if (address) {
         setIsChange(true);
      }
   }, [address]);

   const submitHandler = async ({ firstName, lastName, phone, address }) => {
      setLoading(true);
      try {
         const formData = new FormData();
         if (importImage) {
            const resUploadCloudinary = await API.post(
               endpoints["upload_cloudinary"],
               { file: selectedImage },
               {
                  headers: {
                     "Content-Type": "multipart/form-data",
                  },
               }
            );
            formData.append("avatar", resUploadCloudinary.data.data);
         }

         formData.append("firstName", firstName ? firstName : "");
         formData.append("lastName", lastName ? lastName : "");
         formData.append("address", address);
         formData.append("phone", phone ? phone : "");

         //update info user
         const resRegister = await authAxios().put(
            endpoints["user"](userInfo.id),
            formData,
            {
               headers: {
                  "Content-Type": "application/json",
               },
            }
         );
         //get info current user
         const dataCurrentUser = await authAxios().get(
            "http://localhost:8080/ou-ecommerce/api/user/current-user"
         );

         Cookies.set("userInfo", JSON.stringify(dataCurrentUser.data.data));
         dispatch({
            type: "USER_LOGIN",
            payload: dataCurrentUser.data.data,
         });
         toast.success("Change your infomation successful!", {
            position: "top-center",
         });
         setLoading(false);
         router.push("/profile");
      } catch (error) {
         toast.error("Something wrong, check again!", {
            position: "top-center",
         });
         setLoading(false);
      }
   };
   return (
      <Layout title="Edit Profile">
         <div className="flex gap-4 items-center m-6">
            <div
               className="bg-primary-color text-white p-3 text-2xl rounded-lg cursor-pointer hover:shadow-lg hover:shadow-primary-color transition-all"
               onClick={() => {
                  if (isChange) {
                     setIsOpenConfirm(true);
                  } else {
                     router.push("/profile");
                  }
               }}
            >
               <BiArrowBack />
            </div>

            <div className="font-semibold text-2xl">/ Edit profile</div>
         </div>
         <form
            onSubmit={handleSubmit(submitHandler)}
            className="grid grid-cols-12 gap-12 mx-24 items-center"
         >
            <div className="col-span-3">
               <div className="relative overflow-hidden w-full aspect-square rounded-full">
                  <Image
                     src={
                        selectedImage
                           ? URL.createObjectURL(selectedImage)
                           : user.avatar
                     }
                     alt="avatar"
                     layout="fill"
                     className="object-cover"
                  />
                  <label
                     className={`absolute w-full h-full top-0 left-0 dark:hover:bg-dark-primary hover:bg-light-primary hover:opacity-90 opacity-0  z-20 cursor-pointer`}
                     htmlFor="upload-photo"
                  >
                     <div className="w-full h-full text-6xl flex justify-center items-center">
                        <BiCloudUpload />
                     </div>
                     <input
                        type="file"
                        name="photo"
                        id="upload-photo"
                        className="hidden"
                        onChange={(e) => {
                           setIsChange(true);
                           imageChange(e);
                        }}
                     />
                  </label>
               </div>
               <div className="mt-2 text-gray-500 font-medium text-sm italic">
                  *Maximum image size 2MB
               </div>
            </div>
            <div className="col-span-9">
               <div className="grid grid-cols-12 gap-4 text-left font-medium">
                  <div className="col-span-6">
                     <label htmlFor="username" className="">
                        FirstName
                     </label>
                     <input
                        name="firstName"
                        placeholder="FirstName"
                        className="p-4 rounded-lg w-full"
                        {...register("firstName")}
                        onChange={() => {
                           setIsChange(true);
                        }}
                     />
                  </div>
                  <div className="col-span-6">
                     <label htmlFor="lastname" className="">
                        Lastname
                     </label>
                     <input
                        id="lastname"
                        name="lastName"
                        placeholder="Lastname"
                        className="p-4 rounded-lg w-full"
                        {...register("lastName")}
                        onChange={() => {
                           setIsChange(true);
                        }}
                     />
                  </div>
                  <div className="col-span-12">
                     <label htmlFor="phone" className="">
                        Phone
                     </label>
                     <input
                        name="phone"
                        id="phone"
                        placeholder="Phone"
                        className="p-4 rounded-lg w-full"
                        {...register("phone")}
                        onChange={() => {
                           setIsChange(true);
                        }}
                     />
                  </div>
                  <div className="col-span-12">
                     <div className="">
                        <label htmlFor="address" className="">
                           Address
                        </label>
                        <div className="grid grid-cols-12 gap-4">
                           <input
                              name="address"
                              id="address"
                              placeholder="Address"
                              disabled
                              className="col-span-11 p-4 rounded-lg w-full "
                              {...register("address")}
                              onChange={() => {
                                 setIsChange(true);
                              }}
                           />
                           <button
                              className="col-span-1 border-2 border-primary-color rounded-lg text-2xl text-primary-color flex justify-center items-center hover:bg-primary-color hover:text-white"
                              type="button"
                              onClick={() =>
                                 setIsOpenModelWaySelectAddress(true)
                              }
                           >
                              <BiPencil />
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div className="col-span-12">
               <button
                  className="px-6 py-3 bg-primary-color rounded-lg font-semibold text-white hover:shadow-lg transition-all hover:shadow-primary-color my-8"
                  type="submit"
               >
                  Save the changes
               </button>
            </div>
         </form>
         <div
            className={`fixed top-0 right-0 w-full h-screen backdrop-blur-sm items-center justify-center z-20 ${
               isOpenModelWaySelectAddress ? "flex" : "hidden"
            }`}
         >
            {isOpenModelWaySelectAddress && (
               <div className="w-1/2 h-fit">
                  <WayToSelectAddress
                     setIsOpenModelWaySelectAddress={
                        setIsOpenModelWaySelectAddress
                     }
                     setIsOpenAddressSelect={setIsOpenAddressSelect}
                     setIsOpenModelGeoLocation={setIsOpenModelGeoLocation}
                  />
               </div>
            )}
         </div>
         <div
            className={`fixed top-0 right-0 w-full h-screen backdrop-blur-sm items-center justify-center z-20 ${
               isOpenAddressSelect ? "flex" : "hidden"
            }`}
         >
            {isOpenAddressSelect && (
               <div className="w-3/5 h-fit">
                  <AddressSelect
                     setAddress={setAddress}
                     setIsOpenAddressSelect={setIsOpenAddressSelect}
                     isOpenAddressSelect={isOpenAddressSelect}
                     setIsOpenModelGeoLocation={setIsOpenModelGeoLocation}
                  />
               </div>
            )}
         </div>
         <div
            className={`fixed top-0 right-0 w-full h-screen backdrop-blur-sm items-center justify-center z-20 ${
               isOpenModelGeoLocation ? "flex" : "hidden"
            }`}
         >
            {isOpenModelGeoLocation && (
               <div className="w-1/2 h-fit">
                  <GeoLocationAddress
                     setIsOpenModelGeoLocation={setIsOpenModelGeoLocation}
                     setAddress={setAddress}
                     setIsOpenAddressSelect={setIsOpenAddressSelect}
                  />
               </div>
            )}
         </div>
         {/* {loading ? <Loader /> : <></>} */}
         <div
            className={`fixed top-0 right-0 w-full h-screen backdrop-blur-sm items-center justify-center z-20 ${
               isOpenConfirm ? "flex" : "hidden"
            }`}
         >
            <div className="w-1/3  h-fit">
               <ConfirmModel
                  functionConfirm={() => router.push("/profile")}
                  content={"Your changes will not be save!"}
                  isOpenConfirm={isOpenConfirm}
                  setIsOpenConfirm={setIsOpenConfirm}
               />
            </div>
         </div>
         <Toaster />
      </Layout>
   );
};

export default EditProfile;
