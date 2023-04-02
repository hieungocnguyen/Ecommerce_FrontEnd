import LayoutDashboard from "../../../components/Dashboard/LayoutDashboardManager";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
   FormControl,
   InputBase,
   InputLabel,
   MenuItem,
   Select,
   styled,
   TextField,
} from "@mui/material";
import React from "react";
import API, { authAxios, endpoints } from "../../../API";
import { Store } from "../../../utils/Store";
import Loader from "../../../components/Loader";
import { BiCloudUpload } from "react-icons/bi";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const CssTextField = styled(TextField)({
   "& .MuiOutlinedInput-root": {
      "& fieldset": {
         borderColor: "#525EC1",
      },
      "&:hover fieldset": {
         borderColor: "#525EC1",
      },
      "&.Mui-focused fieldset": {
         borderColor: "#525EC1",
      },
   },
});

const CreateNewPost = () => {
   // const [values, setValues] = useState({
   //    title: "",
   //    categoryID: null,
   //    sellStatusID: null,
   //    initialPrice: null,
   //    finalPrice: null,
   //    brand: null,
   //    manufacturer: null,
   //    origin: null,
   //    description: "",
   // });
   const {
      register,
      handleSubmit,
      watch,
      setValue,
      formState: { errors },
   } = useForm();
   const [selectedImage, setSelectedImage] = useState();
   const [importImage, setImportImage] = useState(false);
   const { state, dispatch } = useContext(Store);
   const { userInfo, agencyInfo } = state;
   const [loading, setLoading] = useState(false);
   const router = useRouter();

   const imageChange = (e) => {
      if (e.target.files[0] === undefined) {
         setImportImage(false);
      } else {
         setSelectedImage(e.target.files[0]);
         setImportImage(true);
      }
   };

   useEffect(() => {}, []);

   const handleCreatePost = async ({
      title,
      categoryID,
      sellStatusID,
      brand,
      origin,
      manufacturer,
      finalPrice,
      initialPrice,
      description,
   }) => {
      const formData = new FormData();
      let imageURL =
         "https://res.cloudinary.com/ngnohieu/image/upload/v1678612328/avatar2Artboard_1-100_impj99.jpg";
      if (selectedImage === undefined) {
         toast.error("Please upload an avatar for this post! ", {
            position: "top-center",
         });
         return;
      }
      try {
         setLoading(true);
         if (importImage) {
            formData.append("title", title);
            formData.append("categoryID", categoryID);
            formData.append("sellStatusID", sellStatusID);
            formData.append("brand", brand);
            formData.append("origin", origin);
            formData.append("manufacturer", manufacturer);
            formData.append("finalPrice", finalPrice);
            formData.append("initialPrice", initialPrice);
            formData.append("description", description);

            const resUploadCloudinary = await API.post(
               endpoints["upload_cloudinary"],
               { file: selectedImage },
               {
                  headers: {
                     "Content-Type": "multipart/form-data",
                  },
               }
            );
            imageURL = resUploadCloudinary.data.data;
            formData.append("avatar", imageURL);
         }

         const resCreate = await authAxios().post(
            endpoints["create_salePost"](agencyInfo.id),
            formData,
            {
               headers: {
                  "Content-Type": "application/json",
               },
            }
         );

         if (resCreate.data.code == "201") {
            setLoading(false);
            router.push("/DashboardManager/posts");
         }
      } catch (error) {
         setLoading(false);
         toast.error("Something wrong, try it later", {
            position: "top-center",
         });
         console.log(error);
      }
   };
   return (
      <LayoutDashboard title="Create new post">
         <div className="w-[90%] mx-auto">
            <div className="font-semibold text-2xl my-8">Create a new post</div>
            <form
               className="grid grid-cols-4 gap-8"
               onSubmit={handleSubmit(handleCreatePost)}
            >
               <div className="col-span-1 dark:bg-neutral-800 bg-light-spot rounded-lg flex flex-col items-center h-fit py-8">
                  <div className="font-semibold text-lg mb-2">Avatar</div>
                  <div className="">
                     <div className="relative overflow-hidden w-32 h-32 rounded-xl">
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
                           className={`absolute w-full h-full top-0 dark:hover:bg-dark-primary hover:bg-light-primary hover:opacity-90 opacity-0  z-20 cursor-pointer `}
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
               </div>
               <div className="col-span-3 dark:bg-neutral-800 bg-light-spot rounded-lg p-8">
                  <div className="grid grid-cols-12 gap-4 font-medium">
                     <div className="col-span-12">
                        <label htmlFor="title" className="pl-2 text-sm">
                           Title
                        </label>
                        <input
                           type="text"
                           id="title"
                           minLength={20}
                           {...register("title")}
                           required
                           placeholder="Title"
                           className="w-full p-3 rounded-lg bg-light-bg dark:bg-dark-bg"
                        />
                     </div>
                     <div className="col-span-6">
                        <label htmlFor="category" className="pl-2 text-sm">
                           Category
                        </label>
                        <select
                           id="category"
                           name="categoryID"
                           {...register("categoryID")}
                           className="w-full p-3 rounded-lg bg-light-bg dark:bg-dark-bg"
                           title="category"
                        >
                           <option value={1}>Moms, Kids & Babies</option>
                           <option value={2}>Consumer Electronics</option>
                           <option value={3}>Fashion</option>
                           <option value={4}>Home & Living</option>
                           <option value={5}>Shoes</option>
                           <option value={6}>Grocery</option>
                           <option value={7}>Computer & Accessories</option>
                           <option value={8}>Mobile & Gadgets</option>
                           <option value={9}>Sport & Outdoor</option>
                           <option value={10}>Books & Stationery</option>
                           <option value={11}>Home Appliances</option>
                           <option value={12}>Cameras</option>
                           <option value={13}>Watches</option>
                           <option value={14}>Automotive</option>
                        </select>
                     </div>
                     <div className="col-span-6">
                        <label htmlFor="sellStatus" className="pl-2 text-sm">
                           Sell Status
                        </label>
                        <select
                           id="sellStatusID"
                           name="sellStatusID"
                           {...register("sellStatusID")}
                           className="w-full p-3 rounded-lg bg-light-bg dark:bg-dark-bg"
                           title="Sell Status"
                        >
                           <option value={1}>IN STOCK</option>
                           <option value={2}>BEST SELLER</option>
                           <option value={3}>PROMOTION</option>
                           <option value={4}>SUPER SALE</option>
                           <option value={5}>FREE SHIP</option>
                           <option value={6}>TRENDING</option>
                        </select>
                     </div>
                     <div className="col-span-4">
                        <label htmlFor="brand" className="pl-2 text-sm">
                           Brand
                        </label>
                        <input
                           type="text"
                           id="brand"
                           {...register("brand")}
                           required
                           placeholder="Brand"
                           className="w-full p-3 rounded-lg bg-light-bg dark:bg-dark-bg"
                        />
                     </div>
                     <div className="col-span-4">
                        <label htmlFor="manufacturer" className="pl-2 text-sm">
                           Manufacturer
                        </label>
                        <input
                           type="text"
                           id="manufacturer"
                           {...register("manufacturer")}
                           required
                           placeholder="Manufacturer"
                           className="w-full p-3 rounded-lg bg-light-bg dark:bg-dark-bg"
                        />
                     </div>
                     <div className="col-span-4">
                        <label htmlFor="origin" className="pl-2 text-sm">
                           Origin
                        </label>
                        <input
                           type="text"
                           id="origin"
                           {...register("origin")}
                           required
                           placeholder="Origin"
                           className="w-full p-3 rounded-lg bg-light-bg dark:bg-dark-bg"
                        />
                     </div>
                     <div className="col-span-6">
                        <label htmlFor="finalPrice" className="pl-2 text-sm">
                           Final Price
                        </label>
                        <input
                           type="number"
                           id="finalPrice"
                           {...register("finalPrice")}
                           required
                           placeholder="Final Price"
                           className="w-full p-3 rounded-lg bg-light-bg dark:bg-dark-bg"
                        />
                     </div>
                     <div className="col-span-6">
                        <label htmlFor="initialPrice" className="pl-2 text-sm">
                           Initial Price
                        </label>
                        <input
                           type="number"
                           id="initialPrice"
                           {...register("initialPrice")}
                           required
                           placeholder="Initial Price"
                           className="w-full p-3 rounded-lg bg-light-bg dark:bg-dark-bg"
                        />
                     </div>
                     <div className="col-span-12">
                        <label htmlFor="description" className="pl-2 text-sm">
                           Description
                        </label>
                        <input
                           type="text"
                           id="description"
                           {...register("description")}
                           required
                           placeholder="Description"
                           className="w-full p-3 rounded-lg bg-light-bg dark:bg-dark-bg"
                        />
                     </div>
                     <div className=" col-span-12 flex justify-end">
                        <button
                           className="py-3 px-6 bg-blue-main hover:shadow-lg hover:shadow-blue-main rounded-lg font-semibold text-white"
                           type="submit"
                           title="Create a new sale post"
                        >
                           Create new sale post
                        </button>
                     </div>
                  </div>
               </div>
               {loading ? <Loader /> : <></>}
            </form>
         </div>
      </LayoutDashboard>
   );
};

// export default CreateNewPost;
export default dynamic(() => Promise.resolve(CreateNewPost), { ssr: false });
