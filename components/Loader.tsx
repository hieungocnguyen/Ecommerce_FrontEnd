import React, { CSSProperties, useState } from "react";
import PuffLoader from "react-spinners/PuffLoader";

const override: CSSProperties = {
   display: "block",
   margin: "0 auto",
   borderColor: "#525EC1",
};
const Loader = () => {
   let [color, setColor] = useState("#525EC1");
   return (
      <>
         <div className="fixed top-0 right-0 w-screen h-screen flex items-center justify-center bg-opacity-20 bg-gray-900 z-10">
            <PuffLoader
               color={color}
               loading={true}
               cssOverride={override}
               size={100}
               speedMultiplier={1}
               className=""
            />
         </div>
      </>
   );
};

export default Loader;
