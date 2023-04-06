/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from "react";
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
import { log } from "console";
import { ClipLoader } from "react-spinners";

const Register = () => {
   const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
   } = useForm();
   const [province, setProvince] = useState([]);
   const [district, setDistrict] = useState([]);
   const [ward, setWard] = useState([]);
   const [street, setStreet] = useState("empty");
   const [address, setAddress] = useState("");
   const [wardID, setWardID] = useState(0);
   const [selectedImage, setSelectedImage] = useState();
   const router = useRouter();
   const [loading, setLoading] = useState(false);
   const [importImage, setImportImage] = useState(false);
   const [isFetching, setIsFetching] = useState(false);

   const fetchProvinceAll = async () => {
      const res = await API.get(
         "http://localhost:8080/ou-ecommerce/api/location/provinces/all"
      );

      if (res.data.code === "200") {
         setIsFetching(true);
      }
      setProvince(res.data.data);
   };
   const handleSelectProvince = (provinceID: string) => {
      const fetchDistrictByProvinceID = async (provinceID) => {
         const res = await API.get(
            `http://localhost:8080/ou-ecommerce/api/location/districts/get-districts-by-province-id/${provinceID}`
         );
         setDistrict(res.data.data);
         setWard([]);
         setStreet("empty");
      };
      fetchDistrictByProvinceID(provinceID);
   };
   const handleSelectDistrict = (districtID: string) => {
      const fetchWardByDistrictID = async (districtID) => {
         const res = await API.get(
            `http://localhost:8080/ou-ecommerce/api/location/wards/get-wards-by-district-id/${districtID}`
         );
         setWard(res.data.data);
         setStreet("empty");
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
         setSelectedImage(e.target.files[0]);
         setImportImage(true);
      }
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
            position: "top-center",
         });
         return;
      }
      if (selectedImage === undefined) {
         toast.error("Please upload an avatar! ", {
            position: "top-center",
         });
         return;
      }

      try {
         setLoading(true);
         if (wardID !== 0) {
            const resGetLocation = await API.get(
               endpoints["get_full_address"](wardID)
            );

            let address = resGetLocation.data.data;
            formData.append("address", address);
         }

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
            toast.success("Register successful", {
               position: "top-center",
            });
         }
      } catch (error) {
         console.log(error);
         if (
            error.request.responseURL ===
            "http://localhost:8080/ou-ecommerce/api/user/register"
         ) {
            if (error.response.data.data.username) {
               toast.error(`Username:${error.response.data.data.username}`, {
                  position: "top-center",
               });
            }
            if (error.response.data.data.email) {
               toast.error(`Email:${error.response.data.data.email}`, {
                  position: "top-center",
               });
            }
            if (error.response.data.data.password) {
               toast.error(`Password:${error.response.data.data.password}`, {
                  position: "top-center",
               });
            }
            if (error.response.data.data.rePassword) {
               toast.error(
                  `Repassword: ${error.response.data.data.rePassword}`,
                  {
                     position: "top-center",
                  }
               );
            }
            if (error.response.data.data.avatar) {
               toast.error(`Avatar: ${error.response.data.data.avatar}`, {
                  position: "top-center",
               });
            }
         }

         setLoading(false);
      }
   };

   return (
      <Layout title="Register">
         <div className="flex gap-4 items-center m-6">
            <div
               className="bg-blue-main text-white p-3 text-2xl rounded-lg cursor-pointer hover:shadow-lg hover:shadow-blue-main"
               onClick={() => router.back()}
            >
               <BiArrowBack />
            </div>
            <div className="font-semibold text-2xl">
               / Register a new account
            </div>
         </div>
         {isFetching ? (
            <>
               <form
                  onSubmit={handleSubmit(submitHandler)}
                  className="grid grid-cols-12 gap-8 mx-40 mb-12"
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
                           />
                        </label>
                     </div>
                  </div>
                  <div className="col-span-9 font-semibold">
                     <div className="text-left">
                        <div className="grid grid-cols-12 gap-4">
                           <div className="col-span-12">
                              <label
                                 htmlFor="username"
                                 className="font-semibold"
                              >
                                 Username*
                              </label>
                              <input
                                 type="text"
                                 id="username"
                                 placeholder="Username*"
                                 required
                                 {...register("username")}
                                 className="p-4 rounded-lg bg-light-primary dark:bg-dark-primary w-full font-semibold"
                              />
                           </div>
                           <div className="col-span-6">
                              <label
                                 htmlFor="password"
                                 className="font-semibold"
                              >
                                 Password*
                              </label>
                              <input
                                 type="password"
                                 id="password"
                                 placeholder="Password*"
                                 required
                                 {...register("password")}
                                 className="p-4 rounded-lg bg-light-primary dark:bg-dark-primary w-full"
                              />
                           </div>
                           <div className="col-span-6">
                              <label
                                 htmlFor="confirmPassword"
                                 className="font-semibold"
                              >
                                 Confirm Password*
                              </label>
                              <input
                                 type="password"
                                 id=" confirmPassword"
                                 placeholder="Confirm Password*"
                                 required
                                 {...register("confirmPassword")}
                                 className="p-4 rounded-lg bg-light-primary dark:bg-dark-primary w-full "
                              />
                           </div>
                           <div className="col-span-6">
                              <label htmlFor="email" className="font-semibold">
                                 Email*
                              </label>
                              <input
                                 type="email"
                                 id=" email"
                                 placeholder="Email*"
                                 required
                                 {...register("email")}
                                 className="p-4 rounded-lg bg-light-primary dark:bg-dark-primary w-full"
                              />
                           </div>
                           <div className="col-span-6 mb-4">
                              <label
                                 htmlFor="genderID"
                                 className="font-semibold"
                              >
                                 Gender*
                              </label>
                              <select
                                 name="cars"
                                 id="cars"
                                 placeholder="Gender*"
                                 required
                                 {...register("genderID")}
                                 className="p-4 rounded-lg bg-light-primary dark:bg-dark-primary w-full font-semibold"
                              >
                                 <option value="" className="hidden">
                                    -Choose your gender-
                                 </option>
                                 <option value={1}>Male</option>
                                 <option value={2}>Female</option>
                                 <option value={3}>Other</option>
                              </select>
                           </div>
                           <div className="col-span-4">
                              <label
                                 htmlFor="province"
                                 className="font-semibold"
                              >
                                 Province
                              </label>
                              <select
                                 id="province"
                                 className="bg-light-primary dark:bg-dark-primary p-4 rounded-lg w-full font-semibold focus:outline-blue-main disabled:cursor-not-allowed"
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
                           <div className="col-span-4">
                              <label
                                 htmlFor="district"
                                 className="font-semibold"
                              >
                                 District
                              </label>
                              <select
                                 id="district"
                                 className="bg-light-primary dark:bg-dark-primary p-4 rounded-lg w-full font-semibold focus:outline-blue-main disabled:cursor-not-allowed"
                                 onChange={(e) =>
                                    handleSelectDistrict(e.target.value)
                                 }
                                 disabled={district.length > 0 ? false : true}
                              >
                                 <option value={0} className="hidden">
                                    Select District
                                 </option>
                                 {district.map((p) => (
                                    <option
                                       key={p.districtID}
                                       value={p.districtID}
                                    >
                                       {p.districtName}
                                    </option>
                                 ))}
                              </select>
                           </div>
                           <div className="col-span-4">
                              <label htmlFor="ward" className="font-semibold">
                                 Ward
                              </label>
                              <select
                                 id="ward"
                                 className="bg-light-primary dark:bg-dark-primary p-4 rounded-lg w-full font-semibold focus:outline-blue-main disabled:cursor-not-allowed"
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
                           <div className="col-span-12">
                              <label htmlFor="street" className="font-semibold">
                                 Street
                              </label>
                              <input
                                 {...register("street")}
                                 id="street"
                                 name="street"
                                 required
                                 type="text"
                                 placeholder="Street"
                                 className="bg-light-primary dark:bg-dark-primary p-4 rounded-lg w-full font-semibold focus:outline-blue-main disabled:cursor-not-allowed"
                                 disabled={street == "" ? false : true}
                              />
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="col-span-12">
                     <button
                        className="bg-blue-main p-3 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-blue-main transition-all"
                        type="submit"
                     >
                        Register a new account
                     </button>
                  </div>
               </form>
            </>
         ) : (
            <div>
               <div className="flex justify-center my-8">
                  <ClipLoader size={35} color="#FF8500" />
               </div>
            </div>
         )}
         {/* <form
            onSubmit={handleSubmit(submitHandler)}
            className="grid grid-cols-12 gap-8 mx-40 mb-12"
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
                     />
                  </label>
               </div>
            </div>
            <div className="col-span-9 font-semibold">
               <div className="text-left">
                  <div className="grid grid-cols-12 gap-4">
                     <div className="col-span-12">
                        <label htmlFor="username" className="font-semibold">
                           Username
                        </label>
                        <input
                           type="text"
                           id="username"
                           required
                           {...register("username")}
                           className="p-4 rounded-lg bg-light-primary dark:bg-dark-primary w-full font-semibold"
                        />
                     </div>
                     <div className="col-span-6">
                        <label htmlFor="password" className="font-semibold">
                           Password
                        </label>
                        <input
                           type="password"
                           id="password"
                           required
                           {...register("password")}
                           className="p-4 rounded-lg bg-light-primary dark:bg-dark-primary w-full"
                        />
                     </div>
                     <div className="col-span-6">
                        <label
                           htmlFor="confirmPassword"
                           className="font-semibold"
                        >
                           Confirm Password
                        </label>
                        <input
                           type="password"
                           id=" confirmPassword"
                           required
                           {...register("confirmPassword")}
                           className="p-4 rounded-lg bg-light-primary dark:bg-dark-primary w-full "
                        />
                     </div>
                     <div className="col-span-6">
                        <label htmlFor="email" className="font-semibold">
                           Email
                        </label>
                        <input
                           type="email"
                           id=" email"
                           required
                           {...register("email")}
                           className="p-4 rounded-lg bg-light-primary dark:bg-dark-primary w-full"
                        />
                     </div>
                     <div className="col-span-6">
                        <label htmlFor="genderID" className="font-semibold">
                           Gender
                        </label>
                        <select
                           name="cars"
                           id="cars"
                           required
                           {...register("genderID")}
                           className="p-4 rounded-lg bg-light-primary dark:bg-dark-primary w-full "
                        >
                           <option value="" className="hidden">
                              -Choose your gender-
                           </option>
                           <option value={1}>Male</option>
                           <option value={2}>Female</option>
                           <option value={3}>Other</option>
                        </select>
                     </div>
                     <div className="col-span-4">
                        <label htmlFor="province" className="font-semibold">
                           Province
                        </label>
                        <select
                           id="province"
                           className="bg-light-primary dark:bg-dark-primary p-4 rounded-lg w-full font-medium focus:outline-blue-main disabled:cursor-not-allowed"
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
                     <div className="col-span-4">
                        <label htmlFor="district" className="font-semibold">
                           District
                        </label>
                        <select
                           id="district"
                           className="bg-light-primary dark:bg-dark-primary p-4 rounded-lg w-full font-medium focus:outline-blue-main disabled:cursor-not-allowed"
                           onChange={(e) =>
                              handleSelectDistrict(e.target.value)
                           }
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
                     <div className="col-span-4">
                        <label htmlFor="ward" className="font-semibold">
                           Ward
                        </label>
                        <select
                           id="ward"
                           className="bg-light-primary dark:bg-dark-primary p-4 rounded-lg w-full font-medium focus:outline-blue-main disabled:cursor-not-allowed"
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
                     <div className="col-span-12">
                        <label htmlFor="street" className="font-semibold">
                           Street
                        </label>
                        <input
                           {...register("street")}
                           id="street"
                           name="street"
                           required
                           type="text"
                           placeholder="Street"
                           className="bg-light-primary dark:bg-dark-primary p-4 rounded-lg w-full font-medium focus:outline-blue-main disabled:cursor-not-allowed"
                           disabled={street == "" ? false : true}
                        />
                     </div>
                  </div>
               </div>
            </div>
            <div className="col-span-12">
               <button
                  className="bg-blue-main p-3 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-blue-main transition-all"
                  type="submit"
               >
                  Register a new account
               </button>
            </div>
         </form> */}
         {loading ? <Loader /> : <></>}
         <Toaster />
      </Layout>
   );
};

export default Register;
