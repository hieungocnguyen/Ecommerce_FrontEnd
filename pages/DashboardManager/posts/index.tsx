import { MenuItem, Popover } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { BiDotsVerticalRounded, BiPlus } from "react-icons/bi";
import API, { endpoints } from "../../../API";
import LayoutDashboard from "../../../components/Dashboard/LayoutDashboard";
import Loader from "../../../components/Loader";
import { Store } from "../../../utils/Store";

const Posts = () => {
   const { state, dispatch } = useContext(Store);
   const { userInfo, agencyInfo } = state;
   const [posts, setPosts] = useState([]);
   const router = useRouter();
   const [open, setOpen] = useState(null);
   useEffect(() => {
      const loadPosts = async () => {
         const resPosts = await API.post(endpoints["search_salePost"], {
            nameOfAgency: agencyInfo.name,
         });
         setPosts(resPosts.data.data.listResult);
      };
      loadPosts();
   }, []);
   const handleOpenMenu = (event) => {
      setOpen(event.currentTarget);
   };

   const handleCloseMenu = () => {
      setOpen(null);
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
                              className="grid grid-cols-8 mb-8 items-center"
                           >
                              <div className="col-span-3 flex items-center">
                                 <img
                                    src={p.avatar}
                                    alt=""
                                    className="w-8 h-8 rounded-full mr-6"
                                 />
                                 {p.title}
                              </div>
                              <div className="col-span-1">{p.finalPrice}</div>
                              <div className="col-span-2">
                                 {p.category.name}
                              </div>
                              <div className="col-span-1">
                                 {p.isActive === 1 ? (
                                    <div className="text-green-600">
                                       Published
                                    </div>
                                 ) : (
                                    <div className="text-red-600">
                                       Unpublished
                                    </div>
                                 )}
                              </div>
                              <div
                                 onClick={handleOpenMenu}
                                 className="flex justify-end"
                              >
                                 <BiDotsVerticalRounded className="text-xl" />
                              </div>
                              <Popover
                                 open={Boolean(open)}
                                 anchorEl={open}
                                 onClose={handleCloseMenu}
                                 anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                 }}
                                 transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                 }}
                                 PaperProps={{
                                    sx: {
                                       p: 1,
                                       width: 140,
                                       "& .MuiMenuItem-root": {
                                          px: 1,
                                          typography: "body2",
                                          borderRadius: 0.75,
                                       },
                                    },
                                 }}
                              >
                                 <MenuItem>Publish</MenuItem>
                                 <MenuItem>Delete</MenuItem>
                              </Popover>
                           </div>
                        ))
                     ) : (
                        <Loader />
                     )}
                  </div>
               </div>
            </div>
         </LayoutDashboard>
      </>
   );
};

export default Posts;
