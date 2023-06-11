import { useContext, useState } from "react";
import { Store } from "../../utils/Store";
import API, { endpoints } from "../../API";
import Image from "next/image";
import toast from "react-hot-toast";
import { BiCloudUpload } from "react-icons/bi";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
   ssr: false,
   loading: () => <p>Loading ...</p>,
});

const AddPromotion = ({ posts, setisOpenModel, agencyInfo, setLoading }) => {
   const [selectedImage, setSelectedImage] = useState();
   const [importImage, setImportImage] = useState(false);
   const [checked, setChecked] = useState([]);
   const [ischeckedALL, setIsCheckedALL] = useState(false);
   const [dateUsable, setDateUsable] = useState<any>([]);
   const [description, setDescription] = useState("");
   //0:DECREASE_BY_PERCENTAGE 1:DECREASE_BY_AMOUNT
   const [reductionType, setReductionType] = useState(0);
   const [reductionAmountMax, setReductionAmountMax] = useState("");
   const [percentageReduction, setPercentageReduction] = useState(0);

   const [programTitle, setProgramTitle] = useState("");
   const [programName, setProgramName] = useState("");

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

   const handleSubmitAddProgram = async (e) => {
      e.preventDefault();
      try {
         let imageURL = "";
         if (selectedImage === undefined) {
            toast.error("Please upload an image for this program! ");
            return;
         }
         if (checked.length == 0 && ischeckedALL == false) {
            toast.error("Please select products in program");
            return;
         }
         setLoading(true);
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

         const resSubmit = await API.post(
            endpoints["create_promotion_program"](agencyInfo.id),
            {
               availableSku: ischeckedALL ? `ALL` : `;${checked.join(";")};`,
               avatar: imageURL,
               beginUsable: formatDate(new Date(dateUsable[0])),
               description: description,
               endUsable: formatDate(new Date(dateUsable[1])),
               percentageReduction:
                  reductionType == 0 ? percentageReduction : 100,
               programName: programName,
               programTitle: programTitle,
               reductionAmountMax: reductionAmountMax.replace(
                  /[^a-zA-Z0-9 ]/g,
                  ""
               ),
               reductionType: `${
                  reductionType == 0
                     ? "DECREASE_BY_PERCENTAGE"
                     : "DECREASE_BY_AMOUNT"
               }`,
            }
         );
         if (resSubmit.data.code == "400") {
            toast.error(resSubmit.data.message);
         } else {
            setisOpenModel(false);
            toast.success("Add successful!");
            e.target.reset();
            setDescription("");
            setDateUsable([]);
            setImportImage(false);
            setSelectedImage(undefined);
            setIsCheckedALL(false);
         }
         setLoading(false);
      } catch (error) {
         console.log(error);
         setLoading(false);
         setisOpenModel(false);
         if (error.response.data.data.programTitle) {
            toast.error(`Title: ${error.response.data.data.programTitle}`);
         }
         if (error.response.data.data.programName) {
            toast.error(`Name: ${error.response.data.data.programName}`);
         }
         if (error.response.data.data.reductionType) {
            toast.error(
               `reductionType: ${error.response.data.data.reductionType}`
            );
         }
         if (error.response.data.data.beginUsable) {
            toast.error(`beginUsable: ${error.response.data.data.beginUsable}`);
         }
         if (error.response.data.data.endUsable) {
            toast.error(`endUsable: ${error.response.data.data.endUsable}`);
         }
         if (error.response.data.data.percentageReduction) {
            toast.error(
               `percentageReduction: ${error.response.data.data.percentageReduction}`
            );
         }
         if (error.response.data.data.reductionAmountMax) {
            toast.error(
               `reductionAmountMax: ${error.response.data.data.reductionAmountMax}`
            );
         }
         if (error.response.data.data.availableSku) {
            toast.error(
               `availableSku: ${error.response.data.data.availableSku}`
            );
         }
      }
   };

   const handleCheckPost = (event) => {
      var updatedList = [...checked];
      if (event.target.checked) {
         updatedList = [...checked, event.target.value];
      } else {
         updatedList.splice(checked.indexOf(event.target.value), 1);
      }
      setChecked(updatedList);
   };

   //format date
   function padTo2Digits(num) {
      return num.toString().padStart(2, "0");
   }
   function formatDate(date) {
      return (
         [
            padTo2Digits(date.getDate()),
            padTo2Digits(date.getMonth() + 1),
            date.getFullYear(),
         ].join("/") +
         " " +
         [
            padTo2Digits(date.getHours()),
            padTo2Digits(date.getMinutes()),
            padTo2Digits(date.getSeconds()),
         ].join(":")
      );
   }

   //format currency
   const currencyFormat = (e) => {
      let value = e.target.value;
      value = value.replace(/\D/g, "");
      value = value.replace(/(\d)(\d{3})$/, "$1.$2");
      value = value.replace(/(?=(\d{3})+(\D))\B/g, ".");
      e.target.value = value;
      return e;
   };

   return (
      <div className="dark:bg-neutral-800 bg-light-primary rounded-lg w-full h-full relative p-8 shadow-lg shadow-light-primary dark:shadow-dark-primary border-2 border-primary-color">
         <div className="flex justify-between items-center mb-4">
            <div className="font-semibold text-xl">Add a promotion program</div>
            <div
               className="py-2 px-4 text-primary-color hover:bg-primary-color rounded-lg hover:text-white font-semibold bg-light-bg transition-all cursor-pointer border-2 border-primary-color"
               onClick={() => setisOpenModel(false)}
            >
               Close
            </div>
         </div>
         <form
            onSubmit={handleSubmitAddProgram}
            className="grid grid-cols-3 gap-6 h-[585px] overflow-auto"
         >
            <div className="flex flex-col space-y-2">
               <div className="relative overflow-hidden w-full h-56 rounded-xl">
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
                        accept="image/png, image/jpeg"
                     />
                  </label>
               </div>
               <div className="flex flex-col items-start">
                  <label htmlFor="programTitle" className="font-medium text-sm">
                     Title
                  </label>
                  <input
                     type="text"
                     id="programTitle"
                     className="p-3 w-full rounded-lg"
                     onChange={(e) => setProgramTitle(e.target.value)}
                  />
               </div>
               <div className="flex flex-col items-start">
                  <label htmlFor="programName" className="font-medium text-sm">
                     Name
                  </label>
                  <input
                     type="text"
                     id="programName"
                     className="p-3 w-full rounded-lg"
                     onChange={(e) => setProgramName(e.target.value)}
                  />
               </div>
            </div>

            <div className="flex flex-col space-y-2">
               <div className="p-4 border-2 border-primary-color rounded-xl h-fit">
                  <div className="flex items-center">
                     <input
                        id="postALL"
                        type="checkbox"
                        className="w-5 h-5 rounded accent-primary-color"
                        onChange={() => {
                           setIsCheckedALL(!ischeckedALL);
                        }}
                     />
                     <label
                        htmlFor="postALL"
                        className="ml-2 text-sm font-medium"
                     >
                        ALL PRODUCT
                     </label>
                  </div>
                  <div className="w-[90] h-[1px] mx-auto bg-gray-500 my-2"></div>
                  <div className="flex flex-col space-y-3 h-[228px] overflow-auto">
                     {posts.map((post) => (
                        <div key={post.id} className="flex items-center">
                           <input
                              id={`post${post.id}`}
                              type="checkbox"
                              value={post.id}
                              className="w-5 h-5 rounded accent-primary-color"
                              onChange={handleCheckPost}
                              disabled={ischeckedALL ? true : false}
                           />
                           <label
                              htmlFor={`post${post.id}`}
                              className="ml-2 text-sm font-medium line-clamp-1"
                           >
                              {post.title}
                           </label>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="flex flex-col items-start">
                  <label htmlFor="beginUsable" className="font-medium text-sm">
                     Begin usable
                  </label>
                  <input
                     type="datetime-local"
                     name=""
                     id="beginUsable"
                     required
                     className="p-3 rounded-lg w-full"
                     defaultValue={dateUsable[0]}
                     onChange={(e) =>
                        setDateUsable([e.target.value, dateUsable[1]])
                     }
                  />
               </div>
            </div>
            <div className="flex flex-col space-y-2">
               <div className="h-[300px] flex flex-col space-y-2">
                  <div className="text-center font-semibold text-lg">
                     Reduction Type
                  </div>
                  <div className="grid grid-cols-2 gap-8 pb-2">
                     <div>
                        <input
                           type="radio"
                           id="percentage"
                           name="hosting"
                           value="hosting-small"
                           className="hidden peer"
                           checked={reductionType === 0}
                           required
                        />
                        <label
                           htmlFor="percentage"
                           className="inline-flex items-center justify-between w-full transition-all p-5 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600"
                           onClick={() => setReductionType(0)}
                        >
                           <div className="w-full flex justify-center items-center gap-2">
                              <div className="font-semibold">PERCENTAGE</div>
                           </div>
                        </label>
                     </div>
                     <div>
                        <input
                           type="radio"
                           id="amount"
                           name="hosting"
                           value="hosting-small"
                           className="hidden peer"
                           required
                        />
                        <label
                           htmlFor="amount"
                           className="inline-flex items-center justify-between w-full transition-all p-5 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600"
                           onClick={() => setReductionType(1)}
                        >
                           <div className="w-full flex justify-center items-center gap-2">
                              <div className="font-semibold">AMOUNT</div>
                           </div>
                        </label>
                     </div>
                  </div>
                  <div className="rounded-xl border-2 border-primary-color p-4 flex flex-col space-y-2">
                     {reductionType == 0 && (
                        <>
                           <div className="flex flex-col items-start">
                              <label
                                 htmlFor="percentageReduction"
                                 className="font-medium text-sm"
                              >
                                 Percentage Reduction (%)
                              </label>
                              <input
                                 type="number"
                                 max={100}
                                 min={1}
                                 required
                                 id="percentageReduction"
                                 value={percentageReduction}
                                 className="p-3 w-full rounded-lg"
                                 onKeyDown={(e) => {
                                    ["e", "E", "+", "-", ".", ","].includes(
                                       e.key
                                    ) && e.preventDefault();
                                 }}
                                 onChange={(e) => {
                                    // if (Number(e.target.value) > 100) {
                                    //    setPercentageReduction(100);
                                    // } else {
                                    //    setPercentageReduction(
                                    //       Number(e.target.value)
                                    //    );
                                    // }
                                    setPercentageReduction(
                                       Number(e.target.value)
                                    );
                                 }}
                              />
                           </div>
                        </>
                     )}
                     <div className="flex flex-col items-start">
                        <label
                           htmlFor="reductionAmountMax"
                           className="font-medium text-sm"
                        >
                           Reduction Amount Max (VND)
                        </label>
                        <input
                           type="text"
                           required
                           id="reductionAmountMax"
                           className="p-3 w-full rounded-lg"
                           value={reductionAmountMax}
                           onChange={(e) =>
                              setReductionAmountMax(
                                 currencyFormat(e).target.value
                              )
                           }
                        />
                     </div>
                  </div>
               </div>
               <div className="flex flex-col items-start">
                  <label htmlFor="endUsable" className="font-medium text-sm">
                     End usable
                  </label>
                  <input
                     type="datetime-local"
                     name=""
                     id="endUsable"
                     className="p-3 rounded-lg w-full"
                     required
                     defaultValue={dateUsable[1]}
                     onChange={(e) =>
                        setDateUsable([dateUsable[0], e.target.value])
                     }
                  />
               </div>
            </div>
            <div className="col-span-3">
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
            <div className="col-span-3 mx-auto">
               <button
                  type="submit"
                  className="p-3 bg-primary-color text-white font rounded-lg font-semibold"
               >
                  Add program
               </button>
            </div>
         </form>
      </div>
   );
};

export default AddPromotion;
