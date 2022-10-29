/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import API, { authAxios, endpoints } from "../../../API";
import LayoutDashboard from "../../../components/Dashboard/LayoutDashboardManager";
import Image from "next/image";
import { AiOutlineDelete } from "react-icons/ai";
import styled from "@emotion/styled";
import {
   FormControl,
   InputLabel,
   MenuItem,
   Select,
   TextField,
} from "@mui/material";
import Loader from "../../../components/Loader";
import toast, { Toaster } from "react-hot-toast";
import { BiEditAlt, BiSave } from "react-icons/bi";
import EditItem from "../../../components/EditItem";
import axios from "axios";

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

const ItemsOfPost = (salePostProps) => {
   const router = useRouter();
   const id = router.query.id;
   const [items, setItems] = useState<any>([]);
   const [selectedImage, setSelectedImage] = useState();
   const [importImage, setImportImage] = useState(false);
   const [loading, setLoading] = useState(false);
   const [values, setValues] = useState({
      avatar: "",
      inventory: null,
      name: "",
      unitPrice: null,
      description: "",
   });
   const [valuesPost, setValuesPost] = useState({
      categoryID: salePostProps.salePostProps.category.id,
      finalPrice: salePostProps.salePostProps.finalPrice,
      initialPrice: salePostProps.salePostProps.initialPrice,
      title: salePostProps.salePostProps.title,
      avatar: salePostProps.salePostProps.avatar,
      brand: salePostProps.salePostProps.brand,
      sellStatusID: salePostProps.salePostProps.sellStatus.id,
      manufacturer: salePostProps.salePostProps.manufacturer,
      origin: salePostProps.salePostProps.origin,
      description: salePostProps.salePostProps.description,
   });
   const [salePost, setSalePost] = useState<any>([]);
   const [picturesSet, setPicturesSet] = useState([]);
   const [isEdit, setIsEdit] = useState(false);
   const [isOpenModel, setIsOPenModel] = useState(false);
   const imageChange = (e) => {
      setSelectedImage(e.target.files[0]);
      setImportImage(true);
   };
   const addImageSet = async (image) => {
      if (image) {
         const uploadCloud = await API.post(
            endpoints["upload_cloudinary"],
            {
               file: image,
            },
            {
               headers: {
                  "Content-Type": "multipart/form-data",
               },
            }
         );
         const createPicture = await API.post(endpoints["create_piture"], {
            image: uploadCloud.data.data,
            postID: salePost.id,
         });
         loadItems();
      }
   };
   const deleteHandle = async (p) => {
      const resDetele = await API.delete(endpoints["picture_post"](p.id));
      loadItems();
   };

   const handleChange = (event) => {
      setValues({
         ...values,
         [event.target.name]: event.target.value,
      });
   };
   const handlePostChange = (event) => {
      setValuesPost({
         ...valuesPost,
         [event.target.name]: event.target.value,
      });
   };
   const handleAddItem = async (e) => {
      e.preventDefault();
      let imageURL =
         "https://t4.ftcdn.net/jpg/03/59/58/91/360_F_359589186_JDLl8dIWoBNf1iqEkHxhUeeOulx0wOC5.jpg";

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
            endpoints["add_item_salepost"](id),
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
            loadItems();
         }
      } catch (error) {}
   };
   const handleUpdatePost = async (event) => {
      event.preventDefault();

      const resUpdate = await API.put(
         endpoints["salePost"](salePostProps.salePostProps.id),
         {
            avatar: valuesPost.avatar,
            brand: valuesPost.brand,
            categoryID: valuesPost.categoryID,
            description: valuesPost.description,
            finalPrice: valuesPost.finalPrice,
            initialPrice: valuesPost.initialPrice,
            manufacturer: valuesPost.manufacturer,
            origin: valuesPost.origin,
            sellStatusID: valuesPost.sellStatusID,
            title: valuesPost.title,
         }
      );
      loadItems();
   };
   const loadItems = async () => {
      const resItems = await API.get(endpoints["salePost"](id));
      setItems(resItems.data.data.itemPostSet);
      setPicturesSet(resItems.data.data.picturePostSet);
      setSalePost(resItems.data.data);
   };
   useEffect(() => {
      loadItems();
   }, []);

   const handleDeleteItem = async (i) => {
      const resDelete = await API.delete(endpoints["item"](i.id));
      loadItems();
      toast.success("Delete item successful!", {
         position: "bottom-center",
      });
   };

   return (
      <LayoutDashboard>
         <div className="w-[90%] mx-auto">
            <div className="font-semibold text-2xl my-8">{salePost.title}</div>
            <div className="font-semibold text-xl my-4">Items</div>
            <div className="grid grid-cols-5 items-center py-4 font-semibold">
               <div className="col-span-2 text-left pl-4">Name</div>
               <div className="col-span-1 text-center">Unit Price</div>
               <div className="col-span-1 text-center">Inventory</div>
               <div className="col-span-1 text-center"></div>
            </div>
            {items.length > 0 ? (
               items.map((i) => (
                  <div
                     key={i.id}
                     className="grid grid-cols-5 items-center bg-neutral-800 mb-4 p-4 rounded-lg"
                  >
                     <div className="col-span-2 flex items-center">
                        <div className="flex justify-center items-center mr-4">
                           <Image
                              src={i.avatar}
                              alt=""
                              width={50}
                              height={50}
                              className="rounded-full"
                           />
                        </div>
                        <div>
                           {i.name}
                           {" - "}
                           {i.description}
                        </div>
                     </div>
                     <div className="col-span-1 text-center">{i.unitPrice}</div>
                     <div className="col-span-1 text-center">{i.inventory}</div>
                     <div className="col-span-1 flex justify-end">
                        <div
                           className="p-2 bg-neutral-600 hover:bg-opacity-30 rounded-lg cursor-pointer"
                           onClick={() => setIsOPenModel(true)}
                        >
                           <BiEditAlt />
                        </div>
                        {isOpenModel ? (
                           <EditItem item={i} setIsOPenModel={setIsOPenModel} />
                        ) : (
                           <></>
                        )}
                        <div
                           className=" p-2 hover:bg-red-600 hover:bg-opacity-30 rounded-lg cursor-pointer"
                           onClick={() => handleDeleteItem(i)}
                        >
                           <AiOutlineDelete className="text-2xl text-red-600 " />
                        </div>
                     </div>
                  </div>
               ))
            ) : (
               <div className="flex justify-center">
                  <img
                     src="https://cdni.iconscout.com/illustration/free/thumb/cart-is-empty-2100980-1763838.png"
                     alt=""
                     className="w-[20%]"
                  />
               </div>
            )}
            <div className="bg-neutral-800 rounded-lg mt-8">
               <form
                  className="grid grid-cols-4 gap-8"
                  onSubmit={handleAddItem}
               >
                  <div className="col-span-1  flex flex-col items-center">
                     <div className=" mt-8 mb-4 ">
                        <Image
                           src={
                              selectedImage
                                 ? URL.createObjectURL(selectedImage)
                                 : "https://t4.ftcdn.net/jpg/03/59/58/91/360_F_359589186_JDLl8dIWoBNf1iqEkHxhUeeOulx0wOC5.jpg"
                           }
                           alt="avatar"
                           height={100}
                           width={100}
                           className="rounded-full object-cover"
                        />
                     </div>
                     {/* upload image */}
                     <div className="mb-4">
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
                  <div className="col-span-3 m-4">
                     <div className="mb-4">
                        <CssTextField
                           fullWidth
                           label="Name"
                           name="name"
                           onChange={handleChange}
                           required
                           value={values.name}
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
                     <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="col-span-1">
                           <CssTextField
                              fullWidth
                              label="Unit Price"
                              name="unitPrice"
                              onChange={handleChange}
                              required
                              value={values.unitPrice}
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
                        </div>
                        <div className="col-span-1">
                           <CssTextField
                              fullWidth
                              label="Inventory"
                              name="inventory"
                              type="number"
                              onChange={handleChange}
                              required
                              value={values.inventory}
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
                     <div className="flex justify-end mt-4">
                        <button
                           className="py-3 px-6 bg-blue-main hover:bg-opacity-80 rounded-lg font-semibold text-white"
                           type="submit"
                        >
                           Add new item
                        </button>
                     </div>
                  </div>
               </form>
            </div>
         </div>
         <div className="w-[90%] mx-auto">
            <div className="flex justify-between items-center my-10">
               <div className="font-semibold text-xl">Set Picture </div>
               <div className="">
                  <label
                     htmlFor="upload-set_pic"
                     className="cursor-pointer text-white p-4 bg-blue-main rounded-lg font-semibold"
                  >
                     Upload image
                  </label>
                  <input
                     type="file"
                     name="photoSet"
                     id="upload-set_pic"
                     className="hidden"
                     onChange={(e) => addImageSet(e.target.files[0])}
                  />
               </div>
            </div>
            <div className="grid grid-cols-6 gap-8 mb-10">
               {picturesSet.map((p) => (
                  <div key={p.id}>
                     <img
                        src={p.image}
                        alt="pic"
                        className="rounded-lg aspect-square object-cover"
                     />
                     <div
                        className="text-center my-2 text-red-500 cursor-pointer"
                        onClick={() => deleteHandle(p)}
                     >
                        Delete picture
                     </div>
                  </div>
               ))}
            </div>
         </div>

         <div className="w-[90%] mx-auto  my-4">
            <div className="font-semibold text-xl my-4">Edit Post </div>
            <form
               className="grid grid-cols-4 gap-8"
               onSubmit={handleUpdatePost}
            >
               <div className="col-span-1 bg-neutral-800 rounded-lg flex flex-col items-center justify-center">
                  <div className="mt-6 font-semibold text-lg">Avatar post</div>
                  <div className=" my-4 ">
                     <Image
                        src={
                           selectedImage
                              ? URL.createObjectURL(selectedImage)
                              : valuesPost.avatar
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
                        value={valuesPost.title}
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
                           value={valuesPost.categoryID}
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
                           value={valuesPost.sellStatusID}
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
                        onChange={handlePostChange}
                        required
                        value={valuesPost.brand}
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
                           value={valuesPost.manufacturer}
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
                           value={valuesPost.origin}
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
                        value={valuesPost.finalPrice}
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
                        value={valuesPost.initialPrice}
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
                        value={valuesPost.description}
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
         {loading ? <Loader /> : <></>}
         <Toaster />
      </LayoutDashboard>
   );
};

export default ItemsOfPost;
export const getStaticProps = async (context) => {
   // request salepost detail
   const id = context.params.id;
   const resSalePost = await axios.get(
      "http://localhost:8080/ou-ecommerce/api/sale-post/" + id
   );
   const salePostProps = await resSalePost.data.data;

   return { props: { salePostProps } };
};

export async function getStaticPaths() {
   if (process.env.SKIP_BUILD_STATIC_GENERATION) {
      return {
         paths: [],
         fallback: "blocking",
      };
   }
   const res = await axios.get(
      "http://localhost:8080/ou-ecommerce/api/sale-post/all"
   );
   const salePosts = await res.data.data;
   const paths = salePosts.map((salePost) => ({
      params: { id: salePost.id.toString() },
   }));
   return {
      paths,
      fallback: false, // can also be true or 'blocking'
   };
}
