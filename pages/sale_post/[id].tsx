/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import React, { Suspense, useContext, useEffect, useState } from "react";
import API, { authAxios, endpoints } from "../../API";
import Layout from "../../components/Layout/Layout";
import Cookies from "js-cookie";
import { Store } from "../../utils/Store";
import Router, { useRouter } from "next/router";
import Image from "next/image";
import Rating from "@mui/material/Rating";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
// import ItemsInPost from "../../components/Model/ItemsInPost";
import Loader from "../../components/Loader";
import dynamic from "next/dynamic";
import moment from "moment";
import loginImg from "../../public/login.png";
import emptyBox from "../../public/empty-box.png";
import useTrans from "../../hook/useTrans";
// import RelativePost from "../../components/RelativePost";

const ItemsInPost = dynamic(() => import("../../components/Model/ItemsInPost"));
const RelativePost = dynamic(() => import("../../components/RelativePost"));

const ProductPage = ({ salePost }) => {
   const { state, dispatch } = useContext(Store);
   const { userInfo } = state;
   const [comments, setComments] = useState([]);
   const [mainPic, setMainPic] = useState();
   const router = useRouter();
   const { locale } = useRouter();
   const { id } = router.query;
   const [starAvg, setStarAvg] = useState(0);
   const [commentCount, setCommentCount] = useState(0);
   const [isOpenItemsModal, setIsOpenItemsModal] = useState(false);
   const [loading, setLoading] = useState(false);
   const [isShowMore, setIsShowMore] = useState(false);
   const trans = useTrans();

   const loadComment = async () => {
      try {
         const resComments = await API.get(endpoints["comment_all_post"](id));
         setComments(resComments.data.data);
      } catch (error) {
         console.log(error);
      }
   };
   const loadStarAvg = async () => {
      try {
         const resStar = await API.get(endpoints["star_avg_post"](id));
         setStarAvg(resStar.data.data);
      } catch (error) {
         console.log(error);
      }
   };
   const loadCommentCount = async () => {
      try {
         const resCount = await API.get(endpoints["count_comment_post"](id));
         setCommentCount(resCount.data.data);
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      loadComment();
      loadStarAvg();
      loadCommentCount();
      setMainPic(salePost.avatar);

      console.log(salePost);
   }, [id]);

   const handleRouteAgency = () => {
      router.push(`/agencyinfo/${salePost.agency.id}`);
   };

   return (
      <Layout title="Detail">
         <div className="grid lg:grid-cols-12 grid-cols-1 gap-8 my-8 mx-16 ">
            {/* left part */}
            <Suspense fallback={<p>Loading image...</p>}>
               <div className="lg:col-span-5 col-span-1">
                  <div className="overflow-hidden aspect-square relative ">
                     <Image
                        src={mainPic}
                        alt="img"
                        className="object-cover rounded-lg"
                        layout="fill"
                     />
                  </div>
                  <Swiper
                     slidesPerView={4}
                     spaceBetween={20}
                     className="mySwiper rounded-lg overflow-hidden mt-4 w-3/4"
                  >
                     {salePost.picturePostSet
                        .sort((a, b) => (a.id < b.id ? 1 : -1))
                        .map((pic) => (
                           <SwiperSlide key={pic.id}>
                              <div
                                 className="overflow-hidden aspect-square relative cursor-pointer"
                                 onClick={(e) => {
                                    setMainPic(pic.image);
                                 }}
                              >
                                 <Image
                                    src={pic.image}
                                    alt="img"
                                    className="object-cover rounded-lg"
                                    layout="fill"
                                 />
                              </div>
                           </SwiperSlide>
                        ))}
                  </Swiper>
               </div>
            </Suspense>
            {/* right part */}
            <div className="lg:col-span-7 col-span-1">
               <div className="dark:bg-dark-primary bg-light-primary rounded-lg p-8 text-left">
                  <div className="font-semibold text-4xl text-left h-20 leading-10">
                     {salePost.title}
                  </div>
                  <div className="flex items-center gap-2 my-4 text-lg">
                     <div className="rounded-lg border-2 border-secondary-color p-2 text-secondary-color font-semibold">
                        {locale == "vi"
                           ? salePost.sellStatus.nameVi
                           : salePost.sellStatus.name}
                     </div>
                     <div>
                        <Rating
                           size="large"
                           sx={{
                              "& .MuiRating-iconFilled": {
                                 color: "#2065d1",
                              },
                              "& .MuiRating-iconEmpty": {
                                 color: "#2065d1",
                              },
                           }}
                           value={starAvg}
                           readOnly
                        />
                     </div>
                     <div className="font-semibold hover:text-primary-color transition-all">
                        <a
                           href="#section_comment"
                           title="Go to comment section"
                        >
                           {commentCount} {trans.detailProduct.comment}
                        </a>
                     </div>
                  </div>
                  <div className="text-left mb-4 mt-8">
                     <div className=" text-4xl text-primary-color font-bold">
                        {salePost.finalPrice.toLocaleString("it-IT", {
                           style: "currency",
                           currency: "VND",
                        })}
                     </div>
                     <div className="line-through text-xl font-semibold opacity-60">
                        {salePost.initialPrice.toLocaleString("it-IT", {
                           style: "currency",
                           currency: "VND",
                        })}
                     </div>
                  </div>
                  <div className="mb-4 mt-8 grid grid-cols-2">
                     <div>
                        <div className="font-semibold mb-2 text-lg">
                           {trans.detailProduct.brand}:{" "}
                           <span className="font-medium">{salePost.brand}</span>
                        </div>
                        <div className="font-semibold mb-2 text-lg">
                           {trans.detailProduct.origin}:{" "}
                           <span className="font-medium">
                              {salePost.origin}
                           </span>
                        </div>
                        <div className="font-semibold text-lg">
                           {trans.detailProduct.manufacturer}:{" "}
                           <span className="font-medium">
                              {salePost.manufacturer}
                           </span>
                        </div>
                     </div>
                     <div>
                        <Link href={`/category/${salePost.category.id}`}>
                           <div className="font-semibold mb-2 text-lg cursor-pointer hover:text-primary-color">
                              {trans.detailProduct.category}:{" "}
                              <span className="font-medium">
                                 {locale == "vi"
                                    ? salePost.category.nameVi
                                    : salePost.category.name}
                              </span>
                           </div>
                        </Link>
                        <div className="font-semibold mb-2 text-lg">
                           {trans.detailProduct.date_of_sale}:{" "}
                           <span className="font-medium">
                              {new Date(
                                 salePost.createdDate
                              ).toLocaleDateString("en-GB")}
                           </span>
                        </div>
                        <div className="font-semibold text-lg">
                           {trans.detailProduct.state_of_post}:{" "}
                           <span className="font-medium">
                              {salePost.isActive
                                 ? trans.detailProduct.avaiable
                                 : trans.detailProduct.unavailable}
                           </span>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="grid grid-cols-12 gap-8 mt-8 ">
                  <button
                     className={`col-span-6 bg-primary-color text-dark-text rounded-lg py-10 font-semibold text-xl cursor-pointer hover:shadow-lg hover:shadow-primary-color transition-all disabled:bg-gray-400 disabled:hover:shadow-gray-400 disabled:cursor-not-allowed`}
                     onClick={() => setIsOpenItemsModal(true)}
                     disabled={
                        salePost.agency.isActive === 0 ||
                        salePost.isActive === 0
                           ? true
                           : false
                     }
                  >
                     {salePost.agency.isActive === 0 || salePost.isActive === 0
                        ? trans.detailProduct.this_product_is_unavailable
                        : trans.detailProduct.choose_items}
                  </button>
                  <div
                     className="col-span-6 dark:bg-dark-primary bg-light-primary rounded-lg flex items-center p-4 gap-2 cursor-pointer hover:shadow-md dark:hover:shadow-dark-primary hover:shadow-light-primary transition-all"
                     onClick={handleRouteAgency}
                  >
                     <div className="relative h-20 w-20 overflow-hidden rounded-xl ">
                        <Image
                           src={salePost.agency.avatar}
                           alt="avatar"
                           layout="fill"
                           className="object-cover"
                        />
                     </div>
                     <div className="text-left ">
                        <div className="font-semibold text-lg">
                           {salePost.agency.name}
                        </div>
                        <div>
                           {locale == "vi"
                              ? salePost.agency.field.name
                              : salePost.agency.field.nameEn}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <div
            className={`fixed top-0 right-0 w-full h-screen backdrop-blur-sm items-center justify-center z-20 ${
               isOpenItemsModal ? "flex" : "hidden"
            }`}
         >
            <div className="w-3/4 h-[34rem]">
               {isOpenItemsModal && (
                  <ItemsInPost
                     items={salePost.itemPostSet}
                     setIsOpenItemsModal={setIsOpenItemsModal}
                  />
               )}
            </div>
         </div>
         <div className="my-8 mx-16 dark:bg-dark-primary bg-light-primary rounded-lg py-8">
            <div className="font-semibold text-left ml-12 text-xl">
               {trans.detailProduct.description}
            </div>
            <div
               className={`my-6 mx-16 text-left overflow-hidden relative ${
                  isShowMore ? "h-fit" : "h-52"
               }`}
            >
               <div
                  dangerouslySetInnerHTML={{ __html: salePost.description }}
               ></div>
               {!isShowMore && (
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-gray-400 rounded-lg"></div>
               )}
            </div>
            <div className="">
               <button
                  className="px-4 py-2 rounded-lg border-2 border-primary-color text-primary-color font-semibold"
                  onClick={() => setIsShowMore(!isShowMore)}
               >
                  {isShowMore
                     ? trans.detailProduct.show_less
                     : trans.detailProduct.show_more}
               </button>
            </div>
         </div>
         {/* comment */}
         <div className="grid grid-cols-1 my-8 mx-16" id="section_comment">
            <div className="col-span-3 dark:bg-dark-primary bg-light-primary rounded-lg py-8">
               <div className="font-semibold text-left ml-12 text-xl">
                  {trans.detailProduct.comment}
               </div>
               {userInfo ? (
                  <CommentForm
                     postID={id}
                     comments={comments}
                     setComments={setComments}
                     setStarAvg={setStarAvg}
                     setCommentCount={setCommentCount}
                     setLoading={setLoading}
                  />
               ) : (
                  <div className="my-8">
                     <div className="relative overflow-hidden mx-auto w-40 aspect-square">
                        <Image
                           src={loginImg}
                           alt="login"
                           layout="fill"
                           className="object-cover"
                        />
                     </div>
                     <div className="uppercase mt-4 font-semibold">
                        {trans.detailProduct.login_to_comment}
                     </div>
                  </div>
               )}

               <Suspense fallback={<p>Loading...</p>}>
                  {comments.length > 0
                     ? comments
                          .sort((a, b) => (a.id < b.id ? 1 : -1))
                          .map((c) => (
                             <div
                                key={c.id}
                                className="grid grid-cols-12 mx-14 mb-8"
                             >
                                <div className="overflow-hidden relative h-16 w-16">
                                   <Image
                                      src={c.author ? c.author.avatar : ""}
                                      alt="avatar"
                                      layout="fill"
                                      className="rounded-full object-cover"
                                   />
                                </div>
                                <div className="col-span-11 text-left">
                                   {c.author && (
                                      <div className="flex gap-2 items-center">
                                         {!c.author.firstName &&
                                         !c.author.lastName ? (
                                            <div>
                                               <span className="italic opacity-70">
                                                  Unnamed -
                                               </span>
                                               <span className="font-semibold text-primary-color">
                                                  {" ["}
                                                  {c.author.username}
                                                  {"]"}
                                               </span>
                                            </div>
                                         ) : (
                                            <div className="font-semibold text-primary-color">
                                               {c.author.firstName}{" "}
                                               {c.author.lastName}
                                               {" - ["}
                                               {c.author.username}
                                               {"]"}
                                            </div>
                                         )}
                                         <span className="text-sm italic">
                                            {" - "}
                                            {moment(c.createdDate)
                                               .startOf("m")
                                               .fromNow()}
                                         </span>
                                      </div>
                                   )}

                                   <div className="my-1">
                                      {c.content ? c.content : ""}
                                   </div>
                                   <div className="">
                                      <Rating
                                         sx={{
                                            "& .MuiRating-iconFilled": {
                                               color: "#2065d1",
                                            },
                                            "& .MuiRating-iconEmpty": {
                                               color: "#2065d1",
                                            },
                                         }}
                                         value={c.starRate ? c.starRate : 1}
                                         readOnly
                                      />
                                   </div>
                                </div>
                             </div>
                          ))
                     : userInfo && (
                          <>
                             <div className="relative overflow-hidden aspect-square w-1/5 mx-auto">
                                <Image
                                   src={emptyBox}
                                   alt="empty"
                                   layout="fill"
                                   className="object-cover"
                                />
                             </div>
                          </>
                       )}
               </Suspense>
            </div>
         </div>
         <div className="my-10">
            <RelativePost IDCategory={salePost.category.id} IDSalePost={id} />
         </div>
         {loading ? <Loader /> : <></>}
         <Toaster />
      </Layout>
   );
};

const CommentForm = ({
   postID,
   comments,
   setComments,
   setStarAvg,
   setCommentCount,
   setLoading,
}) => {
   const { state, dispatch } = useContext(Store);
   const { cart, userInfo } = state;
   const [content, setContent] = useState("");
   const router = useRouter();
   const [value, setValue] = React.useState<number | null>(0);
   const trans = useTrans();

   const onChangeContent = (e) => {
      setContent(e.target.value);
   };
   const addComment = async (event) => {
      event.preventDefault();
      if (userInfo) {
         setLoading(true);
         if (content == "" || value == 0) {
            toast.error("You must comment and rating before send feedback!", {
               position: "top-center",
            });
            setLoading(false);
         } else {
            try {
               const res = await authAxios().post(
                  endpoints["comment_post"](postID),
                  {
                     content: content,
                     starRate: value,
                  }
               );
               const resCount = await API.get(
                  endpoints["count_comment_post"](postID)
               );
               setCommentCount(resCount.data.data);
               const resStar = await API.get(
                  endpoints["star_avg_post"](postID)
               );
               setStarAvg(resStar.data.data);
               setCommentCount(resCount.data.data);
               setComments([...comments, res.data.data]);
               setContent("");
               setValue(0);
               toast.success("Comment successful!", {
                  position: "top-center",
               });
               setLoading(false);
            } catch (error) {
               setLoading(false);
               console.log(error);
               //    if (error.response.data.data.content) {
               //       toast.error(error.response.data.data.content);
               //    }else{
               //    if (error.response.data.data.star) {
               //       toast.error(error.response.data.data.star);
               //    }
               // else{
               //    toast.error("Something wrong, try again!");
               // }
               // }
               if (error.response.data.data.content) {
                  toast.error(error.response.data.data.content);
               } else if (error.response.data.data.star) {
                  toast.error(error.response.data.data.starRate);
               } else {
                  toast.error("Something wrong, try again!");
               }
            }
         }
      } else {
         // router.push("/signin");
         toast.error("Please sign in to comment!");
      }
   };

   return (
      <>
         <form onSubmit={addComment} className=" my-6 rounded-lg">
            <div className="">
               <textarea
                  // type="text"
                  placeholder={trans.detailProduct.comment}
                  className=" rounded-lg h-18 w-[90%] mx-auto my-4 p-4"
                  onChange={onChangeContent}
                  value={content}
                  rows={4}
               />
            </div>
            <div className="my-4">
               <Rating
                  size="large"
                  sx={{
                     "& .MuiRating-iconFilled": {
                        color: "#525EC1",
                     },
                     "& .MuiRating-iconEmpty": {
                        color: "#656b99",
                     },
                  }}
                  value={value}
                  onChange={(event, newValue) => {
                     setValue(newValue);
                  }}
               />
            </div>
            <button
               type="submit"
               className="p-4 bg-primary-color rounded-lg font-semibold text-white hover:opacity-80 disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
               {trans.detailProduct.submit_comment}
            </button>
         </form>
      </>
   );
};

export default ProductPage;

export const getServerSideProps = async (context) => {
   // request salepost detail
   const id = context.params.id;
   const resSalePost = await API.get(endpoints["salePost"](id));
   const salePost = await resSalePost.data.data;

   return { props: { salePost } };
};
