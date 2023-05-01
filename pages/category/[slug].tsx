import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import ProductItem from "../../components/ProductItem";
import SearchBar from "../../components/SearchBar";
import axios from "axios";
import API, { endpoints } from "../../API";
import { Slider } from "@mui/material";
import Image from "next/image";
import emptyBox from "../../public/empty-box.png";
import toast from "react-hot-toast";

function valuetext(value: number) {
   return `${value}°C`;
}
const CategoryPage = ({ categories, category }) => {
   const [salePosts, setSalePosts] = useState([]);
   const router = useRouter();
   const [numberPage, setNumberPage] = useState(1);
   const [totalPage, setTotalPage] = useState(1);
   const kw = router.query.input;
   const [datePost, setDatePost] = useState(["2020-06-01", "2023-06-01"]);
   const [value, setValue] = useState<number[]>([100000, 500000]);
   const { slug } = router.query;

   const loadPosts = async () => {
      try {
         const resPosts = await API.post(endpoints["search_salePost"], {
            categoryID: Number(slug),
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
   }, [slug, numberPage]);

   const handleSubmitFilter = async (e) => {
      e.preventDefault();
      try {
         const resPosts = await API.post(endpoints["search_salePost"], {
            kw: "",
            page: 1,
            category: Number(slug),
            fromDate: new Date(datePost[0]).toLocaleDateString("en-GB"),
            fromPrice: value[0],
            toDate: new Date(datePost[1]).toLocaleDateString("en-GB"),
            toPrice: value[1],
         });
         setSalePosts(resPosts.data.data.listResult);
      } catch (error) {
         console.log(error);
         toast.error("Something wrong, please try again!");
      }
   };

   const handleChange = (event: Event, newValue: number | number[]) => {
      setValue(newValue as number[]);
   };

   return (
      <Layout title="Search Page">
         <SearchBar categories={categories} setNumberPage={setNumberPage} />
         <div className="text-3xl my-8 font-semibold">{category.name}</div>
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
                     max={1000000}
                     min={0}
                     sx={{
                        color: "#525EC1",
                     }}
                  />
               </div>
               <div className="flex justify-center">
                  <button
                     className="p-4 bg-primary-color text-white rounded-lg font-semibold my-4 hover:opacity-80"
                     type="submit"
                  >
                     Apply filter
                  </button>
               </div>
            </form>
            {/* posts side */}
            {salePosts.length > 0 ? (
               <div className="col-span-6 grid grid-cols-3 gap-8 mb-8">
                  {salePosts.map((post) => (
                     <ProductItem
                        key={post.id}
                        product={post}
                        inCompare={false}
                     />
                  ))}
               </div>
            ) : (
               <div className="col-span-6">
                  <div className="relative overflow-hidden aspect-square w-1/4 mx-auto">
                     <Image
                        src={emptyBox}
                        alt="empty"
                        layout="fill"
                        className="object-cover"
                     />
                  </div>
               </div>
            )}
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

export default CategoryPage;
export const getServerSideProps = async (context) => {
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
