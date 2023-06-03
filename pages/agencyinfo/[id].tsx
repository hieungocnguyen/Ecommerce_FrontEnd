/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import { useRouter } from "next/router";
import { Suspense, useEffect, useContext, useState } from "react";
import API, { authAxios, endpoints } from "../../API";
import Layout from "../../components/Layout/Layout";
// import ProductItem from "../../components/ProductItem";
import { ClipLoader } from "react-spinners";
import Image from "next/image";
import dynamic from "next/dynamic";
import { BiArrowBack, BiLike, BiMessageDetail, BiUser } from "react-icons/bi";
import useTrans from "../../hook/useTrans";
import toast from "react-hot-toast";
import { Store } from "../../utils/Store";
import Rating from "@mui/material/Rating";
import PaginationComponent from "../../components/Pagination";
import {
   addDoc,
   collection,
   doc,
   getDoc,
   serverTimestamp,
   setDoc,
} from "firebase/firestore";
import { chat } from "../../lib/chat_firebase";
import Link from "next/link";

const ProductItem = dynamic(import("../../components/ProductItem"));

const AgencyPage = ({ agencyInfo, posts, stats }) => {
   const router = useRouter();
   const { locale } = useRouter();
   const [stateFollow, setStateFollow] = useState<boolean>(false);
   const { state, dispatch } = useContext(Store);
   const { userInfo } = state;

   const lengthOfPage = 8;
   const [pageCurrent, setPageCurrent] = useState(1);
   const [totalPage, setTotalPage] = useState(0);

   const trans = useTrans();

   const [itemsHot, setItemsHot] = useState<any>([]);

   const fetchFollowAgencyState = async () => {
      try {
         const res = await authAxios().get(
            endpoints["get_state_follow_agency"](agencyInfo.id)
         );
         setStateFollow(res.data.data);
         setTotalPage(Math.ceil(res.data.data.length / lengthOfPage));
      } catch (error) {
         console.log(error);
      }
   };
   const fetchHotItems = async () => {
      try {
         const res = await API.get(
            endpoints["item_best_seller_by_agency"](4, agencyInfo?.id)
         );
         setItemsHot(res.data.data);
         console.log(res.data.data);
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      if (userInfo) {
         fetchFollowAgencyState();
      }
      fetchHotItems();
   }, [userInfo, agencyInfo]);

   const handleFollowAgency = async () => {
      if (userInfo) {
         try {
            const res = await authAxios().get(
               endpoints["follow_agency"](agencyInfo.id)
            );
            setStateFollow(res.data.data.state === 1 ? true : false);
            toast.success(
               res.data.data.state === 0
                  ? "Unfollow successful"
                  : "Follow successful"
            );
         } catch (error) {
            console.log(error);
            toast.error("Something wrong, please try again!");
         }
      } else {
         toast.error("Sign in to follow merchant!");
      }
   };

   const handleChat = async () => {
      const docRef = doc(
         chat,
         `customer${userInfo?.id}`,
         `agency${agencyInfo.id}`
      );

      if ((await getDoc(docRef)).exists()) {
         await setDoc(
            docRef,
            {
               avatar: agencyInfo.avatar,
               createdAt: serverTimestamp(),
               displayName: agencyInfo.name,
            },
            { merge: true }
         );
      } else {
         await setDoc(docRef, {
            avatar: agencyInfo.avatar,
            id: agencyInfo?.id,
            createdAt: serverTimestamp(),
            displayName: agencyInfo.name,
            messageLatest: "Click to start chat",
            isSeen: true,
            messages: [],
         });
      }
   };

   return (
      <Layout title="Merchant">
         <div className="my-6">
            <div className="flex gap-4 items-center m-6">
               <div
                  className="bg-primary-color text-white p-3 text-2xl rounded-lg cursor-pointer hover:shadow-lg hover:shadow-primary-color"
                  onClick={() => router.back()}
               >
                  <BiArrowBack />
               </div>
               <div className="font-semibold text-2xl">
                  / {trans.agencyPage.title}
               </div>
            </div>
            <div className="bg-primary-color rounded-lg h-32 relative">
               <div className="relative -bottom-10 left-1/2 -translate-x-1/2 w-5/6 z-30 grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-2 relative overflow-hidden aspect-square">
                     <Image
                        src={agencyInfo ? agencyInfo.avatar : ""}
                        alt="img"
                        layout="fill"
                        className="rounded-xl object-cover"
                     />
                  </div>
                  <div className="col-span-10 bg-light-primary dark:bg-dark-primary rounded-lg text-left p-6">
                     <div className="flex justify-between items-center">
                        <div className="text-3xl font-semibold">
                           {agencyInfo ? agencyInfo.name : ""}
                        </div>
                        <div className="flex gap-4">
                           <div
                              className="p-3 cursor-pointer bg-primary-color text-white rounded-lg font-semibold"
                              onClick={handleChat}
                           >
                              Chat now
                           </div>
                           <div
                              className={`px-4 py-3 border-primary-color border-2 inline-block cursor-pointer rounded-lg font-semibold hover:shadow-lg hover:shadow-primary-color ${
                                 stateFollow
                                    ? ""
                                    : "bg-primary-color text-white"
                              }`}
                              onClick={() => handleFollowAgency()}
                           >
                              {stateFollow
                                 ? trans.agencyPage.unfollow
                                 : trans.agencyPage.follow}
                           </div>
                        </div>
                     </div>
                     <div className="grid grid-cols-12 gap-8 mt-4">
                        <div className="col-span-6">
                           <div className="flex mb-1">
                              <div className="font-medium">
                                 {trans.agencyPage.star_average}:{" "}
                              </div>
                              <Rating
                                 size="medium"
                                 sx={{
                                    "& .MuiRating-iconFilled": {
                                       color: "#2065d1",
                                    },
                                    "& .MuiRating-iconEmpty": {
                                       color: "#2065d1",
                                    },
                                 }}
                                 name="half-rating-read"
                                 precision={0.2}
                                 // value={3.6}
                                 value={stats.averageStar}
                                 readOnly
                              />
                              <div className="font-medium text-primary-color">
                                 ({stats.averageStar.toFixed(2)})
                              </div>
                           </div>
                           <div className="flex gap-4 mb-1">
                              <div className="flex gap-2">
                                 <div className="font-medium">
                                    {trans.agencyPage.follower}:
                                 </div>
                                 <div className="text-primary-color flex items-center gap-1 font-medium">
                                    <span>{stats.numOfFollow}</span>
                                    <BiUser />
                                 </div>
                              </div>
                           </div>
                           <div className="mb-1 flex gap-4">
                              <div className="flex gap-2">
                                 <div className="font-medium">
                                    {trans.agencyPage.like}:{" "}
                                 </div>
                                 <div className="text-primary-color flex items-center gap-1 font-medium">
                                    <span>{stats.numOfLike}</span>
                                    <BiLike />
                                 </div>
                              </div>
                              <div className="flex gap-2">
                                 <div className="font-medium">
                                    {trans.agencyPage.review}:
                                 </div>
                                 <div className="text-primary-color flex items-center gap-1 font-medium">
                                    <span>{stats.numOfComment}</span>
                                    <BiMessageDetail />
                                 </div>
                              </div>
                           </div>
                           <div className="">
                              <span className="font-medium">
                                 {trans.agencyPage.joined_date}:{" "}
                              </span>
                              {agencyInfo.createdDate
                                 ? new Date(
                                      agencyInfo.createdDate
                                   ).toLocaleDateString("en-GB")
                                 : ""}
                           </div>
                        </div>
                        <div className="col-span-6">
                           <div className="mb-1">
                              <span className="font-medium">
                                 {trans.agencyPage.field}:{" "}
                              </span>
                              {agencyInfo.field
                                 ? locale == "vi"
                                    ? agencyInfo.field.name
                                    : agencyInfo.field.nameEn
                                 : ""}
                           </div>
                           <div className="mb-1">
                              <span className="font-medium">
                                 {trans.agencyPage.hotline}:{" "}
                              </span>
                              {agencyInfo.hotline ? agencyInfo.hotline : ""}
                           </div>
                           <div className="">
                              <span className="font-medium">
                                 {trans.agencyPage.address}:{" "}
                              </span>
                              {agencyInfo.fromAddress
                                 ? agencyInfo.fromAddress
                                 : ""}
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="absolute top-0 left-0 overflow-hidden w-full h-full z-20 rounded-lg opacity-10">
                  <Image
                     src={agencyInfo ? agencyInfo.avatar : ""}
                     alt="img"
                     layout="fill"
                     className="object-cover"
                  />
               </div>
            </div>
            <div className="mt-44 mb-8">
               <div className="text-center font-bold text-2xl mb-4">
                  Hot Sellers
               </div>
               <div className="">
                  <div className="grid grid-cols-4 gap-8">
                     {itemsHot.length > 0 &&
                        itemsHot.map((item) => (
                           <Link
                              href={`/sale_post/${item[1].id}`}
                              key={item.id}
                           >
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
                  </div>
               </div>
            </div>
            <div className="">
               <div className="text-center font-bold text-2xl mb-4">
                  All products of Merchant
               </div>
               <div>
                  <div className="grid grid-cols-4 gap-8">
                     <Suspense
                        fallback={
                           <div className="flex justify-center my-8">
                              <ClipLoader size={35} color="#FF8500" />
                           </div>
                        }
                     >
                        {posts
                           .slice(
                              (pageCurrent - 1) * lengthOfPage,
                              (pageCurrent - 1) * lengthOfPage + lengthOfPage
                           )
                           .map((post) => (
                              <ProductItem
                                 key={post.id}
                                 product={post}
                                 inCompare={false}
                              />
                           ))}
                     </Suspense>
                  </div>
                  <PaginationComponent
                     totalPage={totalPage}
                     pageCurrent={pageCurrent}
                     setPageCurrent={setPageCurrent}
                  />
               </div>
            </div>
         </div>
      </Layout>
   );
};

export default AgencyPage;
// export default dynamic(() => Promise.resolve(AgencyPage), { ssr: false });
export const getServerSideProps = async (context) => {
   const id = context.params.id;
   const resAgency = await API.get(endpoints["agency_info"](id));

   const resPosts = await API.get(
      endpoints["get_post_published_by_agencyID"](id)
   );
   const resStats = await API.get(endpoints["stats_agency"](id));
   const agencyInfo = await resAgency.data.data;
   const posts = await resPosts.data.data;
   const stats = await resStats.data.data;

   return { props: { agencyInfo, posts, stats } };
};
