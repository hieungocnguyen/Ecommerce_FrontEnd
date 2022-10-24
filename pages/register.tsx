/* eslint-disable @next/next/no-img-element */
import React, { useRef, useState } from "react";
import Layout from "../components/Layout/Layout";
import { useForm } from "react-hook-form";
import Link from "next/link";
import axios from "axios";
import API, { endpoints } from "../API";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";

const Register = () => {
   const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
   } = useForm();
   const [selectedImage, setSelectedImage] = useState();
   const router = useRouter();
   const imageChange = (e) => {
      // console.log(e.target.files[0]);

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
         console.log("password dont match");
         return;
      }
      try {
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
         toast.success("Done!", {
            position: "bottom-center",
         });
         router.push("/signin");
      } catch (error) {
         toast.error("Something wrong, check again!", {
            position: "bottom-center",
         });
      }
   };

   return (
      <Layout title="Register">
         <div className="pt-6">
            <div className="font-semibold text-2xl pt-4 pb-10">
               Create a new account
            </div>
            <form onSubmit={handleSubmit(submitHandler)}>
               <div className="flex flex-col max-w-md mx-auto">
                  <label
                     htmlFor="username"
                     className="font-semibold text-left pt-5 pb-2"
                  >
                     Username
                  </label>
                  <input
                     type="text"
                     id="username"
                     {...register("username")}
                     className="p-4 rounded-lg"
                  />
                  <label
                     htmlFor="password"
                     className="font-semibold text-left pt-5 pb-2"
                  >
                     Password
                  </label>
                  <input
                     type="password"
                     id="password"
                     {...register("password")}
                     className="p-4 rounded-lg"
                  />
                  <label
                     htmlFor="confirmPassword"
                     className="font-semibold text-left pt-5 pb-2"
                  >
                     Confirm Password
                  </label>
                  <input
                     type="password"
                     id=" confirmPassword"
                     {...register("confirmPassword")}
                     className="p-4 rounded-lg"
                  />
                  <label
                     htmlFor="confirmPassword"
                     className="font-semibold text-left pt-5 pb-2"
                  >
                     Email
                  </label>

                  <input
                     type="email"
                     id=" email"
                     {...register("email")}
                     className="p-4 rounded-lg"
                  />
                  <label
                     htmlFor="genderID"
                     className="font-semibold text-left pt-5 pb-2"
                  >
                     Gender
                  </label>
                  <input
                     type="number"
                     id=" genderID"
                     {...register("genderID")}
                     className="p-4 rounded-lg"
                  />

                  <label
                     htmlFor="avatar"
                     className="font-semibold text-left pt-5 pb-2"
                  >
                     Avatar
                  </label>
                  {selectedImage && (
                     <div className="flex justify-center">
                        <img
                           src={URL.createObjectURL(selectedImage)}
                           alt="Thumb"
                           className="w-[280px] h-[280px] rounded-full my-10"
                        />
                     </div>
                  )}
                  <input
                     type="file"
                     id="avatar"
                     className="p-4 rounded-lg"
                     onChange={imageChange}
                  />
               </div>

               <button className="bg-blue-main py-3 px-5 my-5 cursor-pointer hover:opacity-80 rounded-lg font-semibold text-white">
                  Create
               </button>
            </form>
            <Link href="/signin">
               <div className="cursor-pointer text-blue-main">
                  Back to sign in
               </div>
            </Link>
         </div>
         <Toaster />
      </Layout>
   );
};

export default Register;
