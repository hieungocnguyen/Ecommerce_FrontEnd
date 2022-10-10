/* eslint-disable @next/next/no-img-element */
import React from "react";
import Layout from "../../components/Layout/Layout";

const ProductPage = () => {
   return (
      <div>
         <Layout title="Detail">
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-8 m-8 ">
               <div className="overflow-hidden aspect-square">
                  <img
                     src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8aGVhZHBob25lfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=1000&q=60"
                     alt="tai nghe"
                     className="w-full h-full object-cover rounded-lg"
                  />
               </div>
               <div>
                  <div className="font-semibold text-3xl text-left">
                     Tai nghe SONY
                  </div>
                  {/* color options */}
                  <div className=" mt-10 flex  justify-between">
                     <div className="font-medium text-xl">Color</div>
                     <div className="flex gap-4">
                        <div className="p-2 border-[2px] border-blue-main">
                           Black
                        </div>
                        <div className="p-2 border-[2px] border-blue-main">
                           {" "}
                           White
                        </div>
                     </div>
                  </div>
                  <div className="grid ">
                     <div className="bg-blue-main w-full h-16 rounded-lg  flex items-center justify-center font-semibold text-xl mt-10 hover:opacity-80 cursor-pointer">
                        Add to basket
                     </div>
                  </div>
               </div>
            </div>
         </Layout>
      </div>
   );
};

export default ProductPage;
