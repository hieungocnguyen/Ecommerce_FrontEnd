import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { BiCloudUpload } from "react-icons/bi";
import Image from "next/image";
import API, { endpoints } from "../../API";

const CreateCategory = ({
   IDOpenCreateCategoryModel,
   setIDOpenCreateCategoryModel,
   setLoading,
}) => {
   const wrapperRef = useRef(null);
   const [selectedImage, setSelectedImage] = useState();
   const [importImage, setImportImage] = useState(false);
   const [nameCategory, setNameCategory] = useState("");
   const [nameViCategory, setNameViCategory] = useState("");

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
            setIDOpenCreateCategoryModel(false);
         }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [wrapperRef]);

   const handleCreateCategory = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
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
            const res = await API.post(endpoints["create_category"], {
               name: nameCategory,
               nameVi: nameViCategory,
               avatar: resUploadCloudinary.data.data,
               active: 1,
            });
            setIDOpenCreateCategoryModel(false);
         } else {
            toast.error("Please upload avatar for category!");
         }
         setLoading(false);
      } catch (error) {
         console.log(error);
         toast.error("Somwthing wrong, try again!");
         setIDOpenCreateCategoryModel(false);
         setLoading(false);
      }
   };

   return (
      <div
         className="dark:bg-neutral-800 bg-light-primary rounded-lg p-8 border-2 border-primary-color"
         ref={wrapperRef}
      >
         <form
            onSubmit={handleCreateCategory}
            className="grid grid-cols-12 gap-4"
         >
            <div className="col-span-4">
               <div className="relative overflow-hidden w-full aspect-square rounded-xl bg-white">
                  <Image
                     src={
                        selectedImage
                           ? URL.createObjectURL(selectedImage)
                           : "https://res.cloudinary.com/dec25/image/upload/v1681489022/oe9uw8dxb4sq8es1rfgh.png"
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
               <div className="mb-2">
                  <input
                     name="name"
                     onChange={(e) => setNameCategory(e.target.value)}
                     required
                     value={nameCategory}
                     className="w-full p-4 rounded-lg bg-light-bg dark:bg-dark-bg"
                     placeholder="Name of item (en)"
                  />
               </div>
               <div className="mb-4">
                  <input
                     name="name"
                     onChange={(e) => setNameViCategory(e.target.value)}
                     required
                     value={nameViCategory}
                     className="w-full p-4 rounded-lg bg-light-bg dark:bg-dark-bg"
                     placeholder="Name of item (vi)"
                  />
               </div>
               <button
                  className="w-full p-4 rounded-lg text-white bg-primary-color text-center font-semibold hover:shadow-lg hover:shadow-primary-color cursor-pointer"
                  type="submit"
               >
                  Create category
               </button>
            </div>
         </form>
      </div>
   );
};

export default CreateCategory;
