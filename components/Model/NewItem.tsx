import { styled, TextField } from "@mui/material";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BiCloudUpload } from "react-icons/bi";
import API, { authAxios, endpoints } from "../../API";

const CssTextField = styled(TextField)({
   "& .MuiOutlinedInput-root": {
      "& fieldset": {
         borderColor: "white",
      },
      "&:hover fieldset": {
         borderColor: "#525EC1",
      },
      "&.Mui-focused fieldset": {
         borderColor: "#525EC1",
      },
   },
});

const NewItem = ({ postID, setIsOpenNewItem, setLoading }) => {
   const [selectedImage, setSelectedImage] = useState();
   const [importImage, setImportImage] = useState(false);
   const [values, setValues] = useState<any>({});

   const imageChange = (e) => {
      if (e.target.files[0] === undefined) {
         setImportImage(false);
      } else {
         setSelectedImage(e.target.files[0]);
         setImportImage(true);
      }
   };
   const handleChange = (event) => {
      setValues({
         ...values,
         [event.target.name]: event.target.value,
      });
   };
   const handleAddItem = async (e) => {
      e.preventDefault();
      let imageURL =
         "https://res.cloudinary.com/ngnohieu/image/upload/v1678612328/avatar2Artboard_1-100_impj99.jpg";
      try {
         setLoading(true);
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
            imageURL = resUploadCloudinary.data.data;
         }

         const resCreate = await authAxios().post(
            endpoints["add_item_salepost"](postID),
            {
               avatar: imageURL,
               inventory: Number(values.inventory),
               name: values.name,
               unitPrice: Number(values.unitPrice),
               description: values.description,
            }
         );
         if (resCreate) {
            setLoading(false);
            setIsOpenNewItem(false);
            setValues({
               avatar: "",
               inventory: "",
               name: "",
               unitPrice: "",
               description: "",
            });
            setImportImage(false);
         }
      } catch (error) {}
   };

   useEffect(() => {}, []);
   return (
      <div className="dark:bg-neutral-800 bg-light-primary rounded-lg p-8">
         <div className="flex justify-between mb-4">
            <div className="font-semibold text-xl">Create a new item</div>
            <div
               className="p-3 bg-blue-main rounded-lg font-semibold cursor-pointer hover:shadow-lg hover:shadow-blue-main transition-all text-white"
               onClick={() => {
                  setIsOpenNewItem(false);
                  setValues({
                     avatar: "",
                     inventory: "",
                     name: "",
                     unitPrice: "",
                     description: "",
                  });
                  setImportImage(false);
               }}
            >
               Close
            </div>
         </div>
         <form className="grid grid-cols-4 gap-8" onSubmit={handleAddItem}>
            <div className="col-span-1 rounded-lg flex flex-col items-center h-fit p-4">
               <div className="">
                  <div className="relative overflow-hidden w-44 h-44 rounded-xl">
                     <Image
                        src={
                           importImage
                              ? URL.createObjectURL(selectedImage)
                              : "https://res.cloudinary.com/ngnohieu/image/upload/v1678612328/avatar2Artboard_1-100_impj99.jpg"
                        }
                        alt="avatar"
                        layout="fill"
                        className="object-cover"
                     />
                     <label
                        className={`absolute w-full h-full top-0 dark:hover:bg-dark-primary hover:bg-light-primary hover:opacity-80 opacity-0  z-20 cursor-pointer `}
                        htmlFor="upload-photo-new-item"
                     >
                        <div className="w-full h-full text-5xl flex justify-center items-center">
                           <BiCloudUpload />
                        </div>
                        <input
                           type="file"
                           name="photo"
                           id="upload-photo-new-item"
                           className="hidden"
                           onChange={imageChange}
                        />
                     </label>
                  </div>
               </div>
            </div>
            <div className="col-span-3">
               <div className="mb-4">
                  <input
                     name="name"
                     onChange={handleChange}
                     required
                     value={values.name}
                     className="w-full p-4 rounded-lg bg-light-bg dark:bg-dark-bg"
                     placeholder="Name of item"
                  />
               </div>
               <div className="mb-4">
                  <input
                     name="description"
                     type="text"
                     onChange={handleChange}
                     required
                     value={values.description}
                     className="w-full p-4 rounded-lg bg-light-bg dark:bg-dark-bg"
                     placeholder="Description"
                  />
               </div>
               <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="col-span-1">
                     <input
                        name="unitPrice"
                        type="number"
                        onChange={handleChange}
                        required
                        value={values.unitPrice}
                        className="w-full p-4 rounded-lg bg-light-bg dark:bg-dark-bg"
                        placeholder="UnitPrice"
                     />
                  </div>
                  <div className="col-span-1">
                     <input
                        name="inventory"
                        type="number"
                        onChange={handleChange}
                        required
                        value={values.inventory}
                        className="w-full p-4 rounded-lg bg-light-bg dark:bg-dark-bg"
                        placeholder="Inventory"
                     />
                  </div>
               </div>
               <div className="flex justify-end mt-4">
                  <button
                     className="py-3 px-6 bg-blue-main hover:shadow-lg hover:shadow-blue-main transition-all rounded-lg font-semibold text-white"
                     type="submit"
                  >
                     Add new item
                  </button>
               </div>
            </div>
         </form>
      </div>
   );
};

export default NewItem;
