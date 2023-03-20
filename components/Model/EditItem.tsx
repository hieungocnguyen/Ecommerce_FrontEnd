import { styled, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import API, { endpoints } from "../../API";
import Image from "next/image";
import { BiCloudUpload } from "react-icons/bi";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";

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

const EditItem = ({ itemID, setItemID, setLoading }) => {
   const [valueItem, setValueItem] = useState<any>();
   const [selectedImage, setSelectedImage] = useState();
   const [importImage, setImportImage] = useState(false);

   const imageChange = (e) => {
      if (e.target.files[0] === undefined) {
         setImportImage(false);
      } else {
         setSelectedImage(e.target.files[0]);
         setImportImage(true);
      }
   };

   const fetchItem = async () => {
      const { data } = await API.get(endpoints["item"](itemID));
      setValueItem(data.data);
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
            unitPrice: valueItem.unitPrice,
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
               className="p-3 bg-blue-main rounded-lg font-semibold cursor-pointer shadow-sm shadow-blue-main hover:shadow-lg hover:shadow-blue-main text-white"
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
                           />
                        </label>
                     </div>
                  </div>
               </div>
               <div className="col-span-3">
                  <div className="mb-4">
                     <CssTextField
                        fullWidth
                        label="Name"
                        name="name"
                        onChange={handleChange}
                        required
                        defaultValue={valueItem.name}
                        variant="outlined"
                        InputProps={{
                           style: { color: "#525EC1", outline: "#525EC1" },
                        }}
                        InputLabelProps={{
                           style: {
                              color: "#525EC1",
                           },
                        }}
                     />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                     <div className="col-span-1">
                        <CssTextField
                           fullWidth
                           label="Unit Price"
                           name="unitPrice"
                           type="number"
                           onChange={handleChange}
                           required
                           variant="outlined"
                           defaultValue={valueItem.unitPrice}
                           InputProps={{
                              style: { color: "#525EC1", outline: "#525EC1" },
                           }}
                           InputLabelProps={{
                              style: {
                                 color: "#525EC1",
                              },
                           }}
                        />
                     </div>
                     <div className="col-span-1">
                        <CssTextField
                           fullWidth
                           label="Inventory"
                           name="inventory"
                           type="number"
                           onChange={handleChange}
                           required
                           defaultValue={valueItem.inventory}
                           variant="outlined"
                           InputProps={{
                              style: { color: "#525EC1", outline: "#525EC1" },
                           }}
                           InputLabelProps={{
                              style: {
                                 color: "#525EC1",
                              },
                           }}
                        />
                     </div>
                  </div>
                  <div className="mb-4">
                     <CssTextField
                        fullWidth
                        label="Description"
                        name="description"
                        onChange={handleChange}
                        required
                        defaultValue={valueItem.description}
                        variant="outlined"
                        InputProps={{
                           style: { color: "#525EC1", outline: "#525EC1" },
                        }}
                        InputLabelProps={{
                           style: {
                              color: "#525EC1",
                           },
                        }}
                     />
                  </div>

                  <div className="flex justify-end mt-4">
                     <button
                        className="py-3 px-6 bg-blue-main hover:shadow-lg hover:shadow-blue-main rounded-lg font-semibold text-white"
                        type="submit"
                     >
                        Update
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
