import { useRouter } from "next/router";
import { useRef, useEffect, useState, useContext, Suspense } from "react";
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
import HotCategory from "../components/HotCategory";
import { BiShoppingBag } from "react-icons/bi";
import ProductSkeleton from "../components/ProductSkeleton";
import TopSeller from "../components/TopSeller";

//lazy loading
const ProductItem = dynamic(() => import("../components/ProductItem"), {
   loading: () => <ProductSkeleton />,
});

export default function Home({ categories }) {
   const { state, dispatch } = useContext(Store);
   const [salePosts, setSalePost] = useState([]);
   const [numberPage, setNumberPage] = useState(1);
   const [hotAgency, setHotAgency] = useState<any>([]);
   const [totalPage, setTotalPage] = useState(1);
   const [openCompare, setOpenCompare] = useState(false);
   const [loading, setLoading] = useState(false);
   const [isFetching, setIsFetching] = useState(false);
   const [itemsHot, setItemsHot] = useState<any>([]);

   const trans = useTrans();

   const loadPosts = async () => {
      try {
         setIsFetching(true);
         const resPosts = await API.post(endpoints["search_salePost"], {
            page: numberPage,
         });
         setSalePost(resPosts.data.data.listResult);
         setTotalPage(resPosts.data.data.totalPage);
         setIsFetching(false);
      } catch (error) {
         console.log(error);
         setIsFetching(false);
      }
   };

   const fetchItemsBestSeller = async () => {
      try {
         const res = await API.get(endpoints["items_best_seller"](6));
         setItemsHot(res.data.data);
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      loadPosts();
      fetchItemsBestSeller();
   }, [numberPage]);

   return (
      <div>
         <Layout title="Home">
            <SearchBar categories={categories} setNumberPage={setNumberPage} />
            <div>
               <Advertise />
               <div className="sm:my-10 my-6">
                  <HotAgency />
               </div>
               <div className="mb-10">
                  <HotCategory categoryList={categories.slice(0, 5)} />
               </div>
               <div className="grid sm:grid-cols-4 grid-cols-1 gap-10 h-fit">
                  <div className="border-[3px] border-primary-color p-4 rounded-lg flex gap-4 items-center">
                     <div className="relative w-16 aspect-square  overflow-hidden">
                        <Image
                           src={f1}
                           alt="img"
                           layout="fill"
                           className="object-cover"
                        />
                     </div>
                     <div className=" font-bold text-xl text-left w-28">
                        {trans.home.featured.variety}
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
                     <div className="font-bold text-xl text-left w-32">
                        {trans.home.featured.quality}
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
                     <div className=" font-bold text-xl text-left w-36">
                        {trans.home.featured.tracking}
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
                     <div className=" font-bold text-xl text-left w-40">
                        {trans.home.featured.shipping}
                     </div>
                  </div>
               </div>
               <div className="my-6">
                  <TopSeller itemsHot={itemsHot} />
               </div>
               <div className="my-8">
                  <h1 className="flex justify-center items-center gap-1 font-bold text-2xl my-4 ">
                     <span>
                        <BiShoppingBag className="text-xl" />
                     </span>
                     {trans.home.allPost}
                  </h1>
                  <div className="grid sm:grid-cols-4 grid-cols-1 gap-10">
                     {isFetching && salePosts.length == 0 && (
                        <>
                           <ProductSkeleton />
                           <ProductSkeleton />
                           <ProductSkeleton />
                           <ProductSkeleton />
                        </>
                     )}
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
                                    setSalePost([]);
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
