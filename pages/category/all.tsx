import { Slider } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import API, { endpoints } from "../../API";
import Layout from "../../components/Layout/Layout";
import ProductItem from "../../components/ProductItem";
import SearchBar from "../../components/SearchBar";
import Image from "next/image";
import emptyBox from "../../public/empty-box.png";
import useTrans from "../../hook/useTrans";

function valuetext(value: number) {
   return `${value}°C`;
}
const CategoryAll = ({ categories }) => {
   const [salePosts, setSalePosts] = useState([]);
   const router = useRouter();
   const [page, setPage] = useState(0);
   const [numberPage, setNumberPage] = useState(1);
   const [totalPage, setTotalPage] = useState(1);
   const trans = useTrans();

   const loadPosts = async () => {
      try {
         const resPosts = await API.post(endpoints["search_salePost"], {
            page: numberPage,
         });
         setSalePosts(resPosts.data.data.listResult);
         setTotalPage(resPosts.data.data.totalPage);
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      loadPosts();
   }, [numberPage]);
   return (
      <Layout title="Search Page">
         <SearchBar categories={categories} setNumberPage={setPage} />
         <div className="text-3xl my-8 font-semibold">
            {trans.category.all.title}
         </div>
         <div className="">
            <div className="grid grid-cols-4 gap-8 mb-8">
               {salePosts.length > 0 ? (
                  salePosts.map((post) => (
                     <ProductItem
                        key={post.id}
                        product={post}
                        inCompare={false}
                     />
                  ))
               ) : (
                  <div className="">
                     <div className="relative overflow-hidden aspect-square w-1/4 mx-auto">
                        <Image
                           src={emptyBox}
                           alt="empty"
                           layout="fill"
                           className="object-cover"
                        />
                     </div>
                     <div className="text-center uppercase font-semibold text-xl">
                        {trans.category.empty_text}
                     </div>
                  </div>
               )}
            </div>
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
                           window.scrollTo({
                              top: 0,
                              behavior: "smooth",
                           });
                        }}
                     >
                        {i + 1}
                     </div>
                  );
               })}
         </div>
      </Layout>
   );
};

export default CategoryAll;
export const getStaticProps = async () => {
   const resCategories = await API.get(endpoints["category_all"]);
   const categories = await resCategories.data.data;
   return { props: { categories } };
};
