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
} from "react-icons/bi";
import API, { endpoints } from "../../../API";
import LayoutDashboard from "../../../components/Dashboard/LayoutDashboardManager";
import Loader from "../../../components/Loader";
import { Store } from "../../../utils/Store";
import Image from "next/image";
import EditPost from "../../../components/Model/EditPost";
import dynamic from "next/dynamic";
import emptyBox from "../../../public/empty-box.png";

const Posts = () => {
   const { state, dispatch } = useContext(Store);
   const { userInfo, agencyInfo } = state;
   const [posts, setPosts] = useState<any>([]);
   const router = useRouter();
   const [postID, setPostID] = useState(0);
   const [loading, setLoading] = useState(false);
   // const [enabled, setEnabled] = useState(false);

   const loadPosts = async () => {
      try {
         const resPostsPublish = await API.get(
            endpoints["get_all_post_by_agencyID"](agencyInfo.id)
         );
         setPosts(resPostsPublish.data.data);
      } catch (error) {
         console.log(error);
      }
   };
   useEffect(() => {
      loadPosts();
   }, [postID]);

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

   return (
      <>
         <LayoutDashboard title="List Post">
            <div className="">
               <div className="flex justify-between items-center my-8">
                  <div className="font-semibold text-2xl">Post List</div>
               </div>
               {posts.length > 0 ? (
                  <div>
                     <div className="rounded-lg dark:bg-dark-primary bg-light-spot  overflow-hidden shadow-2xl dark:shadow-dark-shadow shadow-light-primary">
                        <ul className="grid grid-cols-12 p-5 dark:bg-dark-spot bg-light-primary items-center font-semibold">
                           <li className="col-span-1">Avatar</li>
                           <li className="col-span-3">Title</li>
                           <li className="col-span-2">Price</li>
                           <li className="col-span-2">Brand</li>
                           <li className="col-span-2">Category</li>
                           <li className="col-span-1">Publish</li>
                           <li className="col-span-1"></li>
                        </ul>
                        {posts
                           .sort((a, b) => (a.id > b.id ? -1 : 1))
                           .map((post) => (
                              <div key={post.id}>
                                 <ul className="grid grid-cols-12 p-5 items-center dark:hover:bg-dark-bg hover:bg-light-primary cursor-pointer relative">
                                    {/* <Link href={`/DashboardManager/posts/${post.id}`}> */}
                                    <div
                                       className="col-span-10 grid grid-cols-10 items-center"
                                       onClick={() => handleRouting(post.id)}
                                    >
                                       <li className="col-span-1">
                                          <Image
                                             src={post.avatar}
                                             alt=""
                                             width={42}
                                             height={42}
                                             className="object-cover rounded-xl"
                                          />
                                       </li>
                                       <li className="col-span-3">
                                          {post.title}
                                       </li>
                                       <li className="col-span-2">
                                          <div className="text-primary-color font-semibold">
                                             {post.finalPrice.toLocaleString(
                                                "it-IT",
                                                {
                                                   style: "currency",
                                                   currency: "VND",
                                                }
                                             )}
                                          </div>
                                          <div className="text-sm line-through opacity-80">
                                             {post.initialPrice.toLocaleString(
                                                "it-IT",
                                                {
                                                   style: "currency",
                                                   currency: "VND",
                                                }
                                             )}
                                          </div>
                                       </li>
                                       <li className="col-span-2">
                                          {post.brand}
                                       </li>
                                       <li className="col-span-2">
                                          {post.category.name}
                                       </li>
                                    </div>
                                    {/* </Link> */}
                                    <li className="col-span-1">
                                       <label className="relative inline-flex items-center cursor-pointer">
                                          <input
                                             type="checkbox"
                                             value=""
                                             className="sr-only peer"
                                             checked={
                                                post.isActive ? true : false
                                             }
                                             onClick={() => {
                                                if (
                                                   post.itemPostSet.length > 0
                                                ) {
                                                }
                                                if (post.isActive) {
                                                   handleUnpublishPost(post.id);
                                                } else {
                                                   if (
                                                      post.itemPostSet.length >
                                                      0
                                                   ) {
                                                      handlePublishPost(
                                                         post.id
                                                      );
                                                   } else {
                                                      toast.error(
                                                         "Can't publish when don't have any item in post!",
                                                         {
                                                            position:
                                                               "top-center",
                                                         }
                                                      );
                                                   }
                                                }
                                             }}
                                          />
                                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none  rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-color"></div>
                                       </label>
                                    </li>
                                    <li className="col-span-1 flex justify-end items-center gap-4 text-xl dark:text-white text-light-text absolute z-20 right-4">
                                       <div
                                          className="p-3 rounded-lg dark:bg-dark-spot bg-green-500 hover:shadow-lg hover:shadow-green-500 text-white"
                                          onClick={() => setPostID(post.id)}
                                       >
                                          <BiEdit className="" />
                                       </div>
                                       <div
                                          className="p-3 rounded-lg dark:bg-dark-spot bg-red-500 hover:shadow-lg hover:shadow-red-500 text-white"
                                          // onClick={() => {
                                          //    handleDeletePost(post.id);
                                          // }}
                                          onClick={() => {
                                             if (post.itemPostSet.length > 0) {
                                             }
                                             if (post.isActive) {
                                                handleUnpublishPost(post.id);
                                             } else {
                                                if (
                                                   post.itemPostSet.length > 0
                                                ) {
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
                                       >
                                          <BiTrashAlt />
                                       </div>
                                    </li>
                                 </ul>
                              </div>
                           ))}
                        <div
                           className={`fixed pt-10 top-0 right-0 w-full h-screen overflow-auto backdrop-blur-sm  justify-center z-20 ${
                              postID > 0 ? "flex" : "hidden"
                           }`}
                        >
                           <div className="w-3/4 h-fit">
                              <EditPost
                                 postID={postID}
                                 setPostID={setPostID}
                                 setLoading={setLoading}
                              />
                           </div>
                        </div>
                     </div>
                  </div>
               ) : (
                  <>
                     <div className="relative overflow-hidden aspect-square w-1/4 mx-auto">
                        <Image
                           src={emptyBox}
                           alt="empty"
                           layout="fill"
                           className="object-cover"
                        />
                     </div>
                     <div className="uppercase text-xl font-semibold text-center">
                        your post list is empty
                     </div>
                  </>
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
