/* eslint-disable @next/next/no-img-element */
import React, { useRef, useState } from "react";
import Layout from "../components/Layout/Layout";
import { useForm } from "react-hook-form";
import Link from "next/link";
import axios from "axios";
import API, { endpoints } from "../API";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../components/Loader";
import { BiArrowBack, BiCloudUpload } from "react-icons/bi";
import Image from "next/image";

const Register = () => {
   const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
   } = useForm();
   const [selectedImage, setSelectedImage] = useState();
   const router = useRouter();
   let [loading, setLoading] = useState(false);
   const imageChange = (e) => {
      setSelectedImage(e.target.files[0]);
   };
   const submitHandler = async ({
      username,
      email,
      password,
      confirmPassword,
      genderID,
   }) => {
      const formData = new FormData();

      if (password !== confirmPassword) {
         toast.error(" Confirm password does not match, check again!", {
            position: "bottom-center",
         });
         return;
      }
      try {
         setLoading(true);
         if (selectedImage) {
            const resUploadCloudinary = await API.post(
               endpoints["upload_cloudinary"],
               { file: selectedImage },
               {
                  headers: {
                     "Content-Type": "multipart/form-data",
                  },
               }
            );
            // console.log(resUploadCloudinary.data.data);
            formData.append("avatar", resUploadCloudinary.data.data);
         }
         formData.append("username", username);
         formData.append("password", password);
         formData.append("rePassword", confirmPassword);
         formData.append("genderID", genderID);
         formData.append("email", email);

         const resRegister = await axios.post(
            "http://localhost:8080/ou-ecommerce/api/user/register",
            formData,
            {
               headers: {
                  "Content-Type": "application/json",
               },
            }
         );

         if (resRegister) {
            setLoading(false);
            router.push({
               pathname: "/",
               query: {
                  route: "fromregister",
               },
            });
            toast.success("Done!", {
               position: "bottom-center",
            });
         }
      } catch (error) {
         console.log(error.response.data.data);

         if (error.response.data.data.username) {
            toast.error(`Username:${error.response.data.data.username}`, {
               position: "bottom-center",
            });
         }
         if (error.response.data.data.email) {
            toast.error(`Email:${error.response.data.data.email}`, {
               position: "bottom-center",
            });
         }
         if (error.response.data.data.password) {
            toast.error(`Password:${error.response.data.data.password}`, {
               position: "bottom-center",
            });
         }
         if (error.response.data.data.rePassword) {
            toast.error(`Repassword: ${error.response.data.data.rePassword}`, {
               position: "bottom-center",
            });
         }
         if (error.response.data.data.avatar) {
            toast.error(`Avatar: ${error.response.data.data.avatar}`, {
               position: "bottom-center",
            });
         }
         setLoading(false);
      }
   };

   return (
      <Layout title="Register">
         <div className="flex gap-4 items-center m-8">
            <Link href={"/signin"}>
               <div className="bg-blue-main text-white p-3 text-2xl rounded-lg cursor-pointer hover:shadow-lg hover:shadow-blue-main">
                  <BiArrowBack />
               </div>
            </Link>
            <div className="font-semibold text-2xl">Register a new account</div>
         </div>
         <form
            onSubmit={handleSubmit(submitHandler)}
            className="grid grid-cols-12 gap-8 mx-48 mb-12"
         >
            <div className="col-span-4">
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
                     className={`absolute w-full h-full top-0 left-0 hover:bg-dark-primary hover:opacity-90 opacity-0  z-20 cursor-pointer`}
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
                     />
                  </label>
               </div>
            </div>
            <div className="col-span-8 mx-20">
               <div className="text-left">
                  <div className="mb-4">
                     <label htmlFor="username" className="font-semibold">
                        Username
                     </label>
                     <input
                        type="text"
                        id="username"
                        {...register("username")}
                        className="p-4 rounded-lg bg-light-primary dark:bg-dark-primary w-full"
                     />
                  </div>
                  <div className="mb-4">
                     <label htmlFor="password" className="font-semibold">
                        Password
                     </label>
                     <input
                        type="password"
                        id="password"
                        {...register("password")}
                        className="p-4 rounded-lg bg-light-primary dark:bg-dark-primary w-full"
                     />
                  </div>
                  <div className="mb-4">
                     <label htmlFor="confirmPassword" className="font-semibold">
                        Confirm Password
                     </label>
                     <input
                        type="password"
                        id=" confirmPassword"
                        {...register("confirmPassword")}
                        className="p-4 rounded-lg bg-light-primary dark:bg-dark-primary w-full"
                     />
                  </div>
                  <div className="mb-4">
                     <label htmlFor="confirmPassword" className="font-semibold">
                        Email
                     </label>
                     <input
                        type="email"
                        id=" email"
                        {...register("email")}
                        className="p-4 rounded-lg bg-light-primary dark:bg-dark-primary w-full"
                     />
                  </div>
                  <div className="mb-4">
                     <label htmlFor="genderID" className="font-semibold">
                        Gender
                     </label>
                     <select
                        name="cars"
                        id="cars"
                        {...register("genderID")}
                        className="p-4 rounded-lg bg-light-primary dark:bg-dark-primary w-full"
                     >
                        <option value={1}>Male</option>
                        <option value={2}>Female</option>
                        <option value={3}>Undefined</option>
                     </select>
                  </div>
               </div>
            </div>
            <div className="col-span-12">
               <button
                  className="bg-blue-main p-3 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-blue-main"
                  type="submit"
               >
                  Register a new account
               </button>
            </div>
         </form>
         {loading ? <Loader /> : <></>}
         <Toaster />
      </Layout>
   );
};

export default Register;
