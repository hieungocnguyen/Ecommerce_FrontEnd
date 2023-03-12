/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import API, { endpoints } from "../../API";
import Layout from "../../components/Layout/Layout";
import ProductItem from "../../components/ProductItem";

const AgencyPage = ({ agencyInfo }) => {
   const [salePosts, setSalePosts] = useState([]);
   const router = useRouter();
   const id = router.query.id;
   const [numberPage, setnumberPage] = useState(1);
   const [agency, setAgency] = useState<any>({});
   useEffect(() => {
      const loadAgency = async () => {
         const resAgency = await API.get(endpoints["agency_info"](id));
         setAgency(resAgency.data.data);
      };
      const loadPosts = async () => {
         const resPosts = await API.post(endpoints["search_salePost"], {
            agency: agency.name,
            page: numberPage,
         });
         setSalePosts(resPosts.data.data.listResult);
      };
      loadPosts();
      loadAgency();
      const pages = document.querySelectorAll(".paginator");
      for (let i = 0; i < pages.length; i++) {
         if (i === numberPage - 1) {
            pages[i].classList.add("bg-blue-main");
         } else {
            pages[i].classList.remove("bg-blue-main");
         }
      }
   }, [router.query.input, numberPage, id, agency.name]);
   return (
      <Layout title="Agency">
         {/* <div className="col-span-2 dark:bg-dark-primary bg-light-primary rounded-lg h-fit p-8">
               <div className="flex justify-center items-center">
                  <img
                     src={agency.avatar}
                     alt=""
                     className="w-60 h-60 rounded-full"
                  />
               </div>
               <div className="my-4 font-semibold text-blue-main text-xl">
                  {agency.name}
               </div>
               <div className="my-2 font-semibold">{agencyInfo.field.name}</div>

               <div>{agency.address}</div>
               <div>{agency.hotline}</div>
            </div> */}
         {/* posts side */}
         <div className="col-span-4 my-8">
            <div className="col-span-1 grid grid-cols-4 gap-8">
               {salePosts.map((post) => (
                  <ProductItem
                     key={post.id}
                     product={post}
                     inCompare={false}
                     setLoading={undefined}
                  />
               ))}
            </div>
            <div
               className="flex gap-4
                justify-center my-8"
            >
               <div
                  className="w-8 h-8 rounded-lg border-2 border-blue-main flex justify-center items-center cursor-pointer paginator"
                  onClick={(e) => {
                     setnumberPage(1);
                  }}
               >
                  1
               </div>
               <div
                  className="w-8 h-8 rounded-lg border-2 border-blue-main flex justify-center items-center cursor-pointer paginator"
                  onClick={(e) => {
                     setnumberPage(2);
                  }}
               >
                  2
               </div>
               <div
                  className="w-8 h-8 rounded-lg border-2 border-blue-main flex justify-center items-center cursor-pointer paginator"
                  onClick={(e) => {
                     setnumberPage(3);
                  }}
               >
                  3
               </div>
               <div
                  className="w-8 h-8 rounded-lg border-2 border-blue-main flex justify-center items-center cursor-pointer paginator"
                  onClick={(e) => {
                     setnumberPage(4);
                  }}
               >
                  4
               </div>
               <div
                  className="w-8 h-8 rounded-lg border-2 border-blue-main flex justify-center items-center cursor-pointer paginator"
                  onClick={(e) => {
                     setnumberPage(5);
                  }}
               >
                  5
               </div>
            </div>
         </div>
      </Layout>
   );
};

export default AgencyPage;
export const getStaticProps = async (context) => {
   const id = context.params.id;
   // const resCategories = await axios.get(
   //    "http://localhost:8080/ou-ecommerce/api/category/all"
   // );
   // const categories = await resCategories.data.data;
   const resAgency = await API.get(endpoints["agency_info"](id));
   const agencyInfo = await resAgency.data.data;
   return { props: { agencyInfo } };
};
export async function getStaticPaths() {
   if (process.env.SKIP_BUILD_STATIC_GENERATION) {
      return {
         paths: [],
         fallback: "blocking",
      };
   }
   const res = await axios.get(
      "http://localhost:8080/ou-ecommerce/api/agency/all"
   );
   const agencys = await res.data.data;
   const paths = agencys.map((agency) => ({
      params: { id: agency.id.toString() },
   }));
   return {
      paths,
      fallback: false, // can also be true or 'blocking'
   };
}
