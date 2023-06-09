import { BiCloudUpload } from "react-icons/bi";
import API, { endpoints } from "../../API";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
   ssr: false,
   loading: () => <p>Loading ...</p>,
});

const UpdateProgram = ({
   program,
   setIsOpenModelUpdateProgram,
   setLoading,
   fetchProgram,
}) => {
   const [selectedImage, setSelectedImage] = useState();
   const [importImage, setImportImage] = useState(false);
   const [value, setValue] = useState<any>({});
   const [description, setDescription] = useState("");

   useEffect(() => {
      if (program.description) {
         setDescription(program.description);
      }
   }, [program.id]);

   const handleSubmitUpdate = async (e) => {
      e.preventDefault();
      try {
         setLoading(true);
         let imageURL = program.avatar;

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
         const res = await API.put(
            endpoints["update_promotion_program"](program.id),
            {
               programName:
                  value.programName != undefined
                     ? value.programName
                     : program.programName,
               programTitle:
                  value.programTitle != undefined
                     ? value.programTitle
                     : program.programTitle,
               avatar: imageURL,
               description: description,
            }
         );
         if (res.data.code == "200") {
            setLoading(false);
            toast.success("Update successful");
            setIsOpenModelUpdateProgram(false);
            fetchProgram();
         }
      } catch (error) {
         setLoading(false);
         if (error.response.data.data.programTitle) {
            toast.error(`Title ${error.response.data.data.programTitle}`);
         }
         if (error.response.data.data.programName) {
            toast.error(`Name ${error.response.data.data.programName}`);
         }
         if (error.response.data.data.description) {
            toast.error(error.response.data.data.description);
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

   const handleChange = (event) => {
      setValue({
         ...value,
         [event.target.name]: event.target.value,
      });
   };

   return (
      <div className="dark:bg-neutral-800 bg-light-primary rounded-lg w-full h-full relative p-6 shadow-lg border-2 border-primary-color">
         <div className="flex justify-between items-center mb-4">
            <div className="font-semibold text-lg">Update Program</div>
            <div
               className="py-2 px-4 text-primary-color hover:bg-primary-color rounded-lg hover:text-white font-semibold bg-light-bg transition-all cursor-pointer border-2 border-primary-color"
               onClick={() => setIsOpenModelUpdateProgram(false)}
            >
               Close
            </div>
         </div>
         <form
            onSubmit={handleSubmitUpdate}
            className="grid grid-cols-12 gap-4 h-[350px] overflow-auto"
         >
            <div className=" col-span-5 relative overflow-hidden w-full aspect-square rounded-xl">
               <Image
                  src={
                     selectedImage
                        ? URL.createObjectURL(selectedImage)
                        : program.avatar
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
            <div className="col-span-7">
               <div className="flex flex-col items-start">
                  <label htmlFor="programTitle" className="font-medium text-sm">
                     Title
                  </label>
                  <input
                     type="text"
                     id="programTitle"
                     name="programTitle"
                     min={1}
                     max={200}
                     className="p-3 w-full rounded-lg"
                     value={
                        value.programTitle != undefined
                           ? value.programTitle
                           : program.programTitle
                     }
                     onChange={(e) => handleChange(e)}
                  />
               </div>
               <div className="flex flex-col items-start">
                  <label htmlFor="programName" className="font-medium text-sm">
                     Name
                  </label>
                  <input
                     type="text"
                     id="programName"
                     name="programName"
                     min={1}
                     max={200}
                     className="p-3 w-full rounded-lg"
                     value={
                        value.programName != undefined
                           ? value.programName
                           : program.programName
                     }
                     onChange={(e) => handleChange(e)}
                  />
               </div>

               <div className="">
                  <label htmlFor="description" className="font-medium text-sm">
                     Description
                  </label>
                  <QuillNoSSRWrapper
                     theme="snow"
                     value={description}
                     onChange={setDescription}
                     className="bg-light-bg dark:bg-dark-bg"
                  />
               </div>
            </div>
            <button
               type="submit"
               className="col-span-12 text-center p-3 bg-primary-color rounded-lg hover:shadow-lg hover:shadow-primary-color text-white font-semibold"
            >
               Update
            </button>
         </form>
      </div>
   );
};

export default UpdateProgram;
