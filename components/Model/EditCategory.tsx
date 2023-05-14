import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { BiCloudUpload } from "react-icons/bi";
import toast from "react-hot-toast";
import API, { endpoints } from "../../API";

const EditCategory = ({
   setIDOpenEditCategoryModel,
   IDOpenEditCategoryModel,
   categoryInfo,
   setCategoryInfo,
   setLoading,
}) => {
   const wrapperRef = useRef(null);
   const [value, setValue] = useState<any>({});
   const [selectedImage, setSelectedImage] = useState();
   const [importImage, setImportImage] = useState(false);

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

   useEffect(() => {
      function handleClickOutside(event) {
         if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setIDOpenEditCategoryModel(-1);
            setCategoryInfo({});
         }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [wrapperRef]);

   useEffect(() => {
      setValue(categoryInfo);
   }, []);

   const handleUpdateCategory = async (e) => {
      e.preventDefault();
      try {
         setLoading(true);
         let urlImage = value.avatar;
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
            urlImage = resUploadCloudinary.data.data;
         }
         const res = await API.post(endpoints["update_category"](value.id), {
            name: value.name,
            avatar: urlImage,
         });
         toast.success("Update information category successful!");
         setIDOpenEditCategoryModel(-1);
         setCategoryInfo({});
         setLoading(false);
      } catch (error) {
         console.log(error);
         toast.error("Something wrong! Try again");
      }
   };

   return (
      <div
         className="dark:bg-neutral-800 bg-light-primary rounded-lg p-8 border-2 border-primary-color"
         ref={wrapperRef}
      >
         <form
            onSubmit={handleUpdateCategory}
            className="grid grid-cols-12 gap-4"
         >
            <div className="col-span-4">
               <div className="relative overflow-hidden w-full aspect-square rounded-xl bg-white">
                  <Image
                     src={
                        selectedImage
                           ? URL.createObjectURL(selectedImage)
                           : value.avatar
                     }
                     alt="avatar"
                     layout="fill"
                     className="object-cover"
                  />
                  <label
                     className={`absolute w-full h-full top-0 hover:bg-dark-primary hover:opacity-90 opacity-0  z-20 cursor-pointer `}
                     htmlFor="upload-photo-edit-item"
                  >
                     <div className="w-full h-full text-5xl flex justify-center items-center text-white">
                        <BiCloudUpload />
                     </div>
                     <input
                        type="file"
                        name="photo"
                        id="upload-photo-edit-item"
                        className="hidden"
                        onChange={imageChange}
                        accept="image/png, image/jpeg"
                     />
                  </label>
               </div>
               <div className="mt-2 text-gray-500 font-medium text-sm italic">
                  *Maximum 2MB
               </div>
            </div>
            <div className="col-span-8">
               <div className="mb-4">
                  <input
                     name="name"
                     onChange={(e) =>
                        setValue({ ...value, name: e.target.value })
                     }
                     required
                     value={value.name}
                     className="w-full p-4 rounded-lg bg-light-bg dark:bg-dark-bg"
                     placeholder="Name of item"
                  />
               </div>
               <button
                  className="w-full p-4 rounded-lg text-white bg-primary-color text-center font-semibold hover:shadow-lg hover:shadow-primary-color cursor-pointer"
                  type="submit"
               >
                  Update category
               </button>
            </div>
         </form>
      </div>
   );
};

export default EditCategory;
