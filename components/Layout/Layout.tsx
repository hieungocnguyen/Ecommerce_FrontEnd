import Head from "next/head";
import React, { useEffect, useState } from "react";
import { BiGitCompare } from "react-icons/bi";
import CompareProduct from "../CompareProduct";
import Footer from "./Footer";
import Header from "./Header";
import Cookies from "js-cookie";

const Layout = ({ title, children }) => {
   const [openCompare, setOpenCompare] = useState(false);
   const [lengthCompare, setLengthCompare] = useState(0);
   useEffect(() => {
      let length = Cookies.get("compare")
         ? JSON.parse(Cookies.get("compare")).length
         : 0;
      setLengthCompare(length);
   }, [openCompare]);

   return (
      <div>
         <Head>
            <title>{title ? title + " - Mallity" : "Mallity"}</title>
            <meta name="description" content="Ecommerce Website" />
         </Head>
         <header>
            <Header />
         </header>
         <main className="w-[90%] mx-auto text-center min-h-[calc(100vh-60px-178px)]">
            {children}
         </main>
         <div
            className="fixed bottom-10 right-10 w-12 h-12 z-20 rounded-full bg-blue-main flex justify-center items-center text-xl cursor-pointer text-white "
            onClick={() => setOpenCompare(!openCompare)}
         >
            <BiGitCompare />
            <div
               className={`w-3 h-3 bg-red-600 absolute top-0 right-0 rounded-full ${
                  lengthCompare === 0 ? "hidden" : ""
               }`}
            ></div>
         </div>
         <CompareProduct openCompare={openCompare} />
         <footer>
            <Footer />
         </footer>
      </div>
   );
};

export default Layout;
