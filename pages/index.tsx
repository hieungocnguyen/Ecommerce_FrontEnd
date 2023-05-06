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
import useTrans from "../hook/useTrans";

//lazy loading
const ProductItem = dynamic(import("../components/ProductItem"));

export default function Home({ categories }) {
   const { state, dispatch } = useContext(Store);
   const [salePosts, setSalePost] = useState([]);
   const [numberPage, setNumberPage] = useState(1);
   const [hotAgency, setHotAgency] = useState<any>([]);
   const [totalPage, setTotalPage] = useState(1);
   const [openCompare, setOpenCompare] = useState(false);
   const [loading, setLoading] = useState(false);

   const trans = useTrans();

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
   }, [numberPage]);

   return (
      <div>
         <Layout title="Home">
            <SearchBar categories={categories} setNumberPage={setNumberPage} />
            <div>
               <Advertise />
               <div className="sm:my-16 my-6">
                  <HotAgency />
               </div>
               <div className="sm:grid hidden grid-cols-4 gap-10 h-fit">
                  <div className="border-[3px] border-primary-color p-4 rounded-lg flex gap-4 items-center">
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
                  <div className="border-[3px] border-primary-color p-4 rounded-lg  flex gap-4 items-center">
                     <div className="relative w-16 aspect-square overflow-hidden">
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
                  <div className="border-[3px] border-primary-color p-4 rounded-lg flex gap-4 items-center">
                     <div className="relative w-16 aspect-square">
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
                  <div className="border-[3px] border-primary-color p-4 rounded-lg flex gap-4 items-center">
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
                     {trans.home.allPost}
                  </h1>
                  <div className="grid sm:grid-cols-4 grid-cols-1 gap-10">
                     {salePosts.map((i) => (
                        <ProductItem key={i.id} product={i} inCompare={false} />
                     ))}
                  </div>

                  {/* paginate */}
                  <div
                     className="flex gap-4
                   justify-center mt-8"
                  >
                     {totalPage > 1 &&
                        Array.from(Array(totalPage), (e, i) => {
                           return (
                              <div
                                 key={i}
                                 className={`w-8 h-8 rounded-lg border-2 border-primary-color flex justify-center items-center cursor-pointer paginator font-semibold ${
                                    numberPage === i + 1
                                       ? "bg-primary-color text-white"
                                       : ""
                                 } `}
                                 onClick={(e) => {
                                    setNumberPage(i + 1);
                                 }}
                              >
                                 {i + 1}
                              </div>
                           );
                        })}
                  </div>
               </div>
            </div>
            {loading ? <Loader /> : <></>}
         </Layout>
      </div>
   );
}

export const getServerSideProps = async () => {
   const resCategories = await API.get(endpoints["category_all"]);
   const categories = await resCategories.data.data;
   return { props: { categories } };
};
