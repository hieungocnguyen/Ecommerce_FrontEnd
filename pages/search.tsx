import { Slider, TextField } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import API, { endpoints } from "../API";
import Layout from "../components/Layout/Layout";
import ProductItem from "../components/ProductItem";
import SearchBar from "../components/SearchBar";

function valuetext(value: number) {
   return `${value}VND`;
}
const Search = ({ categories }) => {
   const [salePosts, setSalePosts] = useState([]);
   const router = useRouter();
   const [page, setPage] = useState(0);
   const kw = router.query.input;
   const [datePost, setDatePost] = useState(["2017-06-01", "2023-06-01"]);
   const [value, setValue] = useState<number[]>([100000, 5000000]);
   const [numberPage, setnumberPage] = useState(1);
   const [totalPage, setTotalPage] = useState(1);
   useEffect(() => {
      const loadPosts = async () => {
         const resPosts = await API.post(endpoints["search_salePost"], {
            kw: router.query.input,
            page: numberPage,
         });
         setSalePosts(resPosts.data.data.listResult);
         setTotalPage(resPosts.data.data.totalPage);
      };
      loadPosts();
   }, [router.query.input, numberPage]);

   const handleSubmitFilter = async (e) => {
      e.preventDefault();
      const resPosts = await API.post(endpoints["search_salePost"], {
         kw: router.query.input,
         page: numberPage,
         fromDate: new Date(datePost[0]).toLocaleDateString("en-US"),
         fromPrice: value[0],
         toDate: new Date(datePost[1]).toLocaleDateString("en-US"),
         toPrice: value[1],
      });
      setSalePosts(resPosts.data.data.listResult);
      console.log(resPosts.data.data.listResult);
   };

   const handleChange = (event: Event, newValue: number | number[]) => {
      setValue(newValue as number[]);
   };
   return (
      <Layout title="Search Page">
         <SearchBar categories={categories} />
         {router.query.input ? (
            <div className="text-2xl my-8 italic">
               Result for &quot;{router.query.input}&quot;
            </div>
         ) : (
            <div> </div>
         )}
         <div className="grid grid-cols-8 gap-8">
            {/* filter side */}
            <form
               onSubmit={handleSubmitFilter}
               className="col-span-2 dark:bg-dark-primary bg-light-primary rounded-lg text-left p-6 h-fit"
            >
               <div className="flex justify-between mb-4 items-center">
                  <label htmlFor="fromDate" className="font-semibold">
                     From Date:
                  </label>
                  <input
                     type="date"
                     id="fromDate"
                     className="p-2"
                     defaultValue={datePost[0]}
                     onChange={(e) => {
                        setDatePost([e.target.value, datePost[1]]);
                     }}
                  />
               </div>
               <div className="flex justify-between mb-4 items-center">
                  <label htmlFor="toDate" className="font-semibold">
                     To Date:
                  </label>
                  <input
                     type="date"
                     id="toDate"
                     className="p-2"
                     defaultValue={datePost[1]}
                     onChange={(e) => {
                        setDatePost([datePost[0], e.target.value]);
                     }}
                  />
               </div>
               <div className="font-semibold mb-4">Price:</div>
               <div className="w-full">
                  <Slider
                     getAriaLabel={() => "Temperature range"}
                     value={value}
                     onChange={handleChange}
                     valueLabelDisplay="auto"
                     getAriaValueText={valuetext}
                     step={200000}
                     // marks
                     max={10000000}
                     min={100000}
                     sx={{
                        color: "#525EC1",
                     }}
                  />
               </div>
               <div className="flex justify-center">
                  <button
                     className="p-4 bg-blue-main text-white rounded-lg font-semibold my-4 hover:opacity-80"
                     type="submit"
                  >
                     Apply filter
                  </button>
               </div>
            </form>
            {/* posts side */}
            <div className="col-span-6 grid grid-cols-3 gap-8">
               {salePosts.map((post) => (
                  <ProductItem key={post.id} product={post} inCompare={false} />
               ))}
            </div>
         </div>
         <div
            className="flex gap-4
                justify-center my-8"
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
      </Layout>
   );
};

export default Search;
export const getStaticProps = async () => {
   const resCategories = await axios.get(
      "http://localhost:8080/ou-ecommerce/api/category/all"
   );
   const categories = await resCategories.data.data;
   const resAllProduct = await API.get(endpoints["get_all_salePost"]);
   const salePosts = await resAllProduct.data.data;
   return { props: { categories } };
};
