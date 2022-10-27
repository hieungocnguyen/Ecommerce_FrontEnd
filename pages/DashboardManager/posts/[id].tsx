/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import API, { authAxios, endpoints } from "../../../API";
import LayoutDashboard from "../../../components/Dashboard/LayoutDashboardManager";
import Image from "next/image";
import { AiOutlineDelete } from "react-icons/ai";
import styled from "@emotion/styled";
import { TextField } from "@mui/material";
import Loader from "../../../components/Loader";
import toast, { Toaster } from "react-hot-toast";

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

const ItemsOfPost = (salePost) => {
   const router = useRouter();
   const { id } = router.query;
   const [items, setItems] = useState<any>([]);
   const [selectedImage, setSelectedImage] = useState();
   const [importImage, setImportImage] = useState(false);
   let [loading, setLoading] = useState(false);
   const [values, setValues] = useState({
      avatar: "",
      inventory: null,
      name: "",
      unitPrice: null,
   });

   const imageChange = (e) => {
      setSelectedImage(e.target.files[0]);
      setImportImage(true);
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
               description: "none",
            }
         );
         if (resCreate) {
            setLoading(false);
            loadItems();
         }
      } catch (error) {}
   };

   const loadItems = async () => {
      const resItems = await API.get(endpoints["salePost"](id));
      setItems(resItems.data.data.itemPostSet);
   };
   useEffect(() => {
      loadItems();
   }, []);

   const handleDeleteItem = async (id) => {
      const resPublish = await API.delete(endpoints["salePost"](id));
      loadItems();
      toast.success("Delete post successful!", {
         position: "bottom-center",
      });
   };

   return (
      <LayoutDashboard>
         <div className="w-[90%] mx-auto">
            <div className="font-semibold text-2xl my-8">
               {salePost.salePost.title}
            </div>
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
                        <div>{i.name}</div>
                     </div>
                     <div className="col-span-1 text-center">{i.unitPrice}</div>
                     <div className="col-span-1 text-center">{i.inventory}</div>
                     <div className="col-span-1 flex justify-end">
                        <div
                           className=" p-2 hover:bg-red-600 hover:bg-opacity-30 rounded-lg cursor-pointer"
                           onClick={() => handleDeleteItem(i.id)}
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
                     className="w-[30%]"
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
         {loading ? <Loader /> : <></>}
         <Toaster />
      </LayoutDashboard>
   );
};

export default ItemsOfPost;
export const getStaticProps = async (context) => {
   // request salepost detail
   const id = context.params.id;
   const resSalePost = await API.get(endpoints["salePost"](id));
   const salePost = await resSalePost.data.data;

   return { props: { salePost } };
};
export async function getStaticPaths(context) {
   if (process.env.SKIP_BUILD_STATIC_GENERATION) {
      return {
         paths: [],
         fallback: "blocking",
      };
   }

   const res = await API.get(
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
function setLoading(arg0: boolean) {
   throw new Error("Function not implemented.");
}
