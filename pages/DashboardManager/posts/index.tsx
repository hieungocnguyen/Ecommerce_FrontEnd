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
import EditPost from "../../../components/EditPost";

const Posts = () => {
   const { state, dispatch } = useContext(Store);
   const { userInfo, agencyInfo } = state;
   const [posts, setPosts] = useState<any>([]);
   const router = useRouter();
   const [postID, setPostID] = useState(0);
   const [loading, setLoading] = useState(false);
   // const [enabled, setEnabled] = useState(false);

   const loadPosts = async () => {
      const resPosts = await API.post(endpoints["search_salePost"], {
         nameOfAgency: agencyInfo.name,
      });
      setPosts(resPosts.data.data.listResult);
   };
   useEffect(() => {
      loadPosts();
   }, [postID]);

   const handlePublishPost = async (id) => {
      const resPublish = await API.patch(endpoints["publish_salePost"](id));
      loadPosts();
      toast.success("Change state successful!", {
         position: "bottom-center",
      });
   };
   const handleUnpublishPost = async (id) => {
      const resPublish = await API.patch(endpoints["unpublish_salePost"](id));
      loadPosts();
      toast.success("Change state successful!", {
         position: "bottom-center",
      });
   };
   const handleDeletePost = async (id) => {
      const resPublish = await API.delete(endpoints["salePost"](id));
      loadPosts();
      toast.success("Delete post successful!", {
         position: "bottom-center",
      });
   };
   const handleRouting = async (id) => {
      setTimeout(() => setLoading(true));
      router.push(`/DashboardManager/posts/${id}`);
      setLoading(false);
   };

   return (
      <>
         <LayoutDashboard>
            <div className="relative">
               <div className="flex justify-between items-center my-8">
                  <div className="font-semibold text-2xl">Post List</div>
               </div>
               <div className="rounded-lg bg-dark-primary overflow-hidden shadow-2xl shadow-dark-shadow">
                  <ul className="grid grid-cols-12 p-5 bg-dark-spot items-center font-semibold">
                     <li className="col-span-1">Avatar</li>
                     <li className="col-span-3">Title</li>
                     <li className="col-span-2">Price</li>
                     <li className="col-span-2">Brand</li>
                     <li className="col-span-2">Category</li>
                     <li className="col-span-1">Publish</li>
                     <li className="col-span-1"></li>
                  </ul>
                  {posts.map((post) => (
                     <div key={post.id}>
                        <ul className="grid grid-cols-12 p-5 items-center hover:bg-dark-bg cursor-pointer relative">
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
                                    className="object-cover rounded-full"
                                 />
                              </li>
                              <li className="col-span-3">{post.title}</li>
                              <li className="col-span-2">
                                 <div className="text-blue-main font-semibold">
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
                              </li>
                              <li className="col-span-2">{post.brand}</li>
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
                                    checked={post.isActive ? true : false}
                                    onClick={() => {
                                       post.isActive
                                          ? handleUnpublishPost(post.id)
                                          : handlePublishPost(post.id);
                                    }}
                                 />
                                 <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none  rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-main"></div>
                              </label>
                           </li>
                           <li className="col-span-1 flex justify-end items-center gap-4 text-xl text-white absolute z-20 right-4">
                              <div
                                 className="p-3 rounded-lg dark:bg-dark-spot hover:dark:bg-green-800"
                                 onClick={() => setPostID(post.id)}
                              >
                                 <BiEdit className="" />
                              </div>
                              <div
                                 className="p-3 rounded-lg dark:bg-dark-spot hover:dark:bg-red-800"
                                 onClick={() => {
                                    handleDeletePost(post.id);
                                 }}
                              >
                                 <BiTrashAlt />
                              </div>
                           </li>
                        </ul>
                     </div>
                  ))}
                  <EditPost
                     postID={postID}
                     setPostID={setPostID}
                     setLoading={setLoading}
                  />
               </div>
            </div>
            {loading ? <Loader /> : <></>}
            <Toaster />
         </LayoutDashboard>
      </>
   );
};

export default Posts;
