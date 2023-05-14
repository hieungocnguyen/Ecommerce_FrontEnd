import React, { useEffect, useState } from "react";
import AdminLayoutDashboard from "../../components/Dashboard/AdminLayoutDashboard";
import API, { endpoints } from "../../API";
import Image from "next/image";
import CreateCategory from "../../components/Model/CreateCategory";
import { BiListPlus } from "react-icons/bi";
import EditCategory from "../../components/Model/EditCategory";
import { toast } from "react-hot-toast";
import Loader from "../../components/Loader";

const CategoryManage = () => {
   const [categoryList, setCategoryList] = useState([]);
   const [IDOpenEditCategoryModel, setIDOpenEditCategoryModel] = useState(-1);
   const [categoryInfo, setCategoryInfo] = useState({});
   const [IDOpenCreateCategoryModel, setIDOpenCreateCategoryModel] =
      useState(false);
   const [loading, setLoading] = useState(false);

   const fetchCategory = async () => {
      try {
         const { data } = await API.get(endpoints["get_all_category_by_admin"]);
         setCategoryList(data.data);
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      fetchCategory();
   }, [IDOpenCreateCategoryModel, IDOpenEditCategoryModel]);

   const handleDeactiveCategory = async (categoryID) => {
      try {
         const res = await API.post(endpoints["update_category"](categoryID), {
            active: 0,
         });
         fetchCategory();
         toast.success("Deactive category successful!");
      } catch (error) {
         console.log(error);
         toast.error("Failed, try again!");
      }
   };
   const handleActiveCategory = async (categoryID) => {
      try {
         const res = await API.post(endpoints["update_category"](categoryID), {
            active: 1,
         });
         fetchCategory();
         toast.success("Active category successful!");
      } catch (error) {
         console.log(error);
         toast.error("Failed, try again!");
      }
   };

   return (
      <AdminLayoutDashboard title="Category Manage">
         <div className="w-[95%] mx-auto my-8">
            <div className="font-semibold text-2xl">Category List</div>

            <div className="grid grid-cols-4 gap-4 mt-8">
               {categoryList.map((category) => (
                  <div
                     key={category.id}
                     className="bg-light-primary dark:bg-dark-primary rounded-lg flex gap-2 items-center p-2 h-24"
                  >
                     <div className="relative w-20 aspect-square overflow-hidden bg-white rounded-xl">
                        <Image
                           src={category.avatar}
                           alt="avatar"
                           layout="fill"
                           className="object-cover"
                        />
                     </div>
                     <div className="">
                        <div className="font-medium text-sm">
                           {category.name}
                        </div>
                        <div className="flex gap-2 mt-2 items-center">
                           <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                 type="checkbox"
                                 value=""
                                 className="sr-only peer"
                                 checked={category.active ? true : false}
                                 onClick={() => {
                                    if (category.active == 1) {
                                       handleDeactiveCategory(category.id);
                                    } else {
                                       handleActiveCategory(category.id);
                                    }
                                 }}
                              />
                              <div className="w-11 h-6 bg-white peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-primary-color after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-color"></div>
                           </label>
                           <div
                              className="text-sm cursor-pointer font-semibold text-primary-color"
                              onClick={() => {
                                 setIDOpenEditCategoryModel(category.id);
                                 setCategoryInfo(category);
                              }}
                           >
                              Edit
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
               <div
                  className="bg-light-primary dark:bg-dark-primary rounded-lg p-2 h-24 flex justify-center items-center hover:text-primary-color cursor-pointer hover:bg-opacity-70"
                  onClick={() => {
                     setIDOpenCreateCategoryModel(true);
                  }}
               >
                  <BiListPlus className="text-4xl" />
               </div>
            </div>
         </div>
         {IDOpenEditCategoryModel > 0 && (
            <div
               className={`absolute top-0 right-0 w-full h-screen backdrop-blur-sm items-center justify-center ${
                  IDOpenEditCategoryModel > 0 ? "flex" : "hidden"
               }`}
            >
               <div className="w-1/3 ">
                  <EditCategory
                     setIDOpenEditCategoryModel={setIDOpenEditCategoryModel}
                     IDOpenEditCategoryModel={IDOpenEditCategoryModel}
                     categoryInfo={categoryInfo}
                     setCategoryInfo={setCategoryInfo}
                     setLoading={setLoading}
                  />
               </div>
            </div>
         )}
         {IDOpenCreateCategoryModel && (
            <div
               className={`absolute top-0 right-0 w-full h-screen backdrop-blur-sm items-center justify-center ${
                  IDOpenCreateCategoryModel ? "flex" : "hidden"
               }`}
            >
               <div className="w-1/3 ">
                  <CreateCategory
                     setIDOpenCreateCategoryModel={setIDOpenCreateCategoryModel}
                     IDOpenCreateCategoryModel={IDOpenCreateCategoryModel}
                     setLoading={setLoading}
                  />
               </div>
            </div>
         )}
         {loading && <Loader />}
      </AdminLayoutDashboard>
   );
};

export default CategoryManage;
