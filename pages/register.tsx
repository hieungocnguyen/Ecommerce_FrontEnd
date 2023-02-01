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
            router.push("/signin");
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
                     className="p-4 rounded-lg bg-light-primary dark:bg-dark-primary"
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
                     className="p-4 rounded-lg bg-light-primary dark:bg-dark-primary"
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
                     className="p-4 rounded-lg bg-light-primary dark:bg-dark-primary"
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
                     className="p-4 rounded-lg bg-light-primary dark:bg-dark-primary"
                  />
                  <label
                     htmlFor="genderID"
                     className="font-semibold text-left pt-5 pb-2"
                  >
                     Gender
                  </label>
                  <select
                     name="cars"
                     id="cars"
                     {...register("genderID")}
                     className="p-4 rounded-lg bg-light-primary dark:bg-dark-primary"
                  >
                     <option value={1}>Male</option>
                     <option value={2}>Female</option>
                     <option value={3}>Undefined</option>
                  </select>

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
                           className="w-[280px] h-[280px] rounded-full my-10 object-cover"
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
         {loading ? <Loader /> : <></>}
         <Toaster />
      </Layout>
   );
};

export default Register;
