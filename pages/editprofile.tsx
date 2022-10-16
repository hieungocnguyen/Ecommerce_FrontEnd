import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import API, { authAxios, endpoints } from "../API";
import Layout from "../components/Layout/Layout";
import { Store } from "../utils/Store";
import Cookies from "js-cookie";
import axios from "axios";

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
   }, [userInfo]);
   const submitHandler = async ({ firstName, lastName, email, address }) => {
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
      formData.append("email", email);
      formData.append("address", address);
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
         router.push("/profile");
      } catch (error) {}
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
               <img
                  src={
                     selectedImage
                        ? URL.createObjectURL(selectedImage)
                        : userInfo.avatar
                  }
                  alt="Thumb"
                  className="w-[280px] h-[280px] rounded-full my-10"
               />
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
                  defaultValue={userInfo.firstName}
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
                  defaultValue={userInfo.lastName}
                  name="lastName"
                  placeholder="Lastname"
                  className="p-4 rounded-lg"
                  {...register("lastName")}
               />
               <label
                  htmlFor="username"
                  className="font-semibold text-left pt-5 pb-2"
               >
                  Email
               </label>
               <input
                  defaultValue={userInfo.email}
                  name="email"
                  id="email"
                  placeholder="Email"
                  className="p-4 rounded-lg"
                  {...register("email")}
               />
               <label
                  htmlFor="username"
                  className="font-semibold text-left pt-5 pb-2"
               >
                  Address
               </label>
               <input
                  defaultValue={userInfo.address}
                  name="address"
                  id="address"
                  placeholder="Address"
                  className="p-4 rounded-lg"
                  {...register("address")}
               />
            </div>
            <button className="px-6 py-3 bg-blue-main rounded-lg font-semibold text-white hover:opacity-80 my-8">
               Change
            </button>
         </form>
      </Layout>
   );
};

export default EditProfile;
