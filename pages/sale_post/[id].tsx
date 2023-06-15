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
import { ClipLoader } from "react-spinners";
// import RelativePost from "../../components/RelativePost";
import PaginationComponent from "../../components/Pagination";
import { AiFillStar } from "react-icons/ai";
import RatingAdvanced from "../../components/RatingAdvanced";
import Error from "../_error";

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
   const [isFetching, setIsFetching] = useState(true);

   const lengthOfPage = 3;
   const [pageCurrent, setPageCurrent] = useState(1);
   const [totalPage, setTotalPage] = useState(0);

   const [statComment, setStatComment] = useState<any>([]);
   const [itemsHot, setItemsHot] = useState<any>([]);

   const loadComment = async () => {
      try {
         const resComments = await API.get(endpoints["comment_all_post"](id));
         setComments(resComments.data.data);
         setIsFetching(false);
         setTotalPage(Math.ceil(resComments.data.data.length / lengthOfPage));
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
   const fetchStatRating = async () => {
      try {
         const resCommentStat = await API.get(
            endpoints["stat_comment_star_post"](id)
         );
         setStatComment(resCommentStat.data.data);
      } catch (error) {
         console.log(error);
      }
   };
   const fetchHotItems = async () => {
      try {
         const res = await API.get(
            endpoints["item_best_seller_by_agency"](4, salePost.agency.id)
         );
         setItemsHot(res.data.data);
         console.log(res.data.data);
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      loadComment();
      loadStarAvg();
      loadCommentCount();
      fetchStatRating();
      setMainPic(salePost.avatar);
      fetchHotItems();
   }, [id]);

   const handleRouteAgency = () => {
      router.push(`/agencyinfo/${salePost.agency.id}`);
   };

   if (salePost.error) {
      return <Error statusCode={undefined} />;
   }

   return (
      <Layout title="Detail">
         <div className="grid sm:grid-cols-12 grid-cols-1 gap-8 my-8 sm:mx-10 mx-0 ">
            {/* left part */}
            <Suspense fallback={<p>Loading image...</p>}>
               <div className="sm:col-span-5 col-span-1">
                  <div className="overflow-hidden aspect-square relative rounded-lg">
                     <Image
                        src={mainPic}
                        alt="img"
                        className="object-cover"
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
                                 className="overflow-hidden aspect-square relative cursor-pointer rounded-lg"
                                 onClick={(e) => {
                                    setMainPic(pic.image);
                                 }}
                              >
                                 <Image
                                    src={pic.image}
                                    alt="img"
                                    className="object-cover"
                                    layout="fill"
                                 />
                              </div>
                           </SwiperSlide>
                        ))}
                  </Swiper>
               </div>
            </Suspense>
            {/* right part */}
            <div className="sm:col-span-7 col-span-1">
               <div className="dark:bg-dark-primary bg-light-primary rounded-lg sm:p-8 p-6 text-left">
                  <div className="font-semibold sm:text-4xl text-2xl text-left max-h-20 line-clamp-2">
                     {salePost.title}
                  </div>
                  <div className="sm:flex items-center gap-2 sm:my-4 my-2">
                     <div className="rounded-lg border-2 border-secondary-color sm:px-2 sm:py-1 p-1 mb-1 sm:mb-0 font-bold bg-secondary-color text-light-text w-fit">
                        {locale == "vi"
                           ? salePost.sellStatus.nameVi
                           : salePost.sellStatus.name}
                     </div>
                     <div className="flex items-center gap-2">
                        <div>
                           <Rating
                              size="large"
                              sx={{
                                 "& .MuiRating-iconFilled": {
                                    color: "#ffab00",
                                 },
                                 "& .MuiRating-iconEmpty": {
                                    color: "#ffab00",
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
                  </div>
                  <div className="text-left mb-4 sm:mt-8 mt-2">
                     <div className=" text-5xl text-primary-color font-bold">
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
                  <div className="mb-4 mt-8 grid sm:grid-cols-2 grid-cols-1 gap-2">
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
               <div className="grid sm:grid-cols-12 grid-cols-6 gap-4 mt-8 ">
                  <button
                     className={`col-span-6 bg-primary-color text-dark-text rounded-lg py-10 font-semibold text-xl cursor-pointer hover:shadow-lg hover:shadow-primary-color hover:brightness-90 transition-all disabled:bg-gray-400 disabled:shadow-gray-400 disabled:cursor-not-allowed`}
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
                     className="col-span-6 grid grid-rows-6 gap-3"
                     onClick={handleRouteAgency}
                  >
                     <div className="row-span-4 flex items-center p-3 gap-2 bg-secondary-color text-dark-primary rounded-lg cursor-pointer hover:shadow-lg hover:shadow-secondary-color hover:brightness-90 transition-all">
                        <div className="relative h-14 aspect-square overflow-hidden rounded-xl ">
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
                     <div
                        className="row-span-2 p-2 rounded-lg text-white bg-primary-color flex items-center justify-center font-semibold cursor-pointer hover:shadow-lg hover:shadow-primary-color hover:brightness-90 transition-all"
                        onClick={handleRouteAgency}
                     >
                        Start chat
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
         <div className="grid grid-cols-12 gap-4 sm:mx-10 mx-0 my-8">
            <div className="col-span-8 h-fit">
               <div className="text-center font-bold text-xl mb-2">
                  Description
               </div>
               <div className="dark:bg-dark-primary bg-light-primary rounded-lg p-4">
                  <div
                     className={`mx-4 text-left overflow-hidden relative py-8 ${
                        isShowMore ? "h-fit" : "h-80"
                     }`}
                  >
                     <div
                        dangerouslySetInnerHTML={{
                           __html: salePost.description,
                        }}
                     ></div>
                     {!isShowMore && (
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-gray-400 rounded-lg"></div>
                     )}
                  </div>
                  <div className="">
                     <button
                        className="px-4 py-2 mt-4 rounded-lg border-2 border-primary-color text-primary-color font-semibold"
                        onClick={() => setIsShowMore(!isShowMore)}
                     >
                        {isShowMore
                           ? trans.detailProduct.show_less
                           : trans.detailProduct.show_more}
                     </button>
                  </div>
               </div>
            </div>
            <div className="col-span-4 h-fit">
               <div className="text-center font-bold text-xl mb-2">
                  Hot Sellers
               </div>
               <div className="grid grid-cols-2 gap-4">
                  {itemsHot.length > 0 &&
                     itemsHot.map((item) => (
                        <Link href={`/sale_post/${item[1].id}`} key={item.id}>
                           <div className="bg-light-primary dark:bg-dark-primary rounded-lg p-3 cursor-pointer hover:shadow-lg">
                              <div className="relative overflow-hidden w-3/4 aspect-square mx-auto rounded-xl">
                                 <Image
                                    src={item[6]}
                                    alt="item"
                                    layout="fill"
                                    className="object-cover"
                                 />
                              </div>
                              <div className="font-semibold mt-2 line-clamp-1">
                                 {item[2]}
                              </div>
                              <div className="font-semibold text-sm opacity-75 line-clamp-1">
                                 {item[5]}
                              </div>
                              <div className="text-primary-color font-bold mt-1 text-lg">
                                 {item[3].toLocaleString("it-IT", {
                                    style: "currency",
                                    currency: "VND",
                                 })}
                              </div>
                              <div className="font-semibold text-sm opacity-75 line-clamp-1">
                                 Sold: {item[4]}
                              </div>
                           </div>
                        </Link>
                     ))}
                  {itemsHot.length == 0 && (
                     <div className="col-span-2 relative overflow-hidden w-1/2 aspect-square mx-auto mt-10">
                        <Image
                           src={emptyBox}
                           alt="img"
                           className="object-cover"
                           layout="fill"
                        />
                     </div>
                  )}
               </div>
            </div>
         </div>
         {/* comment */}
         <div
            className="grid grid-cols-1 my-8 sm:mx-10 mx-0"
            id="section_comment"
         >
            <div className="col-span-3 dark:bg-dark-primary bg-light-primary rounded-lg py-6">
               <div className="font-semibold text-left sm:ml-12 ml-4 text-xl">
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
                     fetchStatRating={fetchStatRating}
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
               <Suspense
                  fallback={
                     <div className="flex justify-center my-8">
                        <ClipLoader size={35} color="#FF8500" />
                     </div>
                  }
               >
                  {comments.length > 0 && (
                     <div>
                        <RatingAdvanced
                           statComment={statComment}
                           commentCount={commentCount}
                           starAvg={starAvg}
                        />
                        <div className="w-4/5 h-[1px] bg-gray-500 mx-auto my-6"></div>
                        {comments
                           .sort((a, b) => (a.id < b.id ? 1 : -1))
                           .slice(
                              (pageCurrent - 1) * lengthOfPage,
                              (pageCurrent - 1) * lengthOfPage + lengthOfPage
                           )
                           .map((c) => (
                              <div
                                 key={c.id}
                                 className="grid sm:grid-cols-12 grid-cols-6 sm:mx-14 mx-2 mb-8"
                              >
                                 <div className="overflow-hidden relative sm:h-16 h-10 aspect-square">
                                    <Image
                                       src={c.author ? c.author.avatar : ""}
                                       alt="avatar"
                                       layout="fill"
                                       className="rounded-full object-cover"
                                    />
                                 </div>
                                 <div className="sm:col-span-11 col-span-5 text-left">
                                    {c.author && (
                                       <div className="flex items-center">
                                          <span className="font-semibold text-primary-color">
                                             {"@"}
                                             {c.author.username}
                                          </span>
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
                                                color: "#ffab00",
                                             },
                                             "& .MuiRating-iconEmpty": {
                                                color: "#ffab00",
                                             },
                                          }}
                                          value={c.starRate ? c.starRate : 1}
                                          readOnly
                                       />
                                    </div>
                                 </div>
                              </div>
                           ))}
                     </div>
                  )}
                  {isFetching && (
                     <div className="flex justify-center my-8">
                        <ClipLoader size={35} color="#FF8500" />
                     </div>
                  )}
                  {comments.length == 0 && !isFetching && (
                     <>
                        <div className="relative overflow-hidden aspect-square sm:w-1/5 w-2/3 mx-auto">
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
               <PaginationComponent
                  totalPage={totalPage}
                  pageCurrent={pageCurrent}
                  setPageCurrent={setPageCurrent}
               />
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
   fetchStatRating,
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
               fetchStatRating();
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
         <form onSubmit={addComment} className="sm:my-4 my-2 rounded-lg">
            <div className="">
               <textarea
                  // type="text"
                  placeholder={trans.detailProduct.comment}
                  className=" rounded-lg h-18 w-[90%] mx-auto sm:my-2 my-1 p-4"
                  onChange={onChangeContent}
                  value={content}
                  rows={4}
               />
            </div>
            <div className="my-1">
               <Rating
                  size="large"
                  sx={{
                     "& .MuiRating-iconFilled": {
                        color: "#ffab00",
                     },
                     "& .MuiRating-iconEmpty": {
                        color: "#ffab00",
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
