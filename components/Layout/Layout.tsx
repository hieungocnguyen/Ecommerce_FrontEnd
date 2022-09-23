import Head from "next/head";
import React from "react";
import Footer from "./Footer";
import Header from "./Header";

const Layout = ({ title, children }) => {
   return (
      <div>
         <Head>
            <title>{title ? title + " - Mallity" : "Mallity"}</title>
            <meta name="description" content="Ecommerce Website" />
         </Head>
         <header>
            <Header />
         </header>
         <main className="w-[90%] mx-auto text-center">{children}</main>
         <footer>
            <Footer />
         </footer>
      </div>
   );
};

export default Layout;
