/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import { useRouter } from "next/router";
import { Suspense, useEffect, useState } from "react";
import API, { endpoints } from "../../API";
import Layout from "../../components/Layout/Layout";
import ProductItem from "../../components/ProductItem";
import { ClipLoader } from "react-spinners";
import Image from "next/image";

const AgencyPage = ({ agencyInfo }) => {
   const [salePosts, setSalePosts] = useState([]);
   const router = useRouter();
   const id = router.query.id;
   const [numberPage, setnumberPage] = useState(1);
   const [agency, setAgency] = useState<any>({});

   const loadAgency = async () => {
      try {
         const resAgency = await API.get(endpoints["agency_info"](id));
         setAgency(resAgency.data.data);
      } catch (error) {
         console.log(error);
      }
   };
   const loadPosts = async () => {
      try {
         const resPosts = await API.get(
            endpoints["get_post_published_by_agencyID"](id)
         );
         setSalePosts(resPosts.data.data);
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      loadPosts();
      loadAgency();
   }, []);

   return (
      <Layout title="Agency">
         <div className="my-6">
            <div className="bg-blue-main rounded-lg h-32 relative">
               <div className="relative -bottom-10 left-1/2 -translate-x-1/2 overflow-hidden w-40 h-40 ">
                  <Image
                     src={agency.avatar}
                     alt=""
                     layout="fill"
                     className="rounded-xl"
                  />
               </div>
               <div className="text-3xl font-semibold text-center mt-14">
                  {agency.name}
               </div>
            </div>
            <div className="grid grid-cols-4 gap-8 mt-48">
               <Suspense
                  fallback={
                     <div className="flex justify-center my-8">
                        <ClipLoader size={35} color="#FF8500" />
                     </div>
                  }
               >
                  {salePosts.map((post) => (
                     <ProductItem
                        key={post.id}
                        product={post}
                        inCompare={false}
                        setLoading={undefined}
                     />
                  ))}
               </Suspense>
            </div>
         </div>
      </Layout>
   );
};

export default AgencyPage;
