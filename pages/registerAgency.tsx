import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import API, { authAxios, endpoints } from "../API";
import Layout from "../components/Layout/Layout";
import Loader from "../components/Loader";
import { Store } from "../utils/Store";
import Cookies from "js-cookie";

const RegisterAgency = () => {
   const [selectedImage, setSelectedImage] = useState();
   const [name, setName] = useState("");
   const [avatar, setAvatar] = useState("");
   const [address, setAddress] = useState("");
   const [hotline, setHotline] = useState("");
   const [field, setField] = useState(1);
   const { state, dispatch } = useContext(Store);
   const { userInfo } = state;
   const router = useRouter();
   let [loading, setLoading] = useState(false);
   const imageChange = (e) => {
      setSelectedImage(e.target.files[0]);
   };

   const handleRegister = async (e) => {
      setLoading(true);
      e.preventDefault();
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
         setAvatar(resUploadCloudinary.data.data);
         const resRegister = await authAxios().post(
            endpoints["register_agency"],
            {
               address: address,
               avatar: avatar,
               fieldID: field,
               hotline: hotline,
               managerID: userInfo.id,
               name: name,
            }
         );
         const dataCurrentUser = await axios.get(
            "http://localhost:8080/ou-ecommerce/api/user/current-user",
            {
               headers: {
                  Authorization: `Bearer ${Cookies.get("accessToken")}`,
               },
            }
         );

         Cookies.set("userInfo", JSON.stringify(dataCurrentUser.data.data));
         dispatch({ type: "USER_LOGIN", payload: dataCurrentUser.data.data });
         if (resRegister) {
            setLoading(false);
            router.push("/");
         }
      } catch (error) {
         console.log(error);
      }
   };
   return (
      <Layout title="Register Agency">
         <div className="font-semibold text-2xl pt-4 pb-10">
            Register Agency
         </div>
         <form className="w-[600px] mx-auto" onSubmit={handleRegister}>
            <div className="flex justify-center">
               <Image
                  src={
                     selectedImage
                        ? URL.createObjectURL(selectedImage)
                        : "https://t4.ftcdn.net/jpg/03/59/58/91/360_F_359589186_JDLl8dIWoBNf1iqEkHxhUeeOulx0wOC5.jpg"
                  }
                  alt="Avatar"
                  width={250}
                  height={250}
                  className="rounded-full my-10"
               />
            </div>

            <div className="grid grid-cols-2 items-center gap-4 mt-4">
               <label
                  htmlFor="avatar"
                  className="font-semibold text-left pl-4 "
               >
                  Avatar
               </label>
               <input
                  type="file"
                  id="avatar"
                  className="p-4 rounded-lg w-full"
                  onChange={imageChange}
               />
            </div>
            <div className="grid grid-cols-2 items-center gap-4 mt-4">
               <label htmlFor="name" className="font-semibold text-left pl-4 ">
                  Name
               </label>
               <input
                  type="text"
                  id="name"
                  className="p-4 rounded-lg"
                  onChange={(e) => {
                     setName(e.target.value);
                  }}
               />
            </div>
            <div className="grid grid-cols-2 items-center gap-4 mt-4">
               <label
                  htmlFor="address"
                  className="font-semibold text-left pl-4 "
               >
                  Address
               </label>
               <input
                  type="text"
                  id="address"
                  className="p-4 rounded-lg"
                  onChange={(e) => {
                     setAddress(e.target.value);
                  }}
               />
            </div>
            <div className="grid grid-cols-2 items-center gap-4 mt-4">
               <label htmlFor="field" className="font-semibold text-left pl-4 ">
                  Field
               </label>
               <input
                  type="number"
                  id="field"
                  className="p-4 rounded-lg"
                  onChange={(e) => {
                     setField(Number(e.target.value));
                  }}
               />
            </div>
            <div className="grid grid-cols-2 items-center gap-4 mt-4">
               <label
                  htmlFor="hotline"
                  className="font-semibold text-left pl-4 "
               >
                  Hotline
               </label>
               <input
                  type="text"
                  id="hotline"
                  className="p-4 rounded-lg"
                  onChange={(e) => {
                     setHotline(e.target.value);
                  }}
               />
            </div>
            <div className="my-8">
               <button
                  className="p-4 bg-blue-main text-white font-semibold rounded-lg hover:opacity-80"
                  type="submit"
               >
                  Register
               </button>
            </div>
            {loading ? <Loader /> : <></>}
         </form>
      </Layout>
   );
};

export default RegisterAgency;
