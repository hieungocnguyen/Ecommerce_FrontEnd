import { useRouter } from "next/router";
import { useRef, useEffect, useState, useContext } from "react";
import Advertise from "../components/Advertise";
import Layout from "../components/Layout/Layout";
import ProductItem from "../components/ProductItem";
import SearchBar from "../components/SearchBar";
import axios from "axios";
import { Store } from "../utils/Store";
import API, { endpoints } from "../API";
import { log } from "console";
import HotAgency from "../components/HotAgency";

export default function Home({ categories }) {
   const { state, dispatch } = useContext(Store);
   const [salePosts, setSalePost] = useState([]);
   const [numberPage, setnumberPage] = useState(1);
   const [hotAgency, setHotAgency] = useState<any>([]);
   const [totalPage, setTotalPage] = useState(1);
   useEffect(() => {
      const loadPosts = async () => {
         const resPosts = await API.post(endpoints["search_salePost"], {
            page: numberPage,
         });
         setSalePost(resPosts.data.data.listResult);
         setTotalPage(resPosts.data.data.totalPage);
      };
      loadPosts();

      const pages = document.querySelectorAll(".paginator");
      for (let i = 0; i < pages.length; i++) {
         if (i === numberPage - 1) {
            pages[i].classList.add(...["bg-blue-main", "text-white"]);
         } else {
            pages[i].classList.remove(...["bg-blue-main", "text-white"]);
         }
      }
   }, [numberPage]);

   return (
      <div>
         <Layout title="Home">
            <SearchBar categories={categories} />
            <div>
               <Advertise />
               <div className="my-16">
                  <HotAgency />
               </div>
               <div className="my-8">
                  <h1 className="text-center font-bold text-2xl my-5">
                     All Posts
                  </h1>
                  <div className="grid lg:grid-cols-4 grid-cols-2 gap-10">
                     {salePosts.map((i) => (
                        <ProductItem key={i.id} product={i} />
                     ))}
                  </div>
                  {/* paginate */}
                  <div
                     className="flex gap-4
                   justify-center mt-8"
                  >
                     {totalPage > 1 ? (
                        Array.from(Array(totalPage), (e, i) => {
                           return (
                              <div
                                 key={i}
                                 className="w-8 h-8 rounded-lg border-2 border-blue-main flex justify-center items-center cursor-pointer paginator font-semibold "
                                 onClick={(e) => {
                                    setnumberPage(i + 1);
                                 }}
                              >
                                 {i + 1}
                              </div>
                           );
                        })
                     ) : (
                        <div></div>
                     )}
                  </div>
               </div>
            </div>
         </Layout>
      </div>
   );
}
export const getStaticProps = async () => {
   const resCategories = await axios.get(
      "http://localhost:8080/ou-ecommerce/api/category/all"
   );
   const categories = await resCategories.data.data;
   return { props: { categories } };
};
