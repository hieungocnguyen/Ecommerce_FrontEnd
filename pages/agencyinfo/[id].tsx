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

const ProductItem = dynamic(import("../../components/ProductItem"));

const AgencyPage = ({ agencyInfo, posts, stats }) => {
   const router = useRouter();
   const [numberPage, setnumberPage] = useState(1);
   const [stateFollow, setStateFollow] = useState<boolean>(false);
   const { state, dispatch } = useContext(Store);
   const { userInfo } = state;

   const trans = useTrans();
   const fetchFollowAgencyState = async () => {
      try {
         const res = await authAxios().get(
            endpoints["get_state_follow_agency"](agencyInfo.id)
         );
         setStateFollow(res.data.data);
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      if (agencyInfo) {
         fetchFollowAgencyState();
      }
   }, [agencyInfo]);

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
               {/* <div className="relative -bottom-10 left-1/2 -translate-x-1/2 overflow-hidden w-40 h-40 z-30">
                  <Image
                     src={agencyInfo ? agencyInfo.avatar : ""}
                     alt=""
                     layout="fill"
                     className="rounded-xl object-cover"
                  />
               </div>
               <div className="text-3xl font-semibold text-center mt-14">
                  {agencyInfo ? agencyInfo.name : ""}
               </div> */}
               <div className="relative -bottom-10 left-1/2 -translate-x-1/2 w-5/6 z-30 grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-2 relative overflow-hidden aspect-square">
                     <Image
                        src={agencyInfo ? agencyInfo.avatar : ""}
                        alt=""
                        layout="fill"
                        className="rounded-xl object-cover"
                     />
                  </div>
                  <div className="col-span-10 bg-light-primary dark:bg-dark-primary rounded-lg text-left p-6">
                     <div className="flex justify-between items-center">
                        <div className="text-3xl font-semibold">
                           {agencyInfo ? agencyInfo.name : ""}
                        </div>
                        <div
                           className={`px-4 py-3 border-primary-color border-2 inline-block cursor-pointer rounded-lg font-semibold hover:shadow-lg hover:shadow-primary-color ${
                              stateFollow ? "" : "bg-primary-color text-white"
                           }`}
                           onClick={() => handleFollowAgency()}
                        >
                           {stateFollow
                              ? trans.agencyPage.unfollow
                              : trans.agencyPage.follow}
                        </div>
                     </div>
                     <div className="grid grid-cols-12 gap-8 mt-4">
                        <div className="col-span-6">
                           <div className="flex mb-1">
                              <div className="font-medium">Star average: </div>
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
                                 <div className="font-medium">Follow: </div>
                                 <div className="text-primary-color flex items-center gap-1">
                                    <span>{stats.numOfFollow}</span>
                                    <BiUser />
                                 </div>
                              </div>
                           </div>
                           <div className="mb-1 flex gap-2">
                              <div className="flex">
                                 <div className="font-medium">Like: </div>
                                 <div className="text-primary-color flex items-center gap-1">
                                    <span>{stats.numOfLike}</span>
                                    <BiLike />
                                 </div>
                              </div>
                              <div className="flex">
                                 <div className="font-medium">Comment: </div>
                                 <div className="text-primary-color flex items-center gap-1">
                                    <span>{stats.numOfComment}</span>
                                    <BiMessageDetail />
                                 </div>
                              </div>
                           </div>
                           <div className="">
                              <span className="font-medium">Join date: </span>
                              {agencyInfo.createdDate
                                 ? new Date(
                                      agencyInfo.createdDate
                                   ).toLocaleDateString("en-GB")
                                 : ""}
                           </div>
                        </div>
                        <div className="col-span-6">
                           <div className="mb-1">
                              <span className="font-medium">Field: </span>
                              {agencyInfo.field ? agencyInfo.field.name : ""}
                           </div>
                           <div className="mb-1">
                              <span className="font-medium">Hotline: </span>
                              {agencyInfo.hotline ? agencyInfo.hotline : ""}
                           </div>
                           <div className="">
                              <span className="font-medium">Address: </span>
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
                     alt=""
                     layout="fill"
                     className="object-cover"
                  />
               </div>
            </div>
            {/* <div
               className={`mt-36 px-4 py-3 border-primary-color border-2 inline-block mx-auto cursor-pointer rounded-lg font-semibold hover:shadow-lg hover:shadow-primary-color ${
                  stateFollow ? "" : "bg-primary-color text-white"
               }`}
               onClick={() => handleFollowAgency()}
            >
               {stateFollow
                  ? trans.agencyPage.unfollow
                  : trans.agencyPage.follow}
            </div> */}
            <div className="grid grid-cols-4 gap-8 mt-44">
               <Suspense
                  fallback={
                     <div className="flex justify-center my-8">
                        <ClipLoader size={35} color="#FF8500" />
                     </div>
                  }
               >
                  {posts.map((post) => (
                     <ProductItem
                        key={post.id}
                        product={post}
                        inCompare={false}
                     />
                  ))}
               </Suspense>
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
