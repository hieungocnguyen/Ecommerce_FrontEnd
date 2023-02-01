import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useRef, useEffect, useState, useContext } from "react";
import Advertise from "../components/Advertise";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import Layout from "../components/Layout/Layout";
import ProductItem from "../components/ProductItem";
import SearchBar from "../components/SearchBar";
import axios from "axios";
import { Store } from "../utils/Store";
import API, { endpoints } from "../API";
import { userInfo } from "os";
import Cookies from "js-cookie";

export default function Home({ categories }) {
   const router = useRouter();
   const searchInput = useRef(null);
   const { state, dispatch } = useContext(Store);
   const { userInfo } = state;
   const [salePosts, setSalePost] = useState([]);
   const [numberPage, setnumberPage] = useState(1);
   const [hotAgency, setHotAgency] = useState<any>([]);
   useEffect(() => {
      const loadPosts = async () => {
         const resPosts = await API.post(endpoints["search_salePost"], {
            page: numberPage,
         });
         setSalePost(resPosts.data.data.listResult);
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
      const loadHotAagencies = async () => {
         const resHot = await API.get(
            "http://localhost:8080/ou-ecommerce/api/agency/top-agency/4"
         );
         setHotAgency(resHot.data.data);
      };
      loadHotAagencies();
   }, [numberPage]);

   return (
      <div>
         <Layout title="Home">
            <SearchBar categories={categories} />
            <div className="my-8">
               <Advertise />
               <h1 className="text-center font-bold text-2xl my-5">
                  All Posts
               </h1>
               <div className="grid lg:grid-cols-4 grid-cols-2 gap-10">
                  {salePosts.map((i) => (
                     <ProductItem key={i.id} product={i} />
                  ))}
               </div>
               <div
                  className="flex gap-4
                justify-center mt-8"
               >
                  <div
                     className="w-8 h-8 rounded-lg border-2 border-blue-main flex justify-center items-center cursor-pointer paginator font-semibold "
                     onClick={(e) => {
                        setnumberPage(1);
                     }}
                  >
                     1
                  </div>
                  <div
                     className="w-8 h-8 rounded-lg border-2 border-blue-main flex justify-center items-center cursor-pointer paginator font-semibold "
                     onClick={(e) => {
                        setnumberPage(2);
                     }}
                  >
                     2
                  </div>
                  <div
                     className="w-8 h-8 rounded-lg border-2 border-blue-main flex justify-center items-center cursor-pointer paginator font-semibold "
                     onClick={(e) => {
                        setnumberPage(3);
                     }}
                  >
                     3
                  </div>
                  <div
                     className="w-8 h-8 rounded-lg border-2 border-blue-main flex justify-center items-center cursor-pointer paginator font-semibold "
                     onClick={(e) => {
                        setnumberPage(4);
                     }}
                  >
                     4
                  </div>
                  <div
                     className="w-8 h-8 rounded-lg border-2 border-blue-main flex justify-center items-center cursor-pointer paginator font-semibold "
                     onClick={(e) => {
                        setnumberPage(5);
                     }}
                  >
                     5
                  </div>
               </div>
            </div>
            {/* <div className="my-8">
               <h1 className="text-center font-bold text-xl my-5">
                  Hot Agency
               </h1>
               <div>
                  {hotAgency.map((h) => (
                     <div key={h.id}>{hotAgency.name}</div>
                  ))}
               </div>
            </div> */}
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
