/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import API, { authAxios, endpoints } from "../../API";
import Layout from "../../components/Layout/Layout";
import Cookies from "js-cookie";
import { Store } from "../../utils/Store";
import Router, { useRouter } from "next/router";
import Image from "next/image";
import { type } from "os";
import Rating from "@mui/material/Rating";
import toast, { Toaster } from "react-hot-toast";
import { BiStore } from "react-icons/bi";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const ProductPage = (salePost) => {
   const { state, dispatch } = useContext(Store);
   const [quantityItems, setQuantityItems] = useState([]);
   const [comments, setComments] = useState([]);
   const [rates, setRates] = useState();
   const [mainPic, setMainPic] = useState(salePost.salePost.avatar);
   const router = useRouter();
   const { id } = router.query;
   const [starAvg, setStarAvg] = useState(0);
   const [commentCount, setCommentCount] = useState(0);

   useEffect(() => {
      const loadComment = async () => {
         const resComments = await API.get(endpoints["comment_all_post"](id));
         setComments(resComments.data.data);
      };
      const loadStarAvg = async () => {
         const resStar = await API.get(endpoints["star_avg_post"](id));
         setStarAvg(resStar.data.data);
      };
      const loadCommentCount = async () => {
         const resCount = await API.get(endpoints["count_comment_post"](id));
         setCommentCount(resCount.data.data);
      };
      loadComment();
      loadStarAvg();
      loadCommentCount();
   }, []);

   const handleChangeQuantity = (item, quantity) => {
      var updatedList = [...quantityItems];
      var objItem = { id: item.id, quantity: quantity };
      if (quantity > 0) {
         updatedList = [...quantityItems, objItem];
      } else {
         updatedList.splice(quantityItems.indexOf(quantity), 1);
      }
      setQuantityItems(updatedList);
   };

   const handleAddToCart = () => {
      const addtoCart = async (i) => {
         const res = await axios.post(
            "http://localhost:8080/ou-ecommerce/api/cart/add-to-cart",
            {
               itemID: Number(i.id),
               quantity: i.quantity,
            },
            {
               headers: {
                  Authorization: `Bearer ${Cookies.get("accessToken")}`,
               },
            }
         );
         dispatch({
            type: "CART_ADD_ITEM",
            payload: { id: i.id, quantity: i.quantity },
         });
         toast.success("Add to cart successfully !", {
            position: "bottom-center",
         });
      };
      if (Cookies.get("accessToken")) {
         quantityItems.map((i) => {
            addtoCart(i);
         });
      } else {
         router.push("/signin");
      }
   };

   return (
      <Layout title="Detail">
         <div className="grid lg:grid-cols-5 grid-cols-1 lg:gap-8 my-8">
            {/* left part */}
            <div className="col-span-2 ">
               <div className="overflow-hidden aspect-square relative">
                  <Image
                     src={mainPic}
                     alt="tai nghe"
                     className="object-cover rounded-lg"
                     layout="fill"
                  />
               </div>
               <Swiper
                  loop={true}
                  slidesPerView={5}
                  className="mySwiper h-[100px] rounded-lg overflow-hidden mt-4"
               >
                  {salePost.salePost.picturePostSet.map((pic) => (
                     <SwiperSlide key={pic.id}>
                        <div
                           className="overflow-hidden mx-2 rounded-lg cursor-pointer"
                           onClick={(e) => {
                              setMainPic(pic.image);
                           }}
                        >
                           <img
                              src={pic.image}
                              alt="img"
                              className="object-cover aspect-square"
                           />
                        </div>
                     </SwiperSlide>
                  ))}
               </Swiper>
            </div>
            {/* right part */}
            <div className="col-span-3">
               <div className="dark:bg-dark-primary bg-light-primary rounded-lg p-8 text-left">
                  <div className="font-extrabold text-left bg-blue-main rounded-lg p-1 w-fit mb-2 text-white">
                     {salePost.salePost.sellStatus.name}
                  </div>
                  <div className="font-semibold text-3xl text-left">
                     {salePost.salePost.title}
                  </div>
                  <div className="flex gap-2 my-2">
                     <div>
                        <Rating
                           sx={{
                              "& .MuiRating-iconFilled": {
                                 color: "#525EC1",
                              },
                              "& .MuiRating-iconEmpty": {
                                 color: "#656b99",
                              },
                           }}
                           value={starAvg}
                           readOnly
                        />
                     </div>
                     <div>{commentCount} Comment</div>
                  </div>
                  <div className="text-left mb-4">
                     <div className="line-through">
                        {salePost.salePost.initialPrice.toLocaleString(
                           "en-US",
                           {
                              style: "currency",
                              currency: "VND",
                           }
                        )}
                     </div>
                     <div className="font-semibold text-2xl text-blue-main">
                        {salePost.salePost.finalPrice.toLocaleString("en-US", {
                           style: "currency",
                           currency: "VND",
                        })}
                     </div>
                  </div>
                  <div className="mb-3">
                     <div className="font-semibold">Manufacturer:</div>
                     <div>{salePost.salePost.manufacturer}</div>
                  </div>
                  <div className="mb-3">
                     <div className="font-semibold">Brand:</div>
                     <div>{salePost.salePost.brand}</div>
                  </div>
                  <div className="mb-3">
                     <div className="font-semibold">Origin:</div>
                     <div>{salePost.salePost.origin}</div>
                  </div>
                  <div className="mb-3">
                     <div className="font-semibold">Description:</div>
                     <div>{salePost.salePost.description}</div>
                  </div>
               </div>
               <div className=" dark:bg-dark-primary bg-light-primary rounded-lg my-4 text-left px-8 py-4">
                  <div className="font-semibold mb-3">Angency Info</div>
                  <div className="flex justify-between">
                     <div className="flex items-center">
                        <div className="overflow-hidden ">
                           <Image
                              src={salePost.salePost.agency.avatar}
                              alt="avatar-agency"
                              width={70}
                              height={70}
                              className="rounded-full"
                           />
                        </div>
                        <div className="text-left ml-4">
                           <div className="font-semibold whitespace-nowrap text-xl text-blue-main">
                              {salePost.salePost.agency.name}
                           </div>
                           <div className=" whitespace-nowrap">
                              {salePost.salePost.agency.field.name}
                           </div>
                           <div className=" whitespace-nowrap">
                              {salePost.salePost.agency.address}
                           </div>
                        </div>
                     </div>
                     <Link href={`/agencyinfo/${salePost.salePost.agency.id}`}>
                        <div className="bg-blue-main rounded-lg w-16 h-16 flex justify-center items-center hover:bg-opacity-80 cursor-pointer text-white">
                           <BiStore className="text-3xl" />
                        </div>
                     </Link>
                  </div>
               </div>
            </div>
         </div>
         {/* items */}
         <div className="col-span-3">
            <div>
               <ul>
                  <li className="grid grid-cols-6 items-center text-center font-semibold w-full pb-4 rounded-t-lg border-b border-gray-200 dark:border-gray-600">
                     <div className="text-left">Avatar</div>
                     <div className="text-left col-span-2">Title</div>
                     <div>Quantity</div>
                     <div>Unit Price</div>
                     <div>Inventory</div>
                  </li>
                  {salePost.salePost.itemPostSet.map((item) => (
                     <li
                        className="w-full rounded-t-lg border-b border-gray-200 dark:border-gray-600"
                        key={item.id}
                     >
                        <div className="grid grid-cols-6 items-center">
                           <div className="overflow-hidden aspect-square relative w-12 h-12 my-4">
                              <Image
                                 src={item.avatar}
                                 alt="image item"
                                 layout="fill"
                                 className="rounded-lg"
                              />
                           </div>

                           <label
                              htmlFor={item.id}
                              className="w-full text-sm text-left font-medium text-gray-900 dark:text-gray-300 col-span-2"
                           >
                              {item.name}
                           </label>
                           <input
                              type="number"
                              disabled={item.inventory > 0 ? false : true}
                              className="w-[40px] mx-auto text-center disabled:cursor-not-allowed"
                              defaultValue="0"
                              onChange={(e) =>
                                 handleChangeQuantity(item, e.target.value)
                              }
                           />
                           <div>{item.unitPrice}</div>
                           <div>{item.inventory}</div>
                        </div>
                     </li>
                  ))}
               </ul>
               <div>
                  <button
                     className="bg-blue-main w-[70%] h-[60px] flex items-center justify-center rounded-lg mx-auto my-8 font-semibold hover:opacity-80 text-white"
                     onClick={handleAddToCart}
                  >
                     Add to your cart
                  </button>
               </div>
            </div>
         </div>
         {/* comment */}
         <div className="grid grid-cols-1 my-8">
            <div className="col-span-3 dark:bg-dark-primary bg-light-primary rounded-lg py-8">
               <div className="font-semibold text-left ml-8 text-lg">
                  Feedback
               </div>
               <CommentForm
                  postID={id}
                  comments={comments}
                  setComments={setComments}
                  setStarAvg={setStarAvg}
                  setCommentCount={setCommentCount}
               />
               {comments.reverse().map((c) => (
                  <div key={c.id} className="flex mb-8 ml-20">
                     <div className="overflow-hidden ">
                        <Image
                           src={c.author.avatar}
                           alt=""
                           width={50}
                           height={50}
                           className="rounded-full"
                        />
                     </div>
                     <div className="flex flex-col items-start ml-6">
                        <div className="font-semibold text-blue-main">
                           {c.author.lastName} {c.author.firstName}
                        </div>

                        <div>{c.content}</div>
                        <Rating
                           sx={{
                              "& .MuiRating-iconFilled": {
                                 color: "#525EC1",
                              },
                              "& .MuiRating-iconEmpty": {
                                 color: "#656b99",
                              },
                           }}
                           value={c.starRate}
                           readOnly
                        />
                     </div>
                  </div>
               ))}
            </div>
         </div>
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
}) => {
   const { state, dispatch } = useContext(Store);
   const { cart, userInfo } = state;
   const [content, setContent] = useState("");
   const router = useRouter();
   const [value, setValue] = React.useState<number | null>(0);
   const onChangeContent = (e) => {
      setContent(e.target.value);
   };
   const addComment = async (event) => {
      event.preventDefault();
      if (userInfo) {
         if (content == "" || value == 0) {
            toast.error("Please comment anh rating before send feedback!", {
               position: "bottom-center",
            });
         } else {
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
            const resStar = await API.get(endpoints["star_avg_post"](postID));
            setStarAvg(resStar.data.data);
            setCommentCount(resCount.data.data);

            setComments([...comments, res.data.data]);
            setContent("");
         }
      } else {
         router.push("/signin");
      }
   };

   return (
      <>
         <form onSubmit={addComment} className="">
            <div className="">
               <input
                  type="text"
                  placeholder="Comment..."
                  className=" rounded-lg h-18 w-[90%] mx-auto my-4 p-4"
                  onChange={onChangeContent}
                  value={content}
               />
            </div>
            <div className="my-4">
               <Rating
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
               className="p-4 bg-blue-main rounded-lg font-semibold text-white hover:opacity-80 disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
               Send your feedback
            </button>
         </form>
      </>
   );
};

export default ProductPage;
export const getStaticProps = async (context) => {
   // request salepost detail
   const id = context.params.id;
   const resSalePost = await axios.get(
      "http://localhost:8080/ou-ecommerce/api/sale-post/" + id
   );
   const salePost = await resSalePost.data.data;

   return { props: { salePost } };
};

export async function getStaticPaths() {
   if (process.env.SKIP_BUILD_STATIC_GENERATION) {
      return {
         paths: [],
         fallback: "blocking",
      };
   }
   const res = await axios.get(
      "http://localhost:8080/ou-ecommerce/api/sale-post/all"
   );
   const salePosts = await res.data.data;
   const paths = salePosts.map((salePost) => ({
      params: { id: salePost.id.toString() },
   }));
   return {
      paths,
      fallback: false, // can also be true or 'blocking'
   };
}
