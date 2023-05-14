import LayoutDashboard from "../../../components/Dashboard/LayoutDashboardManager";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import React from "react";
import API, { authAxios, endpoints } from "../../../API";
import { Store } from "../../../utils/Store";
import Loader from "../../../components/Loader";
import { BiCloudUpload } from "react-icons/bi";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
// import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { title } from "process";

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
   ssr: false,
   loading: () => <p>Loading ...</p>,
});

const CreateNewPost = () => {
   const {
      register,
      handleSubmit,
      watch,
      setValue,
      setError,
      clearErrors,
      formState: { errors },
   } = useForm();
   const [selectedImage, setSelectedImage] = useState();
   const [importImage, setImportImage] = useState(false);
   const { state, dispatch } = useContext(Store);
   const { userInfo, agencyInfo } = state;
   const [loading, setLoading] = useState(false);
   const [initialPrice, setInitialPrice] = useState("");
   const [finalPrice, setFinalPrice] = useState("");
   const [description, setDescription] = useState("");
   const router = useRouter();
   const WatchErrorTitle = watch("title");
   const [categoryList, setCategoryList] = useState<any>([]);

   const imageChange = (e) => {
      if (e.target.files[0] === undefined) {
         setImportImage(false);
      } else {
         // size < 2MB
         if (e.target.files[0].size <= 2097152) {
            setSelectedImage(e.target.files[0]);
            setImportImage(true);
         } else {
            setImportImage(false);
            toast.error("Maximum upload size is 2MB, please try other image");
         }
      }
   };

   const fetchCategory = async () => {
      const res = await API.get(endpoints["category_all"]);
      setCategoryList(res.data.data);
   };
   useEffect(() => {
      fetchCategory();
   }, []);

   const currencyFormat = (e) => {
      let value = e.target.value;
      value = value.replace(/\D/g, "");
      value = value.replace(/(\d)(\d{3})$/, "$1.$2");
      value = value.replace(/(?=(\d{3})+(\D))\B/g, ".");
      e.target.value = value;
      return e;
   };

   const handleCreatePost = async ({
      title,
      categoryID,
      sellStatusID,
      brand,
      origin,
      manufacturer,
      // description,
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
            formData.append(
               "finalPrice",
               finalPrice.replace(/[^a-zA-Z0-9 ]/g, "")
            );
            formData.append(
               "initialPrice",
               initialPrice.replace(/[^a-zA-Z0-9 ]/g, "")
            );
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
               <div className="col-span-1 rounded-lg flex flex-col items-center h-fit">
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
                        className={`absolute w-full h-full top-0 dark:hover:bg-dark-primary hover:bg-light-primary hover:opacity-90 opacity-0 z-20 cursor-pointer `}
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
                           accept="image/png, image/jpeg"
                        />
                     </label>
                  </div>
                  <div className="mt-2 text-gray-500 font-medium text-sm italic">
                     *Maximum image size 2MB
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
                           onBlur={(e) => {
                              if (e.target.value.length < 20) {
                                 setError("title", { type: "focus" });
                              } else {
                                 clearErrors("title");
                              }
                           }}
                        />
                        {errors.title &&
                           WatchErrorTitle.length < 20 &&
                           WatchErrorTitle.length > 0 && (
                              <p className="text-sm text-red-500 pl-2">
                                 Title must be at least 20 characters
                              </p>
                           )}
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
                           {categoryList.map((category) => (
                              <option value={category.id} key={category.id}>
                                 {category.name}
                              </option>
                           ))}
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
                           type="text"
                           id="finalPrice"
                           value={finalPrice}
                           onChange={(e) => {
                              setFinalPrice(currencyFormat(e).target.value);
                           }}
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
                           type="text"
                           id="initialPrice"
                           value={initialPrice}
                           onChange={(e) => {
                              setInitialPrice(currencyFormat(e).target.value);
                           }}
                           required
                           placeholder="Initial Price"
                           className="w-full p-3 rounded-lg bg-light-bg dark:bg-dark-bg"
                        />
                     </div>
                     <div className="col-span-12">
                        <label htmlFor="description" className="pl-2 text-sm">
                           Description
                        </label>
                        <QuillNoSSRWrapper
                           theme="snow"
                           value={description}
                           onChange={setDescription}
                           className="bg-light-bg dark:bg-dark-bg"
                        />
                        {/* <input
                           type="text"
                           id="description"
                           required
                           placeholder="Description"
                           className="w-full p-3 rounded-lg bg-light-bg dark:bg-dark-bg"
                        /> */}
                     </div>
                     <div className=" col-span-12 flex justify-end">
                        <button
                           className="py-3 px-6 bg-primary-color hover:shadow-lg hover:shadow-primary-color rounded-lg font-semibold text-white"
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
