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

   const imageChange = (e) => {
      if (e.target.files[0] === undefined) {
         setImportImage(false);
      } else {
         setSelectedImage(e.target.files[0]);
         setImportImage(true);
      }
   };
   useEffect(() => {
      const loadUser = async () => {
         const resUser = await API.get(endpoints["user"](userInfo.id));
         setUser(resUser.data.data);
      };
      if (userInfo) {
         loadUser();
      }
      setValue("firstName", userInfo.firstName);
      setValue("lastName", userInfo.lastName);
      setValue("phone", userInfo.phone);
   }, [userInfo]);

   useEffect(() => {
      setValue("address", address ? address : userInfo.address);
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

         formData.append("firstName", firstName);
         formData.append("lastName", lastName);
         formData.append("address", address);
         formData.append("phone", phone);

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
               className="bg-blue-main text-white p-3 text-2xl rounded-lg cursor-pointer hover:shadow-lg hover:shadow-blue-main transition-all"
               onClick={() => router.push("/profile")}
            >
               <BiArrowBack />
            </div>
            <div className="font-semibold text-2xl">/ Edit profile</div>
         </div>
         <form
            onSubmit={handleSubmit(submitHandler)}
            className="grid grid-cols-12 gap-12 mx-24 items-center"
         >
            <div className="col-span-3 relative overflow-hidden w-full aspect-square rounded-full">
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
                     onChange={imageChange}
                  />
               </label>
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
                              className="col-span-11 p-4 rounded-lg w-full"
                              {...register("address")}
                           />
                           <button
                              className="col-span-1 border-2 border-blue-main rounded-lg text-2xl text-blue-main flex justify-center items-center hover:bg-blue-main hover:text-white"
                              type="button"
                              onClick={() => setIsOpenAddressSelect(true)}
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
                  className="px-6 py-3 bg-blue-main rounded-lg font-semibold text-white hover:shadow-lg transition-all hover:shadow-blue-main my-8"
                  type="submit"
               >
                  Save the changes
               </button>
            </div>
         </form>
         <div
            className={`fixed top-0 right-0 w-full h-screen backdrop-blur-sm items-center justify-center z-20 ${
               isOpenAddressSelect ? "flex" : "hidden"
            }`}
         >
            <div className="w-3/5 h-fit">
               <AddressSelect
                  setAddress={setAddress}
                  setIsOpenAddressSelect={setIsOpenAddressSelect}
               />
            </div>
         </div>
         {loading ? <Loader /> : <></>}
         <Toaster />
      </Layout>
   );
};

export default EditProfile;
