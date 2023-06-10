import { styled, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import API, { endpoints } from "../../API";
import Image from "next/image";
import { BiCloudUpload } from "react-icons/bi";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";

const EditItem = ({ itemID, setItemID, setLoading }) => {
   const [valueItem, setValueItem] = useState<any>();
   const [selectedImage, setSelectedImage] = useState();
   const [importImage, setImportImage] = useState(false);
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

   const fetchItem = async () => {
      try {
         const { data } = await API.get(endpoints["item"](itemID));
         setValueItem(data.data);
         setUnitPrice(currencyFormat(data.data.unitPrice.toString()));
      } catch (error) {
         console.log(error);
      }
   };

   const currencyFormat = (text) => {
      let value = text;
      value = value.replace(/\D/g, "");
      value = value.replace(/(\d)(\d{3})$/, "$1.$2");
      value = value.replace(/(?=(\d{3})+(\D))\B/g, ".");
      text = value;
      return text;
   };

   const handleChange = (event) => {
      setValueItem({
         ...valueItem,
         [event.target.name]: event.target.value,
      });
   };

   const handleChangeSubmit = async (e) => {
      e.preventDefault();
      let imageURL = valueItem.avatar;
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

         const resUpdate = await API.put(endpoints["item"](itemID), {
            inventory: valueItem.inventory,
            name: valueItem.name,
            unitPrice: Number(unitPrice.replace(/[^a-zA-Z0-9 ]/g, "")),
            avatar: imageURL,
            description: valueItem.description,
         });
         console.log(resUpdate);

         if (resUpdate) {
            setLoading(false);
            setItemID(-1);
            setImportImage(false);
            toast.success("Update successful!", {
               position: "top-center",
            });
         }
      } catch (error) {}

      setItemID(-1);
   };

   useEffect(() => {
      if (itemID != -1) {
         fetchItem();
      }
   }, [itemID]);

   return (
      <div className="dark:bg-neutral-800 bg-light-primary rounded-lg p-8">
         <div className="flex justify-between mb-4">
            <div className="font-semibold text-xl">Edit item</div>
            <div
               className="p-3 bg-primary-color rounded-lg font-semibold cursor-pointer shadow-sm shadow-primary-color hover:shadow-lg hover:shadow-primary-color text-white"
               onClick={() => {
                  setItemID(-1);
                  setImportImage(false);
                  setValueItem(undefined);
               }}
            >
               Close
            </div>
         </div>
         {valueItem ? (
            <form
               className="grid grid-cols-4 gap-8"
               onSubmit={handleChangeSubmit}
            >
               <div className="col-span-1 dark:bg-neutral-800 bg-light-primary rounded-lg flex flex-col items-center h-fit p-4">
                  <div className="">
                     <div className="relative overflow-hidden w-44 h-44 rounded-xl">
                        <Image
                           src={
                              selectedImage
                                 ? URL.createObjectURL(selectedImage)
                                 : valueItem.avatar
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
               </div>
               <div className="col-span-3 font-medium">
                  <div className="mb-4">
                     <input
                        name="name"
                        onChange={handleChange}
                        required
                        defaultValue={valueItem.name}
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
                        defaultValue={valueItem.description}
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
                           defaultValue={valueItem.inventory}
                           className="w-full p-4 rounded-lg bg-light-bg dark:bg-dark-bg"
                           placeholder="Inventory"
                           onKeyDown={(e) => {
                              !/^[a-zA-Z0-9._\b\s]+$/.test(e.key) &&
                                 e.preventDefault();
                           }}
                        />
                     </div>
                  </div>
                  <div className="flex justify-end mt-4">
                     <button
                        className="py-3 px-6 bg-primary-color hover:shadow-lg hover:shadow-primary-color transition-all rounded-lg font-semibold text-white"
                        type="submit"
                     >
                        Save
                     </button>
                  </div>
               </div>
            </form>
         ) : (
            <div></div>
         )}
      </div>
   );
};

export default EditItem;
// export default dynamic(() => Promise.resolve(EditItem), { ssr: false });
