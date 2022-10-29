import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import API, { authAxios, endpoints } from "../API";
import Layout from "../components/Layout/Layout";
import { Store } from "../utils/Store";
import Cookies from "js-cookie";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const EditProfile = () => {
   const { state, dispatch } = useContext(Store);
   const { userInfo } = state;
   const [user, setUser] = useState<any>({});
   const [changeAvatar, setChangeAvatar] = useState(false);
   // const [defaultValues, setDefaultValues] = useState<any>([]);
   const router = useRouter();
   const {
      register,
      handleSubmit,
      watch,
      setValue,
      formState: { errors },
   } = useForm();
   const [selectedImage, setSelectedImage] = useState();
   const imageChange = (e) => {
      setSelectedImage(e.target.files[0]);
      setChangeAvatar(true);
   };
   // let defaultValues = {
   //    avatar: userInfo.avatar,
   //    firstName: userInfo.firstName,
   //    lastName: userInfo.lastName,
   //    email: userInfo.email,
   //    address: userInfo.address,
   // };
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
      setValue("address", userInfo.address);
      setValue("phone", userInfo.phone);
   }, [userInfo]);
   const submitHandler = async ({ firstName, lastName, phone, address }) => {
      const formData = new FormData();
      if (changeAvatar) {
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
      try {
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
         toast.success("Done!", {
            position: "bottom-center",
         });
         router.push("/profile");
      } catch (error) {
         toast.error("Something wrong, check again!", {
            position: "bottom-center",
         });
      }
   };
   return (
      <Layout title="Edit Profile">
         {/* <div>
            <div className="flex justify-center">
               <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-[240px] h-[240px] rounded-full"
               />
            </div>
            <div className="">
               <div>Firstname: {user.firstName}</div>
               <div>Lastname: {user.lastName}</div>
               <div>Email: {user.email}</div>
               <div>Phone: {user.phone}</div>
            </div>
         </div> */}
         <form onSubmit={handleSubmit(submitHandler)}>
            <div className="flex justify-center">
               {selectedImage ? (
                  <img
                     src={URL.createObjectURL(selectedImage)}
                     alt="Thumb"
                     className="w-[280px] h-[280px] rounded-full my-10"
                  />
               ) : (
                  <img
                     src={user.avatar}
                     alt="Thumb"
                     className="w-[280px] h-[280px] rounded-full my-10"
                  />
               )}
            </div>
            <div className="flex flex-col max-w-md mx-auto">
               <input
                  type="file"
                  name="avatar"
                  className="p-4 rounded-lg"
                  onChange={imageChange}
               />
               <label
                  htmlFor="username"
                  className="font-semibold text-left pt-5 pb-2"
               >
                  FirstName
               </label>
               <input
                  name="firstName"
                  placeholder="FirstName"
                  className="p-4 rounded-lg"
                  {...register("firstName")}
               />
               <label
                  htmlFor="username"
                  className="font-semibold text-left pt-5 pb-2"
               >
                  Lastname
               </label>
               <input
                  name="lastName"
                  placeholder="Lastname"
                  className="p-4 rounded-lg"
                  {...register("lastName")}
               />
               <label
                  htmlFor="username"
                  className="font-semibold text-left pt-5 pb-2"
               >
                  Address
               </label>
               <input
                  name="address"
                  id="address"
                  placeholder="Address"
                  className="p-4 rounded-lg"
                  {...register("address")}
               />
               <label
                  htmlFor="username"
                  className="font-semibold text-left pt-5 pb-2"
               >
                  Phone
               </label>
               <input
                  name="phone"
                  id="phone"
                  placeholder="Phone"
                  className="p-4 rounded-lg"
                  {...register("phone")}
               />
            </div>
            <button className="px-6 py-3 bg-blue-main rounded-lg font-semibold text-white hover:opacity-80 my-8">
               Change
            </button>
         </form>
         <Toaster />
      </Layout>
   );
};

export default EditProfile;
function saveSettings(settings: any): Promise<unknown> {
   throw new Error("Function not implemented.");
}
