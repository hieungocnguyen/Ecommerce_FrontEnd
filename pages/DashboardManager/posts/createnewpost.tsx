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
   const [values, setValues] = useState<any>({});
   const [selectedImage, setSelectedImage] = useState();
   const [importImage, setImportImage] = useState(false);
   const { state, dispatch } = useContext(Store);
   const { userInfo, agencyInfo } = state;
   const [titleVali, setTitleVali] = useState(false);
   let [loading, setLoading] = useState(false);
   const router = useRouter();
   const imageChange = (e) => {
      setSelectedImage(e.target.files[0] ? e.target.files[0] : selectedImage);
      setImportImage(true);
   };
   const handleChange = (event) => {
      setValues({
         ...values,
         [event.target.name]: event.target.value,
      });
   };
   useEffect(() => {}, []);
   const handleCreatePost = async (e) => {
      e.preventDefault();
      let imageURL =
         "https://res.cloudinary.com/ngnohieu/image/upload/v1678612328/avatar2Artboard_1-100_impj99.jpg";
      if (values.title.length <= 20) {
         setTitleVali(true);
      } else {
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
               endpoints["create_salePost"](agencyInfo.id),
               {
                  ...values,
                  avatar: imageURL,
               }
            );
            if (resCreate) {
               setLoading(false);
               router.push("/DashboardManager/posts");
            }
         } catch (error) {}
      }
   };
   return (
      <LayoutDashboard>
         <div className="w-[90%] mx-auto">
            <div className="font-semibold text-2xl my-8">Create a new post</div>
            <form
               className="grid grid-cols-4 gap-8"
               onSubmit={handleCreatePost}
            >
               <div className="col-span-1 bg-neutral-800 rounded-lg flex flex-col items-center h-fit py-8">
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
                           className={`absolute w-full h-full top-0 hover:bg-dark-primary hover:opacity-90 opacity-0  z-20 cursor-pointer `}
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
               <div className="col-span-3 bg-neutral-800 rounded-lg p-8">
                  <div className="mb-4">
                     <CssTextField
                        fullWidth
                        label="Title"
                        name="title"
                        onChange={handleChange}
                        error={titleVali}
                        helperText={
                           titleVali
                              ? "Title post must more than 20 characters"
                              : ""
                        }
                        required
                        value={values.title}
                        variant="outlined"
                        InputProps={{
                           style: { color: "white", outline: "white" },
                        }}
                        InputLabelProps={{
                           style: {
                              color: "white",
                           },
                        }}
                     />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                     <FormControl fullWidth variant="outlined" required>
                        <InputLabel
                           id="category-input"
                           sx={{
                              color: "white",
                              "&.Mui-focused ": {
                                 color: "#525EC1",
                              },
                           }}
                        >
                           Category
                        </InputLabel>
                        <Select
                           labelId="category-input"
                           id="demo-simple-select"
                           name="categoryID"
                           value={values.categoryID}
                           label="Category"
                           onChange={handleChange}
                           sx={{
                              color: "white",
                              ".MuiOutlinedInput-notchedOutline": {
                                 borderColor: "white",
                              },
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                 {
                                    borderColor: "white",
                                 },
                              "&:hover .MuiOutlinedInput-notchedOutline": {
                                 borderColor: "#525EC1",
                              },
                              ".MuiSvgIcon-root ": {
                                 fill: "white !important",
                              },
                           }}
                        >
                           <MenuItem value={1}>Moms, Kids & Babies</MenuItem>
                           <MenuItem value={2}>Consumer Electronics</MenuItem>
                           <MenuItem value={3}>Fashion</MenuItem>
                           <MenuItem value={4}>Home & Living</MenuItem>
                           <MenuItem value={5}>Shoes</MenuItem>
                           <MenuItem value={6}>Grocery</MenuItem>
                           <MenuItem value={7}>Computer & Accessories</MenuItem>
                           <MenuItem value={8}>Mobile & Gadgets</MenuItem>
                           <MenuItem value={9}>Sport & Outdoor</MenuItem>
                           <MenuItem value={10}>Books & Stationery</MenuItem>
                           <MenuItem value={11}>Home Appliances</MenuItem>
                           <MenuItem value={12}>Cameras</MenuItem>
                           <MenuItem value={13}>Watches</MenuItem>
                           <MenuItem value={14}>Automotive</MenuItem>
                        </Select>
                     </FormControl>
                     <FormControl fullWidth variant="outlined" required>
                        <InputLabel
                           id="sellstatus-input"
                           sx={{
                              color: "white",
                              "&.Mui-focused ": {
                                 color: "#525EC1",
                              },
                           }}
                        >
                           Status
                        </InputLabel>
                        <Select
                           labelId="sellstatus-input"
                           id="demo-simple-select"
                           name="sellStatusID"
                           value={values.sellStatusID}
                           label="Status"
                           onChange={handleChange}
                           sx={{
                              color: "white",
                              ".MuiOutlinedInput-notchedOutline": {
                                 borderColor: "white",
                              },
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                 {
                                    borderColor: "white",
                                 },
                              "&:hover .MuiOutlinedInput-notchedOutline": {
                                 borderColor: "#525EC1",
                              },
                              ".MuiSvgIcon-root ": {
                                 fill: "white !important",
                              },
                           }}
                        >
                           <MenuItem value={1}>IN STOCK</MenuItem>
                           <MenuItem value={2}>BEST SELLER</MenuItem>
                           <MenuItem value={3}>PROMOTION</MenuItem>
                           <MenuItem value={4}>SUPER SALE</MenuItem>
                           <MenuItem value={5}>FREE SHIP</MenuItem>
                           <MenuItem value={6}>TRENDING</MenuItem>
                        </Select>
                     </FormControl>
                  </div>
                  <div className="mb-4">
                     <CssTextField
                        fullWidth
                        label="Brand"
                        name="brand"
                        onChange={handleChange}
                        required
                        value={values.brand}
                        variant="outlined"
                        InputProps={{
                           style: { color: "white", outline: "white" },
                        }}
                        InputLabelProps={{
                           style: {
                              color: "white",
                           },
                        }}
                     />
                  </div>
                  <div className="mb-4 grid grid-cols-2 gap-4">
                     <div>
                        <CssTextField
                           fullWidth
                           label="Manufacturer"
                           name="manufacturer"
                           onChange={handleChange}
                           required
                           value={values.manufacturer}
                           variant="outlined"
                           InputProps={{
                              style: { color: "white", outline: "white" },
                           }}
                           InputLabelProps={{
                              style: {
                                 color: "white",
                              },
                           }}
                        />
                     </div>
                     <div>
                        <CssTextField
                           fullWidth
                           label="Origin"
                           name="origin"
                           onChange={handleChange}
                           required
                           value={values.origin}
                           variant="outlined"
                           InputProps={{
                              style: { color: "white", outline: "white" },
                           }}
                           InputLabelProps={{
                              style: {
                                 color: "white",
                              },
                           }}
                        />
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                     <CssTextField
                        fullWidth
                        label="Final Price (VND)"
                        name="finalPrice"
                        onChange={handleChange}
                        required
                        value={values.finalPrice}
                        variant="outlined"
                        type="number"
                        InputProps={{
                           style: { color: "white", outline: "white" },
                        }}
                        InputLabelProps={{
                           style: {
                              color: "white",
                           },
                        }}
                     />
                     <CssTextField
                        fullWidth
                        label="Initial Price (VND)"
                        name="initialPrice"
                        onChange={handleChange}
                        required
                        value={values.initialPrice}
                        variant="outlined"
                        InputProps={{
                           style: { color: "white", outline: "white" },
                        }}
                        InputLabelProps={{
                           style: {
                              color: "white",
                           },
                        }}
                     />
                  </div>
                  <div className="mb-4">
                     <CssTextField
                        fullWidth
                        label="Description"
                        name="description"
                        onChange={handleChange}
                        required
                        value={values.description}
                        variant="outlined"
                        InputProps={{
                           style: { color: "white", outline: "white" },
                        }}
                        InputLabelProps={{
                           style: {
                              color: "white",
                           },
                        }}
                     />
                  </div>
                  <div className="flex justify-end mt-4">
                     <button
                        className="py-3 px-6 bg-blue-main hover:bg-opacity-80 rounded-lg font-semibold text-white"
                        type="submit"
                     >
                        Create
                     </button>
                  </div>
               </div>
               {loading ? <Loader /> : <></>}
            </form>
         </div>
      </LayoutDashboard>
   );
};

export default CreateNewPost;
