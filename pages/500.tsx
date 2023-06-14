import React from "react";
import Layout from "../components/Layout/Layout";
import Image from "next/image";
import { useRouter } from "next/router";

const ServerError = () => {
   const router = useRouter();
   return (
      <Layout title="500 Error">
         <div className="relative overflow-hidden w-1/3 aspect-square mx-auto mt-8">
            <Image
               src="https://res.cloudinary.com/ngnohieu/image/upload/v1686739645/12123Asset_1_hzpcxw.png"
               alt="500"
               layout="fill"
               className="object-cover"
            />
         </div>
         <button
            className="text-center py-3 px-6 my-6 rounded-lg bg-primary-color text-white font-semibold hover:shadow-lg hover:shadow-primary-color hover:brightness-95"
            onClick={() => router.push("/")}
         >
            Back to homepage
         </button>
      </Layout>
   );
};

export default ServerError;
