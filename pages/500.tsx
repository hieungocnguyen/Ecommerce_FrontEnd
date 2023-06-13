import React from "react";
import Layout from "../components/Layout/Layout";
import Image from "next/image";

const ServerError = () => {
   return (
      <Layout title={500}>
         <div>500</div>
         {/* <div className="relative overflow-hidden w-1/3 mx-auto mt-8">
            <Image src={Image404} alt="404" className="object-cover" />
         </div> */}
      </Layout>
   );
};

export default ServerError;
