import Head from "next/head";
import React, { useContext, useEffect, useState } from "react";
import { BiGitCompare, BiX } from "react-icons/bi";
import CompareProduct from "../CompareProduct";
import Footer from "./Footer";
import Header from "./Header";
import Cookies from "js-cookie";
import { Store } from "../../utils/Store";
import dynamic from "next/dynamic";

const Layout = ({ title, children }) => {
   const [openCompare, setOpenCompare] = useState(false);
   const [lengthCompare, setLengthCompare] = useState(0);
   const { state, dispatch } = useContext(Store);
   const { compare } = state;

   useEffect(() => {
      setLengthCompare(
         Cookies.get("compare") ? JSON.parse(Cookies.get("compare")).length : 0
      );
   }, [compare]);

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
            className={`fixed bottom-10 right-10 w-14 h-14 z-20 rounded-full bg-blue-main flex justify-center items-center text-2xl cursor-pointer text-white transition-all ease-out ${
               lengthCompare === 0 && !openCompare ? "scale-0" : "scale-100"
            } ${openCompare ? "scale-125" : ""}`}
            onClick={() => setOpenCompare(!openCompare)}
         >
            {openCompare ? <BiX className="text-3xl" /> : <BiGitCompare />}
            <div
               className={`w-4 h-4 bg-red-600 absolute top-0 right-0.5 rounded-full transition-all ${
                  lengthCompare === 0 ? "scale-0" : "scale-100"
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

// export default Layout;
export default dynamic(() => Promise.resolve(Layout), { ssr: false });
