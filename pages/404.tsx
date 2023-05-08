import React from "react";
import Layout from "../components/Layout/Layout";
import Image from "next/image";
import Image404 from "../public/404.png";

const NotFound = () => {
   return (
      <Layout title={404}>
         <div className="relative overflow-hidden w-1/3 mx-auto mt-8">
            <Image src={Image404} alt="404" className="object-cover" />
         </div>
      </Layout>
   );
};

export default NotFound;
