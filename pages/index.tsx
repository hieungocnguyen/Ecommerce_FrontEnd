import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useRef } from "react";
import Advertise from "../components/Advertise";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import Layout from "../components/Layout/Layout";
import ProductItem from "../components/ProductItem";

export default function Home() {
   const router = useRouter();
   const searchInput = useRef(null);

   const mockProduct = [
      {
         id: 1,
         title: "Wireless Headphone",
         imageURL:
            "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8aGVhZHBob25lfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=1000&q=60",
         price: 5000,
      },
      {
         id: 2,
         title: "Wireless Headphone",
         imageURL:
            "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8aGVhZHBob25lfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=1000&q=60",
         price: 5000,
      },
      {
         id: 3,
         title: "Wireless Headphone",
         imageURL:
            "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8aGVhZHBob25lfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=1000&q=60",
         price: 5000,
      },
      {
         id: 4,
         title: "Wireless Headphone",
         imageURL:
            "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8aGVhZHBob25lfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=1000&q=60",
         price: 5000,
      },
      {
         id: 5,
         title: "Wireless Headphone",
         imageURL:
            "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8aGVhZHBob25lfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=1000&q=60",
         price: 5000,
      },
      {
         id: 6,
         title: "Wireless Headphone",
         imageURL:
            "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8aGVhZHBob25lfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=1000&q=60",
         price: 5000,
      },
   ];
   const search = (e: any) => {
      e.preventDefault();
      const query = searchInput.current.value;
      if (!query) {
         searchInput.current.focus();
      } else {
         router.push(`/search?input=${query}`);
      }
   };
   return (
      <div>
         <Layout title="Home">
            <div className="my-7">
               <form onSubmit={search}>
                  <input
                     type="text"
                     placeholder="Type something..."
                     ref={searchInput}
                     className="rounded-lg px-8 py-[4px] font-semibold outline-none mr-3 w-[40%] bg-light-primary dark:bg-dark-primary"
                  />
                  <button
                     type="submit"
                     className="bg-blue-main rounded-lg p-[5px] font-semibold text-white hover:opacity-80"
                  >
                     <span>Search</span>
                  </button>
               </form>
            </div>
            <div className="my-6">
               <Advertise />
               <h1 className="text-center font-bold text-xl my-5">
                  Featured Products
               </h1>
               <div className="grid lg:grid-cols-5 grid-cols-3 gap-10">
                  {mockProduct.map((i) => (
                     <ProductItem key={i.id} product={i} />
                  ))}
               </div>
            </div>
         </Layout>
      </div>
   );
}
