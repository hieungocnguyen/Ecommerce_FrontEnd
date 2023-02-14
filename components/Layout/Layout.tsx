import Head from "next/head";
import React, { useState } from "react";
import { BiGitCompare } from "react-icons/bi";
import CompareProduct from "../CompareProduct";
import Footer from "./Footer";
import Header from "./Header";

const Layout = ({ title, children }) => {
   const [openCompare, setOpenCompare] = useState(false);
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
         </div>
         <CompareProduct openCompare={openCompare} />
         <footer>
            <Footer />
         </footer>
      </div>
   );
};

export default Layout;
