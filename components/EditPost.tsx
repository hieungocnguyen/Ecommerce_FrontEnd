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
import API, { endpoints } from "../API";
import { BiExit } from "react-icons/bi";

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

const EditPost = ({ postID, setPostID }) => {
   const [post, setPost] = useState<any>();
   const [selectedImage, setSelectedImage] = useState();
   const [importImage, setImportImage] = useState(false);

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

      // const resUpdate = await API.put(endpoints["salePost"](post.id), {
      //    avatar: valuesPost.avatar,
      //    brand: valuesPost.brand,
      //    categoryID: valuesPost.categoryID,
      //    description: valuesPost.description,
      //    finalPrice: valuesPost.finalPrice,
      //    initialPrice: valuesPost.initialPrice,
      //    manufacturer: valuesPost.manufacturer,
      //    origin: valuesPost.origin,
      //    sellStatusID: valuesPost.sellStatusID,
      //    title: valuesPost.title,
      // });
   };

   const imageChange = (e) => {
      setSelectedImage(e.target.files[0]);
      setImportImage(true);
   };

   const handlePostChange = (event) => {
      // setValuesPost({
      //    ...valuesPost,
      //    [event.target.name]: event.target.value,
      // });
   };

   return (
      <div
         className={`fixed top-0 w-4/5 h-screen z-20 justify-center items-center backdrop-blur-sm  ${
            postID > 0 ? "flex" : "hidden"
         }`}
      >
         <div className=" bg-dark-spot rounded-lg p-6 ">
            {post ? (
               <div>
                  <div className="font-semibold text-xl mb-4 flex justify-between items-center">
                     <div>Edit Post </div>
                     <div
                        className="p-3 bg-red-800 cursor-pointer rounded-lg"
                        onClick={() => setPostID(0)}
                     >
                        <BiExit />
                     </div>
                  </div>
                  <form
                     className="grid grid-cols-4 gap-8"
                     onSubmit={handleUpdatePost}
                  >
                     <div className="col-span-1 bg-neutral-800 rounded-lg flex flex-col items-center justify-center px-8">
                        <div className="mt-6 font-semibold text-lg">
                           Avatar post
                        </div>
                        <div className=" my-4 ">
                           <Image
                              src={
                                 selectedImage
                                    ? URL.createObjectURL(selectedImage)
                                    : post.avatar
                              }
                              alt="avatar"
                              width={180}
                              height={180}
                              className="rounded-full"
                           />
                        </div>
                        {/* upload image */}
                        <div className="mb-8">
                           <label
                              htmlFor="upload-photo"
                              className="cursor-pointer text-white hover:text-blue-main p-4"
                           >
                              Upload image
                           </label>
                           <input
                              type="file"
                              name="photo"
                              id="upload-photo"
                              className="opacity-0 absolute z-[-1]"
                              onChange={imageChange}
                           />
                        </div>
                     </div>
                     <div className="col-span-3 bg-neutral-800 rounded-lg p-8">
                        <div className="mb-4">
                           <CssTextField
                              fullWidth
                              label="Title"
                              name="title"
                              onChange={handlePostChange}
                              required
                              value={post.title}
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
                                 value={post.categoryID}
                                 label="Category"
                                 onChange={handlePostChange}
                                 sx={{
                                    color: "white",
                                    ".MuiOutlinedInput-notchedOutline": {
                                       borderColor: "white",
                                    },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                       {
                                          borderColor: "white",
                                       },
                                    "&:hover .MuiOutlinedInput-notchedOutline":
                                       {
                                          borderColor: "#525EC1",
                                       },
                                    ".MuiSvgIcon-root ": {
                                       fill: "white !important",
                                    },
                                 }}
                              >
                                 <MenuItem value={1}>
                                    Moms, Kids & Babies
                                 </MenuItem>
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
                                 <MenuItem value={10}>
                                    Books & Stationery
                                 </MenuItem>
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
                                 value={post.sellStatusID}
                                 label="Status"
                                 onChange={handlePostChange}
                                 sx={{
                                    color: "white",
                                    ".MuiOutlinedInput-notchedOutline": {
                                       borderColor: "white",
                                    },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                       {
                                          borderColor: "white",
                                       },
                                    "&:hover .MuiOutlinedInput-notchedOutline":
                                       {
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
                              onChange={handlePostChange}
                              required
                              value={post.brand}
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
                                 onChange={handlePostChange}
                                 required
                                 value={post.manufacturer}
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
                                 onChange={handlePostChange}
                                 required
                                 value={post.origin}
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
                              onChange={handlePostChange}
                              required
                              value={post.finalPrice}
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
                              onChange={handlePostChange}
                              required
                              value={post.initialPrice}
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
                              onChange={handlePostChange}
                              required
                              value={post.description}
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
                              Save
                           </button>
                        </div>
                     </div>
                  </form>
               </div>
            ) : (
               <div>0</div>
            )}
         </div>
      </div>
   );
};

export default EditPost;
