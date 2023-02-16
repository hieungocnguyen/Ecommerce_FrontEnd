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
   const [isEditItem, setIsEditItem] = useState(0);
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
            <div className="font-semibold text-xl my-4">Items</div>

            {items.length > 0 ? (
               <div>
                  <div className="rounded-lg bg-dark-primary overflow-hidden shadow-2xl shadow-dark-shadow">
                     <ul className="grid grid-cols-12 p-5 bg-dark-spot items-center font-semibold">
                        <li className="col-span-1 ">Image</li>
                        <li className="col-span-5 ">Name</li>
                        <li className="col-span-3 ">Unit Price</li>
                        <li className="col-span-2 ">Inventory</li>
                        <li className="col-span-1 "></li>
                     </ul>
                     {items.map((i) => (
                        <div key={i.id}>
                           <ul className="grid grid-cols-12 p-5 items-center hover:bg-dark-bg">
                              <li className="col-span-1">
                                 <Image
                                    src={i.avatar}
                                    alt=""
                                    width={42}
                                    height={42}
                                    className="object-cover rounded-full"
                                 />
                              </li>
                              <li className="col-span-5">
                                 {i.name}
                                 {" - "}
                                 {i.description}
                              </li>
                              <li className="col-span-3">{i.unitPrice}</li>
                              <li className="col-span-2">{i.inventory}</li>
                              <li className="col-span-1 flex gap-3">
                                 <div
                                    className=" p-3 bg-green-800  rounded-lg cursor-pointer flex justify-center items-center text-xl"
                                    onClick={() => setIsOPenModel(true)}
                                 >
                                    <BiEditAlt />
                                 </div>
                                 {isOpenModel ? (
                                    <EditItem
                                       item={i}
                                       setIsOPenModel={setIsOPenModel}
                                    />
                                 ) : (
                                    <></>
                                 )}
                                 <div
                                    className=" p-3 bg-red-800  rounded-lg cursor-pointer text-xl"
                                    onClick={() => handleDeleteItem(i)}
                                 >
                                    <AiOutlineDelete />
                                 </div>
                              </li>
                           </ul>
                        </div>
                     ))}
                  </div>
               </div>
            ) : (
               <div className="flex justify-center">
                  <img
                     src="https://cdni.iconscout.com/illustration/free/thumb/cart-is-empty-2100980-1763838.png"
                     alt=""
                     className="w-40"
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
