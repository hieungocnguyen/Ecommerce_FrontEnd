import { styled, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import API, { endpoints } from "../API";

const EditItem = ({ item, setIsOPenModel }) => {
   const [values, setValues] = useState({
      avatar: "",
      inventory: item.inventory,
      name: item.name,
      unitPrice: item.unitPrice,
   });
   const handleChange = (event) => {
      setValues({
         ...values,
         [event.target.name]: event.target.value,
      });
   };
   const handleChangeSubmit = async (e) => {
      e.preventDefault();
      const resSave = await API.put(endpoints["item"](item.id), {
         inventory: item.inventory,
         name: item.name,
         unitPrice: item.unitPrice,
      });
      setIsOPenModel(false);
   };
   useEffect(() => {
      console.log(item.id);
      setValues({
         avatar: "",
         inventory: item.inventory,
         name: item.name,
         unitPrice: item.unitPrice,
      });
   }, []);
   return (
      <div className="fixed top-0 right-0 w-screen h-screen flex items-center justify-center z-10">
         <div className="bg-dark-primary p-10 flex flex-col justify-center items-center">
            <form onSubmit={handleChangeSubmit}>
               <div className="text-center my-4 text-lg font-semibold">
                  Edit item
               </div>
               <div className="">
                  <input
                     type="text"
                     defaultValue={values.name}
                     className="p-4 my-2 rounded-lg"
                  />
               </div>
               <div>
                  <input
                     type="text"
                     defaultValue={values.inventory}
                     className="p-4 my-2 rounded-lg"
                  />
               </div>
               <div>
                  <input
                     type="text"
                     defaultValue={values.unitPrice}
                     className="p-4 my-2 rounded-lg"
                  />
               </div>
               <div className="flex justify-center my-4 ">
                  <button
                     type="submit"
                     className="bg-blue-main p-4 hover:bg-opacity-80 rounded-lg text-white"
                  >
                     Save
                  </button>
               </div>
            </form>
            <button onClick={() => setIsOPenModel(false)}>Close</button>
         </div>
      </div>
   );
};

export default EditItem;
