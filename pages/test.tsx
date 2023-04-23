import React, { useState } from "react";

const Test = () => {
   const [input, setInput] = useState();

   const currencyFormat = (e) => {
      let value = e.target.value;
      value = value.replace(/\D/g, "");
      value = value.replace(/(\d)(\d{3})$/, "$1.$2");
      value = value.replace(/(?=(\d{3})+(\D))\B/g, ".");
      e.target.value = value;
      return e;
   };

   return (
      <div>
         <input
            type="text"
            value={input}
            onChange={(e) => {
               setInput(currencyFormat(e).target.value);
               console.log(
                  currencyFormat(e).target.value.replace(/[^a-zA-Z0-9 ]/g, "")
               );
            }}
         />
      </div>
   );
};

export default Test;
