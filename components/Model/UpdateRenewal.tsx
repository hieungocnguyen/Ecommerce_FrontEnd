import { useEffect, useState } from "react";
import API, { endpoints } from "../../API";
import toast from "react-hot-toast";

const UpdateRenewal = ({ pack, setOpenmodel }) => {
   const [usualPrice, setusualPrice] = useState("");
   const [discountPrice, setdiscountPrice] = useState("");

   const handleSubmitUpdate = async (e) => {
      e.preventDefault();
      try {
         const res = await API.patch(endpoints["update_package"](pack.id), {
            usualPrice: Number(usualPrice.replace(/[^a-zA-Z0-9 ]/g, "")),
            discountPrice: Number(discountPrice.replace(/[^a-zA-Z0-9 ]/g, "")),
         });
         if (res.data.code == "200") {
            setOpenmodel(false);
            toast.success("Update successful");
         }
      } catch (error) {
         console.log(error);
         if (error.response.data.data?.usualPrice) {
            toast.error(`Usual Price: ${error.response.data.data.usualPrice}`);
         }
         if (error.response.data.data?.discountPrice) {
            toast.error(
               `Discount Price: ${error.response.data.data.discountPrice}`
            );
         }
      }
   };

   useEffect(() => {
      if (pack.id) {
         setusualPrice(currencyFormat(pack.usualPrice.toString()));
         setdiscountPrice(currencyFormat(pack.discountPrice.toString()));
      }
   }, [pack]);

   const currencyFormat = (text) => {
      let value = text;
      value = value.replace(/\D/g, "");
      value = value.replace(/(\d)(\d{3})$/, "$1.$2");
      value = value.replace(/(?=(\d{3})+(\D))\B/g, ".");
      text = value;
      return text;
   };

   return (
      <div className="dark:bg-neutral-800 bg-light-primary rounded-lg w-full h-full relative p-6 shadow-lg border-2 border-primary-color">
         <div className="flex justify-between items-center mb-4">
            <div className="font-semibold text-lg">Update package</div>
            <div
               className="py-2 px-4 text-primary-color hover:bg-primary-color rounded-lg hover:text-white font-semibold bg-light-bg transition-all cursor-pointer border-2 border-primary-color"
               onClick={() => setOpenmodel(false)}
            >
               Close
            </div>
         </div>
         <form
            onSubmit={handleSubmitUpdate}
            className="flex flex-col space-y-2"
         >
            <div className="flex flex-col items-start">
               <label htmlFor="usualPrice" className="font-medium text-sm">
                  Usual Price (VND)
               </label>
               <input
                  type="text"
                  id="usualPrice"
                  required
                  value={usualPrice}
                  className="p-3 w-full rounded-lg"
                  onChange={(e) =>
                     setusualPrice(currencyFormat(e.target.value))
                  }
               />
            </div>
            <div className="flex flex-col items-start">
               <label htmlFor="discountPrice" className="font-medium text-sm">
                  Discount Price (VND)
               </label>
               <input
                  type="text"
                  name=""
                  id="discountPrice"
                  required
                  className="p-3 rounded-lg w-full"
                  value={discountPrice}
                  onChange={(e) =>
                     setdiscountPrice(currencyFormat(e.target.value))
                  }
               />
            </div>
            <button
               type="submit"
               className="mt-2 px-4 py-3 bg-primary-color rounded-lg text-white font-semibold"
            >
               Update
            </button>
         </form>
      </div>
   );
};

export default UpdateRenewal;
