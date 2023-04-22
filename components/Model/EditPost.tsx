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
      try {
         const { data } = await API.get(endpoints["salePost"](postID));
         setPost(data.data);
      } catch (error) {
         console.log(error);
      }
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
                  className="grid grid-cols-4 gap-4"
                  onSubmit={handleUpdatePost}
               >
                  <div className="col-span-1 dark:bg-neutral-800 bg-light-primary rounded-lg flex flex-col items-center h-fit px-4">
                     <div className="relative overflow-hidden w-full aspect-square rounded-xl">
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
                     <div className="font-medium mt-1">Avatar</div>
                     <div className="mt-2 text-gray-500 font-medium text-sm italic">
                        *Maximum image size 2MB
                     </div>
                  </div>
                  <div className="col-span-3 dark:bg-neutral-800 bg-light-spot rounded-lg p-4">
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
                              accept="image/png, image/jpeg"
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
