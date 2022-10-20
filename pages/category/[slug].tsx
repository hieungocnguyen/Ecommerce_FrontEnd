import { useRouter } from "next/router";
import React from "react";
import Layout from "../../components/Layout/Layout";
import ProductItem from "../../components/ProductItem";
import SearchBar from "../../components/SearchBar";
import { dataProduct } from "../../mockproduct.js";
import axios from "axios";

const CategoryPage = ({ categories, category }) => {
   const router = useRouter();
   const { slug } = router.query;

   return (
      <div>
         <Layout title="Category Page">
            <SearchBar categories={categories} />
            <div className="text-center font-bold text-xl mb-3 capitalize">
               {category.name}
            </div>
            <div className="grid grid-cols-12 gap-10 ">
               {/* filter section */}
               <div className="  lg:col-span-3 sm:col-span-6 px-4 bg-dark-primary rounded-lg h-fit ">
                  <h2 className="font-bold pt-4 pb-4 text-lg">Filter</h2>
                  <div className=" text-left pl-4">
                     <div className="whitespace-nowrap gap-2 cursor-pointer hover:text-blue-main my-2">
                        Sort Ascending
                     </div>
                     <div className="whitespace-nowrap gap-2 cursor-pointer hover:text-blue-main my-2">
                        Sort Descending
                     </div>
                  </div>
               </div>
               <div className="lg:col-span-9 sm:col-span-6">
                  <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-10">
                     {dataProduct.map((i) => (
                        <ProductItem
                           key={i.id}
                           product={i}
                           addToCartHandler={undefined}
                        />
                     ))}
                  </div>
               </div>
            </div>
            {/* paging */}
            <div className="flex justify-center items-center gap-4 my-8">
               <div className="border-blue-main border-[2px] rounded-lg h-9 w-9 font-semibold flex items-center justify-center hover:bg-blue-main cursor-pointer">
                  1
               </div>
               <div className="border-blue-main border-[2px]  rounded-lg h-9 w-9 font-semibold flex items-center justify-center hover:bg-blue-main cursor-pointer ">
                  1
               </div>
               <div className="border-blue-main border-[2px]  rounded-lg h-9 w-9 font-semibold flex items-center justify-center hover:bg-blue-main cursor-pointer ">
                  1
               </div>
               <div className="border-blue-main border-[2px]  rounded-lg h-9 w-9 font-semibold flex items-center justify-center hover:bg-blue-main cursor-pointer ">
                  1
               </div>
            </div>
         </Layout>
      </div>
   );
};

export default CategoryPage;
export const getStaticProps = async (context) => {
   const res = await axios.get(
      "http://localhost:8080/ou-ecommerce/api/category/all"
   );
   const categories = await res.data.data;

   // request category detail
   const id = context.params.slug;
   const resCategory = await axios.get(
      "http://localhost:8080/ou-ecommerce/api/category/" + id
   );
   const category = await resCategory.data.data;
   return { props: { categories, category } };
};

export async function getStaticPaths() {
   if (process.env.SKIP_BUILD_STATIC_GENERATION) {
      return {
         paths: [],
         fallback: "blocking",
      };
   }
   const res = await axios.get(
      "http://localhost:8080/ou-ecommerce/api/category/all"
   );
   const category = await res.data.data;
   const paths = category.map((cate) => ({
      params: { slug: cate.id.toString() },
   }));
   return {
      paths,
      fallback: false, // can also be true or 'blocking'
   };
}
