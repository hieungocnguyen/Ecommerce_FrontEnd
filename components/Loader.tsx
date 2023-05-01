import React, { CSSProperties, useState } from "react";
import { SyncLoader } from "react-spinners";

const override: CSSProperties = {
   display: "block",
   margin: "0 auto",
   borderColor: "#525EC1",
};
const Loader = () => {
   return (
      <>
         <div className="fixed top-0 right-0 w-screen h-screen flex items-center justify-center bg-opacity-20 bg-gray-900 z-50">
            <SyncLoader
               color="#2065d1"
               loading={true}
               cssOverride={override}
               size={20}
               speedMultiplier={1}
               className=""
            />
         </div>
      </>
   );
};

export default Loader;
