/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import {
   BiEditAlt,
   BiPlus,
   BiImages,
   BiEdit,
   BiTrashAlt,
   BiLayerPlus,
} from "react-icons/bi";
import API, { endpoints } from "../../../API";
import LayoutDashboard from "../../../components/Dashboard/LayoutDashboardManager";
import Loader from "../../../components/Loader";
import { Store } from "../../../utils/Store";
import Image from "next/image";
import EditPost from "../../../components/Model/EditPost";
import dynamic from "next/dynamic";
import emptyBox from "../../../public/empty-box.png";
import PaginationComponent from "../../../components/Pagination";

const Posts = () => {
   const { state, dispatch } = useContext(Store);
   const { userInfo, agencyInfo } = state;
   const [posts, setPosts] = useState<any>([]);
   const router = useRouter();
   const [postID, setPostID] = useState(0);
   const [loading, setLoading] = useState(false);
   // const [enabled, setEnabled] = useState(false);

   //pagination
   const lengthOfPage = 6;
   const [pageCurrent, setPageCurrent] = useState(1);
   const [totalPage, setTotalPage] = useState(0);
   const [keywordSearch, setKeywordSearch] = useState("");

   const loadPosts = async () => {
      try {
         const resPostsPublish = await API.get(
            endpoints["get_all_post_by_agencyID"](agencyInfo.id)
         );
         setPosts(resPostsPublish.data.data);
         setTotalPage(
            Math.ceil(resPostsPublish.data.data.length / lengthOfPage)
         );
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      loadPosts();
   }, [postID]);

   useEffect(() => {
      setTotalPage(Math.ceil(FilterArray(posts).length / lengthOfPage));
   }, [keywordSearch]);

   const handlePublishPost = async (id) => {
      try {
         const resPublish = await API.patch(endpoints["publish_salePost"](id));
         loadPosts();
         toast.success("Change state successful!", {
            position: "top-center",
         });
      } catch (error) {
         console.log(error);
      }
   };
   const handleUnpublishPost = async (id) => {
      try {
         const resPublish = await API.patch(
            endpoints["unpublish_salePost"](id)
         );
         loadPosts();
         toast.success("Change state successful!", {
            position: "top-center",
         });
      } catch (error) {
         console.log(error);
      }
   };
   const handleDeletePost = async (id) => {
      try {
         const resPublish = await API.delete(endpoints["salePost"](id));
         loadPosts();
         toast.success("Delete post successful!", {
            position: "top-center",
         });
      } catch (error) {
         console.log(error);
      }
   };
   const handleRouting = async (id) => {
      router.push(`/DashboardManager/posts/${id}`);
   };

   const FilterArray = (array) => {
      let resultArray;
      try {
         resultArray = array.filter(
            (post) =>
               unicodeParse(post.title)
                  .toUpperCase()
                  .search(unicodeParse(keywordSearch)) >= 0
         );
      } catch (error) {
         resultArray = array;
      }

      // let resultArray = array.filter(
      //    (post) =>
      //       unicodeParse(post.title)
      //          .toUpperCase()
      //          .search(unicodeParse(keywordSearch)) >= 0
      // );

      return resultArray;
   };

   const unicodeParse = (string) => {
      return string
         .normalize("NFD")
         .replace(/[\u0300-\u036f]/g, "")
         .replace(/đ/g, "d")
         .replace(/Đ/g, "D");
   };

   return (
      <>
         <LayoutDashboard title="List Post">
            <div className="mx-auto my-8">
               <div className="flex justify-between items-center mt-8">
                  <div className="font-semibold text-2xl">Post List</div>
                  <input
                     type="text"
                     placeholder="🔎Search post"
                     className="p-3 rounded-lg border-2 border-primary-color"
                     onKeyDown={(e) => {
                        ["(", ")", "`", "`", "[", "]", "?", "\\"].includes(
                           e.key
                        ) && e.preventDefault();
                     }}
                     onChange={(e) => {
                        setKeywordSearch(e.target.value.toUpperCase());
                        setPageCurrent(1);
                     }}
                  />
               </div>
               <div className="grid grid-cols-12 gap-2 font-semibold px-2 py-4 dark:bg-dark-primary bg-light-primary rounded-lg text-center my-4">
                  <div className="col-span-1">Avatar</div>
                  <div className="col-span-3">Title</div>
                  <div className="col-span-2">Price</div>
                  <div className="col-span-2">Brand</div>
                  <div className="col-span-2">Category</div>
                  <div className="col-span-1">Publish</div>
                  <div className="col-span-1"></div>
               </div>
               {FilterArray(posts)
                  .sort((a, b) => (a.id > b.id ? -1 : 1))
                  .slice(
                     (pageCurrent - 1) * lengthOfPage,
                     (pageCurrent - 1) * lengthOfPage + lengthOfPage
                  )
                  .map((post) => (
                     <div
                        className="grid grid-cols-12 gap-2 items-center  dark:bg-dark-primary bg-light-spot rounded-lg mb-4 py-4 px-2 font-medium text-center hover:brightness-95 cursor-pointer transition-all"
                        key={post.id}
                     >
                        <div
                           className="col-span-10 grid grid-cols-10 items-center"
                           onClick={() => handleRouting(post.id)}
                        >
                           <div className="col-span-1 relative w-2/3 mx-auto aspect-square overflow-hidden rounded-xl">
                              <Image
                                 src={post.avatar}
                                 alt="img"
                                 layout="fill"
                                 className="object-cover"
                              />
                           </div>
                           <div className="col-span-3 text-left">
                              {post.title}
                           </div>
                           <div className="col-span-2">
                              <div className="text-primary-color font-semibold">
                                 {post.finalPrice.toLocaleString("it-IT", {
                                    style: "currency",
                                    currency: "VND",
                                 })}
                              </div>
                              <div className="text-sm line-through opacity-80">
                                 {post.initialPrice.toLocaleString("it-IT", {
                                    style: "currency",
                                    currency: "VND",
                                 })}
                              </div>
                           </div>
                           <div className="col-span-2">{post.brand}</div>
                           <div className="col-span-2">
                              {post.category.name}
                           </div>
                        </div>
                        <div className="col-span-1 flex justify-center">
                           <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                 type="checkbox"
                                 value=""
                                 className="sr-only peer"
                                 checked={post.isActive ? true : false}
                                 onClick={(e) => {
                                    e.stopPropagation();
                                    if (post.itemPostSet.length > 0) {
                                    }
                                    if (post.isActive) {
                                       handleUnpublishPost(post.id);
                                    } else {
                                       if (post.itemPostSet.length > 0) {
                                          handlePublishPost(post.id);
                                       } else {
                                          toast.error(
                                             "Can't publish when don't have any item in post!",
                                             {
                                                position: "top-center",
                                             }
                                          );
                                       }
                                    }
                                 }}
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none  rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-color"></div>
                           </label>
                        </div>
                        <div className="col-span-1 flex justify-end items-center gap-3 text-xl dark:text-white text-light-text">
                           <div
                              className="p-3 rounded-lg bg-secondary-color hover:shadow-lg hover:shadow-secondary-color text-dark-primary hover:brightness-90"
                              onClick={() => setPostID(post.id)}
                           >
                              <BiEdit className="" />
                           </div>
                           <div
                              className="p-3 rounded-lg bg-secondary-color hover:shadow-lg hover:shadow-secondary-color text-dark-primary hover:brightness-90"
                              // onClick={() => {
                              //    if (post.itemPostSet.length > 0) {
                              //    }
                              //    if (post.isActive) {
                              //       handleUnpublishPost(post.id);
                              //    } else {
                              //       if (post.itemPostSet.length > 0) {
                              //          handlePublishPost(post.id);
                              //       } else {
                              //          toast.error(
                              //             "Can't publish when don't have any item in post!",
                              //             {
                              //                position: "top-center",
                              //             }
                              //          );
                              //       }
                              //    }
                              // }}
                              onClick={() => handleRouting(post.id)}
                           >
                              <BiLayerPlus />
                           </div>
                        </div>
                     </div>
                  ))}

               {/* paginate */}
               <PaginationComponent
                  totalPage={totalPage}
                  pageCurrent={pageCurrent}
                  setPageCurrent={setPageCurrent}
               />
            </div>

            {FilterArray(posts).length == 0 && (
               <div className="relative overflow-hidden aspect-square w-1/4 mx-auto">
                  <Image
                     src={emptyBox}
                     alt="empty"
                     layout="fill"
                     className="object-cover"
                  />
               </div>
            )}

            {/* Model Edit  */}
            <div
               className={`fixed pt-10 top-0 right-0 w-full h-screen overflow-auto backdrop-blur-sm  justify-center z-20 ${
                  postID > 0 ? "flex" : "hidden"
               }`}
            >
               {postID > 0 && (
                  <div className="w-3/4 h-fit">
                     <EditPost
                        postID={postID}
                        setPostID={setPostID}
                        setLoading={setLoading}
                     />
                  </div>
               )}
            </div>
            {loading ? <Loader /> : <></>}
            <Toaster />
         </LayoutDashboard>
      </>
   );
};

// export default Posts;
export default dynamic(() => Promise.resolve(Posts), { ssr: false });
