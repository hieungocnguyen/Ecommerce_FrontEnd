import React from "react";
import Layout from "../components/Layout/Layout";
import Image from "next/image";
import Image403 from "../public/403.png";

const ForBidden = () => {
   return (
      <Layout title={403}>
         <div className="relative overflow-hidden w-1/3 mx-auto mt-8">
            <Image src={Image403} alt="404" className="object-cover" />
         </div>
      </Layout>
   );
};

export default ForBidden;
