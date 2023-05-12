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
import { BiArrowBack } from "react-icons/bi";
import useTrans from "../../hook/useTrans";
import toast from "react-hot-toast";
import { Store } from "../../utils/Store";

const ProductItem = dynamic(import("../../components/ProductItem"));

const AgencyPage = ({ agencyInfo, posts }) => {
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
         } catch (error) {
            console.log(error);
            toast.error("Something wrong, please try again!");
         }
      } else {
         toast.error("Sign in to follow agency!");
      }
   };

   return (
      <Layout title="Agency">
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
               <div className="relative -bottom-10 left-1/2 -translate-x-1/2 overflow-hidden w-40 h-40 ">
                  <Image
                     src={agencyInfo ? agencyInfo.avatar : ""}
                     alt=""
                     layout="fill"
                     className="rounded-xl object-cover"
                  />
               </div>
               <div className="text-3xl font-semibold text-center mt-14">
                  {agencyInfo ? agencyInfo.name : ""}
               </div>
            </div>
            <div
               className={`mt-36 px-4 py-3 border-primary-color border-2 inline-block mx-auto cursor-pointer rounded-lg font-semibold hover:shadow-lg hover:shadow-primary-color ${
                  stateFollow ? "" : "bg-primary-color text-white"
               }`}
               onClick={() => handleFollowAgency()}
            >
               {stateFollow ? "Unfollow" : "Follow"}
            </div>
            <div className="grid grid-cols-4 gap-8 mt-8">
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

   const agencyInfo = await resAgency.data.data;
   const posts = await resPosts.data.data;
   return { props: { agencyInfo, posts } };
};
