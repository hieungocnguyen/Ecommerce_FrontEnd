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

export default function Home({ categories, salePosts }) {
   const router = useRouter();
   const searchInput = useRef(null);
   const { state, dispatch } = useContext(Store);
   const { userInfo } = state;
   return (
      <div>
         <Layout title="Home">
            <SearchBar categories={categories} />

            {/* <div className="text-center font-bold text-xl mb-3">Category</div> */}
            {/* <CategoryList categories={categories} /> */}
            <div className="my-8">
               <Advertise />
               <h1 className="text-center font-bold text-xl my-5">All Posts</h1>
               <div className="grid lg:grid-cols-5 grid-cols-2 gap-10">
                  {salePosts.map((i) => (
                     <ProductItem key={i.id} product={i} />
                  ))}
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
   const resAllProduct = await API.get(endpoints["get_all_salePost"]);
   const salePosts = await resAllProduct.data.data;
   return { props: { categories, salePosts } };
};
