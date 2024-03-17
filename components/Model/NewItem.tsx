import { styled, TextField } from "@mui/material";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BiCloudUpload } from "react-icons/bi";
import API, { authAxios, endpoints } from "../../API";
import toast from "react-hot-toast";

const NewItem = ({ postID, setIsOpenNewItem, setLoading }) => {
   const [selectedImage, setSelectedImage] = useState();
   const [importImage, setImportImage] = useState(false);
   const [values, setValues] = useState<any>({});
   const [unitPrice, setUnitPrice] = useState("");

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
   const handleChange = (event) => {
      setValues({
         ...values,
         [event.target.name]: event.target.value,
      });
   };

   const currencyFormat = (text) => {
      let value = text;
      value = value.replace(/\D/g, "");
      value = value.replace(/(\d)(\d{3})$/, "$1.$2");
      value = value.replace(/(?=(\d{3})+(\D))\B/g, ".");
      text = value;
      return text;
   };

   const handleAddItem = async (e) => {
      e.preventDefault();
      let imageURL =
         "https://res.cloudinary.com/dec25/image/upload/v1681489022/oe9uw8dxb4sq8es1rfgh.png";
      if (selectedImage === undefined) {
         toast.error("Please upload an avatar for this post! ", {
            position: "top-center",
         });
         return;
      }
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
               unitPrice: Number(unitPrice.replace(/[^a-zA-Z0-9 ]/g, "")),
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
            setSelectedImage(undefined);
            setUnitPrice("");
         }
      } catch (error) {
         if (error.response.data.data.inventory) {
            toast.error(`Inventory: ${error.response.data.data.inventory}`);
         }
         if (error.response.data.data.unitPrice) {
            toast.error(`Unit Price: ${error.response.data.data.unitPrice}`);
         }
         if (error.response.data.data.description) {
            toast.error(`Description: ${error.response.data.data.description}`);
         }
         if (error.response.data.data.name) {
            toast.error(`Name: ${error.response.data.data.name}`);
         }
         if (error.response.data.data.avatar) {
            toast.error(`Avatar: ${error.response.data.data.avatar}`);
         }
         setLoading(false);
      }
   };

   useEffect(() => {}, []);

   return (
      <div className="dark:bg-neutral-800 bg-light-primary rounded-lg p-8">
         <div className="flex justify-between mb-4">
            <div className="font-semibold text-xl">Create a new item</div>
            <div
               className="p-3 bg-primary-color rounded-lg font-semibold cursor-pointer hover:shadow-lg hover:shadow-primary-color transition-all text-white"
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
            <div className="col-span-1 rounded-lg flex flex-col items-center h-fit">
               <div className="">
                  <div className="relative overflow-hidden w-44 h-44 rounded-xl">
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
                           accept="image/png, image/jpeg"
                        />
                     </label>
                  </div>
                  <div className="mt-2 text-gray-500 font-medium text-sm italic">
                     *Maximum 2MB
                  </div>
               </div>
            </div>
            <div className="col-span-3 font-medium">
               <div className="mb-4">
                  <input
                     name="name"
                     onChange={handleChange}
                     minLength={1}
                     // maxLength={100}
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
                        type="text"
                        onChange={(e) =>
                           setUnitPrice(currencyFormat(e.target.value))
                        }
                        required
                        value={unitPrice}
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
                        onKeyDown={(e) => {
                           !/^[a-zA-Z0-9._\b\s]+$/.test(e.key) &&
                              e.preventDefault();
                        }}
                        value={values.inventory}
                        className="w-full p-4 rounded-lg bg-light-bg dark:bg-dark-bg"
                        placeholder="Inventory"
                     />
                  </div>
               </div>
               <div className="flex justify-end mt-4">
                  <button
                     className="py-3 px-6 bg-primary-color hover:shadow-lg hover:shadow-primary-color transition-all rounded-lg font-semibold text-white"
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
