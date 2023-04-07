import {
   FormControl,
   InputLabel,
   MenuItem,
   Select,
   styled,
   TextField,
} from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";
import API, { endpoints } from "../../API";
import { BiCloudUpload, BiExit } from "react-icons/bi";
import dynamic from "next/dynamic";
import Loader from "../Loader";
import { toast } from "react-hot-toast";

const EditPost = ({ postID, setPostID, setLoading }) => {
   const [post, setPost] = useState<any>();
   const [selectedImage, setSelectedImage] = useState();
   const [importImage, setImportImage] = useState(false);
   const [titleVali, setTitleVali] = useState(false);
   const fetchPost = async () => {
      const { data } = await API.get(endpoints["salePost"](postID));
      setPost(data.data);
   };
   useEffect(() => {
      if (postID != 0) {
         fetchPost();
      }
   }, [postID]);

   const handleUpdatePost = async (event) => {
      event.preventDefault();
      setLoading(true);
      let imageURL = post.avatar;
      if (post.title.length <= 20) {
         setTitleVali(true);
      } else {
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
               imageURL = resUploadCloudinary.data.data;
            }
            const resUpdate = await API.put(endpoints["salePost"](post.id), {
               ...post,
               avatar: imageURL,
            });

            if (resUpdate) {
               setLoading(false);
               setPostID(0);
               toast.success("Update information successful!", {
                  position: "top-center",
               });
            }
         } catch (error) {
            setLoading(false);
            setPostID(0);
            toast.error(error.response.data.data, {
               position: "top-center",
            });
         }
      }
   };

   const imageChange = (e) => {
      if (e.target.files[0] === undefined) {
         setImportImage(false);
      } else {
         setSelectedImage(e.target.files[0]);
         setImportImage(true);
      }
   };

   const handlePostChange = (event) => {
      setPost({
         ...post,
         [event.target.name]: event.target.value,
      });
   };

   return (
      <div className=" dark:bg-neutral-800 bg-light-primary rounded-lg p-6 border-2 border-blue-main shadow-lg">
         {post ? (
            <div>
               <div className="font-semibold mb-4 flex justify-between items-center">
                  <div className="text-xl">Edit Post </div>
                  <div
                     className="p-3 bg-primary-color hover:shadow-primary-color hover:shadow-lg cursor-pointer rounded-lg text-white text-lg"
                     onClick={() => {
                        setPostID(0);
                        setPost(undefined);
                     }}
                  >
                     Close
                  </div>
               </div>
               <form
                  className="grid grid-cols-4 gap-8"
                  onSubmit={handleUpdatePost}
               >
                  <div className="col-span-1 dark:bg-neutral-800 bg-light-primary rounded-lg flex flex-col items-center h-fit p-8">
                     <div className="font-semibold text-lg mb-4">Avatar</div>
                     <div className="">
                        <div className="relative overflow-hidden w-40 h-40 rounded-xl">
                           <Image
                              src={
                                 selectedImage
                                    ? URL.createObjectURL(selectedImage)
                                    : post.avatar
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
                              />
                           </label>
                        </div>
                     </div>
                  </div>
                  <div className="col-span-3 dark:bg-neutral-800 bg-light-spot rounded-lg p-8">
                     {/* <div className="mb-4">
                        <CssTextField
                           fullWidth
                           label="Title"
                           name="title"
                           onChange={handlePostChange}
                           required
                           defaultValue={post.title}
                           error={titleVali}
                           helperText={
                              titleVali
                                 ? "Title post must more than 20 characters"
                                 : ""
                           }
                           variant="outlined"
                           InputProps={{
                              style: {
                                 color: "#525EC1",
                                 outline: "#525EC1",
                              },
                           }}
                           InputLabelProps={{
                              style: {
                                 color: "#525EC1",
                              },
                           }}
                        />
                     </div>
                     <div className="grid grid-cols-2 gap-4 mb-4">
                        <FormControl fullWidth variant="outlined" required>
                           <InputLabel
                              id="category-input"
                              sx={{
                                 color: "#525EC1",
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
                              defaultValue={post.category.id}
                              label="Category"
                              onChange={handlePostChange}
                              sx={{
                                 color: "#525EC1",
                                 ".MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#525EC1",
                                 },
                                 "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                    {
                                       borderColor: "#525EC1",
                                    },
                                 "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#525EC1",
                                 },
                                 ".MuiSvgIcon-root ": {
                                    fill: "#525EC1 !important",
                                 },
                              }}
                           >
                              <MenuItem value={undefined}>----</MenuItem>
                              <MenuItem value={1}>Moms, Kids & Babies</MenuItem>
                              <MenuItem value={2}>
                                 Consumer Electronics
                              </MenuItem>
                              <MenuItem value={3}>Fashion</MenuItem>
                              <MenuItem value={4}>Home & Living</MenuItem>
                              <MenuItem value={5}>Shoes</MenuItem>
                              <MenuItem value={6}>Grocery</MenuItem>
                              <MenuItem value={7}>
                                 Computer & Accessories
                              </MenuItem>
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
                                 color: "#525EC1",
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
                              defaultValue={post.sellStatus.id}
                              label="Status"
                              onChange={handlePostChange}
                              sx={{
                                 color: "#525EC1",
                                 ".MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#525EC1",
                                 },
                                 "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                    {
                                       borderColor: "#525EC1",
                                    },
                                 "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#525EC1",
                                 },
                                 ".MuiSvgIcon-root ": {
                                    fill: "#525EC1 !important",
                                 },
                              }}
                           >
                              <MenuItem value={undefined}>IN STOCK</MenuItem>
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
                           onChange={handlePostChange}
                           required
                           defaultValue={post.brand}
                           variant="outlined"
                           InputProps={{
                              style: {
                                 color: "#525EC1",
                                 outline: "#525EC1",
                              },
                           }}
                           InputLabelProps={{
                              style: {
                                 color: "#525EC1",
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
                              onChange={handlePostChange}
                              required
                              defaultValue={post.manufacturer}
                              variant="outlined"
                              InputProps={{
                                 style: {
                                    color: "#525EC1",
                                    outline: "#525EC1",
                                 },
                              }}
                              InputLabelProps={{
                                 style: {
                                    color: "#525EC1",
                                 },
                              }}
                           />
                        </div>
                        <div>
                           <CssTextField
                              fullWidth
                              label="Origin"
                              name="origin"
                              onChange={handlePostChange}
                              required
                              defaultValue={post.origin}
                              variant="outlined"
                              InputProps={{
                                 style: {
                                    color: "#525EC1",
                                    outline: "#525EC1",
                                 },
                              }}
                              InputLabelProps={{
                                 style: {
                                    color: "#525EC1",
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
                           onChange={handlePostChange}
                           required
                           defaultValue={post.finalPrice}
                           variant="outlined"
                           type="number"
                           InputProps={{
                              style: {
                                 color: "#525EC1",
                                 outline: "#525EC1",
                              },
                           }}
                           InputLabelProps={{
                              style: {
                                 color: "#525EC1",
                              },
                           }}
                        />
                        <CssTextField
                           fullWidth
                           label="Initial Price (VND)"
                           name="initialPrice"
                           onChange={handlePostChange}
                           required
                           defaultValue={post.initialPrice}
                           variant="outlined"
                           InputProps={{
                              style: {
                                 color: "#525EC1",
                                 outline: "#525EC1",
                              },
                           }}
                           InputLabelProps={{
                              style: {
                                 color: "#525EC1",
                              },
                           }}
                        />
                     </div>
                     <div className="mb-4">
                        <CssTextField
                           fullWidth
                           label="Description"
                           name="description"
                           onChange={handlePostChange}
                           required
                           defaultValue={post.description}
                           variant="outlined"
                           InputProps={{
                              style: {
                                 color: "#525EC1",
                                 outline: "#525EC1",
                              },
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
                           className="py-3 px-6 bg-blue-main hover:bg-opacity-80 rounded-lg font-semibold text-white"
                           type="submit"
                        >
                           Save
                        </button>
                     </div> */}
                     <div className="grid grid-cols-12 gap-4 font-medium">
                        <div className="col-span-12">
                           <label htmlFor="title" className="pl-2 text-sm">
                              Title
                           </label>
                           <input
                              type="text"
                              id="title"
                              name="title"
                              minLength={20}
                              onChange={handlePostChange}
                              required
                              defaultValue={post.title}
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
                              onChange={handlePostChange}
                              defaultValue={post.category.id}
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
                              onChange={handlePostChange}
                              defaultValue={post.sellStatusID}
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
                              name="brand"
                              onChange={handlePostChange}
                              defaultValue={post.brand}
                              required
                              placeholder="Brand"
                              className="w-full p-3 rounded-lg bg-light-bg dark:bg-dark-bg"
                           />
                        </div>
                        <div className="col-span-4">
                           <label
                              htmlFor="manufacturer"
                              className="pl-2 text-sm"
                           >
                              Manufacturer
                           </label>
                           <input
                              type="text"
                              id="manufacturer"
                              name="manufacturer"
                              onChange={handlePostChange}
                              defaultValue={post.manufacturer}
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
                              name="origin"
                              onChange={handlePostChange}
                              defaultValue={post.origin}
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
                              name="finalPrice"
                              onChange={handlePostChange}
                              required
                              defaultValue={post.finalPrice}
                              placeholder="Final Price"
                              className="w-full p-3 rounded-lg bg-light-bg dark:bg-dark-bg"
                           />
                        </div>
                        <div className="col-span-6">
                           <label
                              htmlFor="initialPrice"
                              className="pl-2 text-sm"
                           >
                              Initial Price
                           </label>
                           <input
                              type="number"
                              id="initialPrice"
                              name="initialPrice"
                              defaultValue={post.initialPrice}
                              onChange={handlePostChange}
                              required
                              placeholder="Initial Price"
                              className="w-full p-3 rounded-lg bg-light-bg dark:bg-dark-bg"
                           />
                        </div>
                        <div className="col-span-12">
                           <label
                              htmlFor="description"
                              className="pl-2 text-sm"
                           >
                              Description
                           </label>
                           <input
                              type="text"
                              id="description"
                              name="description"
                              onChange={handlePostChange}
                              defaultValue={post.description}
                              required
                              placeholder="Description"
                              className="w-full p-3 rounded-lg bg-light-bg dark:bg-dark-bg"
                           />
                        </div>
                        <div className=" col-span-12 flex justify-end">
                           <button
                              className="py-3 px-6 bg-blue-main hover:shadow-lg hover:shadow-blue-main rounded-lg font-semibold text-white"
                              type="submit"
                              title="Save changes"
                           >
                              Save changes
                           </button>
                        </div>
                     </div>
                  </div>
               </form>
            </div>
         ) : (
            <div></div>
         )}
      </div>
   );
};

export default EditPost;
// export default dynamic(() => Promise.resolve(EditPost), { ssr: false });
