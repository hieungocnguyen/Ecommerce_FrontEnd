import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import API, { authAxios, endpoints } from "../API";
import Layout from "../components/Layout/Layout";
import Loader from "../components/Loader";
import { Store } from "../utils/Store";
import Cookies from "js-cookie";
import { log } from "console";

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
               avatar: resUploadCloudinary.data.data,
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
            router.push("/profile");
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
                  className="rounded-full my-10 object-cover"
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
                  className="p-4 rounded-lg w-full bg-light-primary dark:bg-dark-primary"
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
                  className="p-4 rounded-lg bg-light-primary dark:bg-dark-primary"
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
                  className="p-4 rounded-lg bg-light-primary dark:bg-dark-primary"
                  onChange={(e) => {
                     setAddress(e.target.value);
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
                  className="p-4 rounded-lg bg-light-primary dark:bg-dark-primary"
                  onChange={(e) => {
                     setHotline(e.target.value);
                  }}
               />
            </div>
            <div className="grid grid-cols-2 items-center gap-4 mt-4">
               <label htmlFor="fields" className="font-semibold text-left pl-4">
                  Field
               </label>
               <select
                  name="fields"
                  id="fields"
                  className="p-4 rounded-lg bg-light-primary dark:bg-dark-primary"
                  onChange={(e) => {
                     setField(Number(e.target.value));
                  }}
               >
                  <option value={1}>Thời trang</option>
                  <option value={2}>Dược phẩm</option>
                  <option value={3}>Đồ gia dụng</option>
                  <option value={4}>Đồ handmade - Mỹ nghệ</option>
                  <option value={5}>Thực phẩm</option>
                  <option value={6}>Phụ kiện công nghệ</option>
                  <option value={7}>Đồ chơi trẻ emc</option>
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
