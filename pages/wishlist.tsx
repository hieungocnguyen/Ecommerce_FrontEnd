/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import API, { authAxios, endpoints } from "../API";
import Layout from "../components/Layout/Layout";
import { Store } from "../utils/Store";
import Cookies from "js-cookie";
import { BiArrowBack, BiTrash, BiX } from "react-icons/bi";
import toast, { Toaster } from "react-hot-toast";
import emptyBox from "../public/empty-box.png";
import Image from "next/image";
import Link from "next/link";
import { ClipLoader } from "react-spinners";
import useTrans from "../hook/useTrans";
import PaginationComponent from "../components/Pagination";

const Wishlist = () => {
   const { state, dispatch } = useContext(Store);
   const { userInfo } = state;
   const router = useRouter();
   const [wishList, setWishList] = useState([]);
   const [isFetching, setIsFetching] = useState(false);
   const { locale } = useRouter();
   const trans = useTrans();

   //pagination
   const lengthOfPage = 4;
   const [pageCurrent, setPageCurrent] = useState(1);
   const [totalPage, setTotalPage] = useState(0);
   const [keywordSearch, setKeywordSearch] = useState("");

   const loadWishList = async () => {
      try {
         setIsFetching(true);
         const resList = await API.get(endpoints["wishlist"](userInfo.id));
         setWishList(resList.data.data);
         setTotalPage(Math.ceil(resList.data.data.length / lengthOfPage));
         if (resList) {
            setIsFetching(false);
         }
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      if (userInfo) {
         loadWishList();
      } else {
         router.push("/");
      }
   }, [router, userInfo]);

   useEffect(() => {
      setTotalPage(Math.ceil(FilterArray(wishList).length / lengthOfPage));
   }, [keywordSearch]);

   const handleDeletePost = async (id) => {
      try {
         const resDeldete = await authAxios().get(endpoints["like_post"](id));
         if (resDeldete) {
            toast.success("Unlike successful", {
               position: "bottom-center",
            });
         }
         loadWishList();
      } catch (error) {
         console.log(error);
      }
   };

   const FilterArray = (array) => {
      let resultArray = array.filter(
         (post) => post.title.toUpperCase().search(keywordSearch) >= 0
      );
      return resultArray;
   };

   return (
      <Layout title="Wishlist">
         <div className="flex justify-between items-center">
            <div className="flex gap-4 items-center m-6">
               <div
                  className="bg-primary-color text-white p-3 text-2xl rounded-lg cursor-pointer hover:shadow-lg hover:shadow-primary-color"
                  onClick={() => router.back()}
               >
                  <BiArrowBack />
               </div>
               <div className="font-semibold text-2xl">
                  / {trans.wishlist.title}
               </div>
            </div>
            <div className="">
               <input
                  type="text"
                  placeholder="🔎Title of product"
                  className="p-3 rounded-lg border-2 border-primary-color"
                  onKeyDown={(e) => {
                     !/^[a-zA-Z0-9._\b]+$/.test(e.key) && e.preventDefault();
                  }}
                  onChange={(e) => {
                     setKeywordSearch(e.target.value.toUpperCase());
                     setPageCurrent(1);
                  }}
               />
            </div>
         </div>
         {!isFetching ? (
            <>
               <div className="grid grid-cols-12 dark:bg-dark-primary bg-light-primary rounded-lg font-semibold p-4 mb-4 text-left">
                  <div className="col-span-1">{trans.wishlist.avatar}</div>
                  <div className="col-span-3">{trans.wishlist.name}</div>
                  <div className="col-span-2">{trans.wishlist.category}</div>
                  <div className="col-span-2">{trans.wishlist.price}</div>
                  <div className="col-span-2">{trans.wishlist.brand}</div>
                  <div className="col-span-1">{trans.wishlist.status}</div>
                  <div></div>
               </div>
               {FilterArray(wishList).length > 0 ? (
                  <div>
                     {FilterArray(wishList)
                        .slice(
                           (pageCurrent - 1) * lengthOfPage,
                           (pageCurrent - 1) * lengthOfPage + lengthOfPage
                        )
                        .map((w) => (
                           <div key={w.id}>
                              <Link href={`/sale_post/${w.id}`}>
                                 <div className="grid grid-cols-12 gap-2 items-center dark:bg-dark-primary bg-light-spot rounded-lg p-4 text-left font-medium mb-2 hover:brightness-95 cursor-pointer transition-all ">
                                    <div className="col-span-1 flex gap-4 items-center overflow-hidden relative w-16 aspect-square">
                                       <Image
                                          src={w.avatar}
                                          alt="img"
                                          layout="fill"
                                          className="object-cover rounded-lg"
                                       />
                                    </div>
                                    <div className="col-span-3">{w.title}</div>
                                    <div className="col-span-2">
                                       {w.category.name}
                                    </div>

                                    <div className="col-span-2">
                                       <div className="text-primary-color text-lg font-semibold">
                                          {w.finalPrice.toLocaleString(
                                             "it-IT",
                                             {
                                                style: "currency",
                                                currency: "VND",
                                             }
                                          )}
                                       </div>
                                       <div className="line-through text-sm">
                                          {w.initialPrice.toLocaleString(
                                             "it-IT",
                                             {
                                                style: "currency",
                                                currency: "VND",
                                             }
                                          )}
                                       </div>
                                    </div>
                                    <div className="col-span-2">{w.brand}</div>
                                    <div className="col-span-1 font-semibold">
                                       {locale == "vi"
                                          ? w.sellStatus.nameVi
                                          : w.sellStatus.name}
                                    </div>
                                    <div className="flex justify-end items-center mr-8">
                                       <div
                                          className="w-10 h-10 bg-red-500 text-white p-2 text-2xl rounded-lg items-center flex justify-center hover:shadow-lg hover:shadow-red-500 cursor-pointer"
                                          onClick={(e) => {
                                             e.stopPropagation();
                                             handleDeletePost(w.id);
                                          }}
                                       >
                                          <BiTrash />
                                       </div>
                                    </div>
                                 </div>
                              </Link>
                           </div>
                        ))}
                     {/* paginate */}
                     <PaginationComponent
                        totalPage={totalPage}
                        pageCurrent={pageCurrent}
                        setPageCurrent={setPageCurrent}
                     />
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
                     <div className="uppercase text-2xl font-semibold mb-4">
                        {trans.wishlist.empty}
                     </div>
                  </>
               )}
            </>
         ) : (
            <>
               <div className="flex justify-center my-8">
                  <ClipLoader size={35} color="#FF8500" />
               </div>
            </>
         )}

         <Toaster />
      </Layout>
   );
};

export default Wishlist;
