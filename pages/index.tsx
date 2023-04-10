import { useRouter } from "next/router";
import { useRef, useEffect, useState, useContext } from "react";
import Advertise from "../components/Advertise";
import Layout from "../components/Layout/Layout";
// import ProductItem from "../components/ProductItem";
import SearchBar from "../components/SearchBar";
import axios from "axios";
import { Store } from "../utils/Store";
import API, { endpoints } from "../API";
import HotAgency from "../components/HotAgency";
import Loader from "../components/Loader";
import dynamic from "next/dynamic";
import f1 from "../public/1feature.png";
import f2 from "../public/2feature.png";
import f3 from "../public/3feature.png";
import f4 from "../public/4feature.png";
import Image from "next/image";

//lazy loading
const ProductItem = dynamic(import("../components/ProductItem"));

export default function Home({ categories }) {
   const { state, dispatch } = useContext(Store);
   const [salePosts, setSalePost] = useState([]);
   const [numberPage, setnumberPage] = useState(1);
   const [hotAgency, setHotAgency] = useState<any>([]);
   const [totalPage, setTotalPage] = useState(1);
   const [openCompare, setOpenCompare] = useState(false);
   const [loading, setLoading] = useState(false);

   const loadPosts = async () => {
      try {
         const resPosts = await API.post(endpoints["search_salePost"], {
            page: numberPage,
         });
         setSalePost(resPosts.data.data.listResult);
         setTotalPage(resPosts.data.data.totalPage);
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
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
                  <HotAgency setLoading={setLoading} />
               </div>
               <div className="grid grid-cols-4 gap-6 h-fit">
                  <div className="border-[3px] border-blue-main p-4 rounded-lg flex gap-4 items-center">
                     <div className="relative w-16 aspect-square  overflow-hidden">
                        <Image
                           src={f1}
                           alt="img"
                           layout="fill"
                           className="object-cover"
                        />
                     </div>
                     <div className=" font-bold text-xl text-left ">
                        Variety of
                        <br /> products
                     </div>
                  </div>
                  <div className="border-[3px] border-blue-main p-4 rounded-lg  flex gap-4 items-center">
                     <div className="relative w-16 aspect-square">
                        <Image
                           src={f2}
                           alt="img"
                           layout="fill"
                           className="object-contain"
                        />
                     </div>
                     <div className="font-bold text-xl text-left ">
                        Best quality guarantee
                     </div>
                  </div>
                  <div className="border-[3px] border-blue-main p-4 rounded-lg flex gap-4 items-center">
                     <div className="relative w-16 aspect-square  overflow-hidden">
                        <Image
                           src={f3}
                           alt="img"
                           layout="fill"
                           className="object-cover"
                        />
                     </div>
                     <div className=" font-bold text-xl text-left ">
                        Easy tracking
                        <br /> your order
                     </div>
                  </div>
                  <div className="border-[3px] border-blue-main p-4 rounded-lg flex gap-4 items-center">
                     <div className="relative w-20 h-16 overflow-hidden">
                        <Image
                           src={f4}
                           alt="img"
                           layout="fill"
                           className="object-contain"
                        />
                     </div>
                     <div className=" font-bold text-xl text-left ">
                        Fast & low cost shipping
                     </div>
                  </div>
               </div>
               <div className="my-8">
                  <h1 className="text-center font-bold text-2xl my-5">
                     All Posts
                  </h1>
                  <div className="grid lg:grid-cols-4 grid-cols-2 gap-10">
                     {salePosts.map((i) => (
                        <ProductItem key={i.id} product={i} inCompare={false} />
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
            {loading ? <Loader /> : <></>}
         </Layout>
      </div>
   );
}

export const getServerSideProps = async () => {
   const resCategories = await axios.get(
      "http://localhost:8080/ou-ecommerce/api/category/all"
   );
   const categories = await resCategories.data.data;
   return { props: { categories } };
};
