import { useContext, useEffect, useState } from "react";
import LayoutDashboardManager from "../../components/Dashboard/LayoutDashboardManager";
import Image from "next/image";
import toast from "react-hot-toast";
import { BiCloudUpload, BiPencil } from "react-icons/bi";
import { Store } from "../../utils/Store";
import API, { endpoints } from "../../API";
import dynamic from "next/dynamic";
import Cookies from "js-cookie";
import AddressSelect from "../../components/Model/AddressSelect";
import AddressSelectAgency from "../../components/Model/AddressSelectAgency";
import router from "next/router";

const EditInfo = () => {
   const { state, dispatch } = useContext(Store);
   const { agencyInfo } = state;
   const [selectedImage, setSelectedImage] = useState();
   const [importImage, setImportImage] = useState(false);
   const [agency, setAgency] = useState<any>();
   const [address, setAddress] = useState("");
   const [isOpenAddressSelect, setIsOpenAddressSelect] = useState(false);
   const [addresCode, setAddressCode] = useState<any>({});

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

   //    const fetchAngecy = async () => {
   //       try {
   //          const res = await API.get(endpoints["agency_info"](agencyInfo.id));
   //          setAgency(res.data.data);
   //       } catch (error) {
   //          console.log(error);
   //       }
   //    };
   useEffect(() => {
      if (agencyInfo) {
         //  fetchAngecy();
         setAgency(agencyInfo);
         setAddress(agencyInfo.fromAddress);
      }
   }, [agencyInfo]);

   const handleAgencyChange = (event) => {
      setAgency({
         ...agency,
         [event.target.name]: event.target.value,
      });
   };

   const handleUpdateInfo = async (e) => {
      e.preventDefault();
      try {
         let imageURL = agency.avatar;

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

         const res = await API.put(endpoints["agency_info"](agencyInfo.id), {
            ...agency,
            avatar: imageURL,
            provinceID: addresCode.provinceID
               ? Number(addresCode.provinceID)
               : Number(agency.provinceID),
            fromProvinceName: addresCode.ProvinceName
               ? addresCode.ProvinceName
               : agency.fromProvinceName,
            districtID: addresCode.districtID
               ? Number(addresCode.districtID)
               : Number(agency.districtID),
            fromDistrictName: addresCode.DistrictName
               ? addresCode.DistrictName
               : agency.fromDistrictName,
            wardID: addresCode.wardID ? addresCode.wardID : agency.wardID,
            fromWardName: addresCode.WardName
               ? addresCode.WardName
               : agency.fromWardName,
            fromAddress: addresCode.street
               ? `${addresCode.street}, ${addresCode.WardName}, ${addresCode.DistrictName}, ${addresCode.ProvinceName}`
               : agency.fromAddress,
            isUpdateLocation: addresCode.street ? 1 : 0,
         });

         Cookies.set("agencyInfo", JSON.stringify(res.data.data));
         dispatch({ type: "AGENCY_INFO_SET", payload: res.data.data });
         toast.success("Update infomation sucessful!");
         router.push("/DashboardManager");
      } catch (error) {
         console.log(error);
         toast.error("Something wrong, please try again!");
      }
   };

   return (
      <LayoutDashboardManager title="Edit Profile">
         <div className="w-[95%] mx-auto my-8">
            <div className="font-semibold text-2xl">Edit Profile</div>
            <div className="mt-6">
               {agency && (
                  <form
                     className="grid grid-cols-12 gap-8 mx-24"
                     onSubmit={handleUpdateInfo}
                  >
                     <div className="col-span-3">
                        <div className="relative overflow-hidden w-full aspect-square rounded-xl">
                           <Image
                              src={
                                 selectedImage
                                    ? URL.createObjectURL(selectedImage)
                                    : agency.avatar
                              }
                              alt="avatar"
                              layout="fill"
                              className="object-cover"
                           />
                           <label
                              className={`absolute w-full h-full top-0 left-0 dark:hover:bg-dark-primary hover:bg-light-primary hover:opacity-90 opacity-0  z-20 cursor-pointer`}
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
                        <div className="mt-2 text-gray-500 font-medium text-sm italic">
                           *Maximum image size 2MB
                        </div>
                     </div>

                     <div className="col-span-9">
                        <div className="grid grid-cols-12 gap-4 text-left font-medium">
                           <div className="col-span-12">
                              <label htmlFor="name" className="">
                                 Name
                              </label>
                              <input
                                 type="text"
                                 name="name"
                                 id="name"
                                 required
                                 className="p-4 rounded-lg bg-light-primary dark:bg-dark-primary w-full"
                                 onChange={handleAgencyChange}
                                 defaultValue={agency.name}
                              />
                           </div>
                           <div className="col-span-6">
                              <label htmlFor="hotline" className="">
                                 Hotline
                              </label>
                              <input
                                 type="text"
                                 name="hotline"
                                 id="hotline"
                                 required
                                 className="p-4 rounded-lg bg-light-primary dark:bg-dark-primary w-full"
                                 onChange={handleAgencyChange}
                                 defaultValue={agency.hotline}
                              />
                           </div>
                           <div className="col-span-12">
                              <label htmlFor="address" className="">
                                 Address
                              </label>
                              <div className="grid grid-cols-12 gap-4">
                                 <input
                                    name="address"
                                    id="address"
                                    placeholder="Address"
                                    disabled
                                    className="col-span-10 p-4 rounded-lg w-full"
                                    value={address}
                                 />
                                 <button
                                    className="col-span-2 border-2 border-primary-color rounded-lg text-2xl text-primary-color flex justify-center items-center hover:bg-primary-color hover:text-white"
                                    type="button"
                                    onClick={() => setIsOpenAddressSelect(true)}
                                 >
                                    <BiPencil />
                                 </button>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="col-span-12 my-8 text-right">
                        <button
                           className="px-4 py-3 bg-primary-color text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-primary-color transition-all"
                           type="submit"
                        >
                           Update information
                        </button>
                     </div>
                  </form>
               )}
            </div>
            <div
               className={`fixed top-0 right-0 w-full h-screen backdrop-blur-sm items-center justify-center z-20 ${
                  isOpenAddressSelect ? "flex" : "hidden"
               }`}
            >
               {isOpenAddressSelect && (
                  <div className="w-3/5 h-fit">
                     <AddressSelectAgency
                        setAddress={setAddress}
                        setAddressCode={setAddressCode}
                        setIsOpenAddressSelect={setIsOpenAddressSelect}
                        isOpenAddressSelect={isOpenAddressSelect}
                     />
                  </div>
               )}
            </div>
         </div>
      </LayoutDashboardManager>
   );
};

// export default EditInfo;
export default dynamic(() => Promise.resolve(EditInfo), { ssr: false });
