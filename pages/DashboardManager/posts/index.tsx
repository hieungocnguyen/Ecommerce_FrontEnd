/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { BiEditAlt, BiPlus } from "react-icons/bi";
import API, { endpoints } from "../../../API";
import LayoutDashboard from "../../../components/Dashboard/LayoutDashboardManager";
import Loader from "../../../components/Loader";
import { Store } from "../../../utils/Store";

const Posts = () => {
   const { state, dispatch } = useContext(Store);
   const { userInfo, agencyInfo } = state;
   const [posts, setPosts] = useState([]);
   const router = useRouter();
   const [open, setOpen] = useState(null);

   const loadPosts = async () => {
      const resPosts = await API.post(endpoints["search_salePost"], {
         nameOfAgency: agencyInfo.name,
      });
      setPosts(resPosts.data.data.listResult);
   };
   useEffect(() => {
      loadPosts();
   }, []);
   const handleOpenMenu = (event) => {
      setOpen(event.currentTarget);
   };

   const handleCloseMenu = () => {
      setOpen(null);
   };
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

   return (
      <>
         <LayoutDashboard>
            <div className="w-[90%] mx-auto">
               <div className="flex justify-between my-8">
                  <div className="font-semibold text-2xl">Your Post</div>
                  <Link href="/DashboardManager/posts/createnewpost">
                     <button className="font-semibold bg-blue-main p-2 rounded-lg hover:opacity-80 flex items-center">
                        <BiPlus className="text-lg mr-1" />
                        Add new post
                     </button>
                  </Link>
               </div>
               <div className="">
                  <div className="grid grid-cols-8 font-semibold bg-dark-primary bg-opacity-80 p-6 rounded-t-lg">
                     <div className="col-span-3">Name</div>
                     <div className="col-span-1">Price</div>
                     <div className="col-span-2">Category</div>
                     <div className="col-span-1">Status</div>
                     <div></div>
                  </div>
                  <div className="bg-dark-primary bg-opacity-30 rounded-b-lg p-6">
                     {posts ? (
                        posts.map((p) => (
                           <div
                              key={p.id}
                              className="grid grid-cols-8 mb-10 items-center"
                           >
                              <div className="col-span-3 flex items-center">
                                 <img
                                    src={p.avatar}
                                    alt=""
                                    className="w-10 h-10 rounded-full mr-6"
                                 />
                                 {p.title}
                              </div>
                              <div className="col-span-1">{p.finalPrice}</div>
                              <div className="col-span-2">
                                 {p.category.name}
                              </div>
                              <div className="col-span-1">
                                 {p.isActive === 1 ? (
                                    <div
                                       className=" p-1 bg-green-600 text-white  rounded-lg flex justify-center cursor-pointer hover:bg-opacity-80"
                                       onClick={() => handleUnpublishPost(p.id)}
                                    >
                                       Published
                                    </div>
                                 ) : (
                                    <div
                                       className=" p-1 bg-red-600 text-white  rounded-lg flex justify-center cursor-pointer hover:bg-opacity-80"
                                       onClick={() => handlePublishPost(p.id)}
                                    >
                                       Unpublished
                                    </div>
                                 )}
                              </div>
                              <div className="flex justify-end gap-2">
                                 <Link href={`/DashboardManager/posts/${p.id}`}>
                                    <div className="p-2 hover:bg-neutral-600 hover:bg-opacity-30 rounded-lg cursor-pointer">
                                       <BiEditAlt className="text-2xl  " />
                                    </div>
                                 </Link>
                                 <div
                                    className=" p-2 hover:bg-red-600 hover:bg-opacity-30 rounded-lg cursor-pointer"
                                    onClick={() => handleDeletePost(p.id)}
                                 >
                                    <AiOutlineDelete className="text-2xl text-red-600 " />
                                 </div>
                              </div>
                           </div>
                        ))
                     ) : (
                        <Loader />
                     )}
                  </div>
               </div>
            </div>
            <Toaster />
         </LayoutDashboard>
      </>
   );
};

export default Posts;
