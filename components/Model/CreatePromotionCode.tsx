import { useState } from "react";
import API, { endpoints } from "../../API";
import { toast } from "react-hot-toast";
import { BiRightArrowAlt } from "react-icons/bi";

const CreatePromotionCode = ({ setIsModelCreateCode, setLoading, program }) => {
   const [endUsableDate, setEndUsableDate] = useState("");
   const [prefix, setPrefix] = useState("");
   const [totalRelease, setTotalRelease] = useState(0);

   const handleSubmitCreate = async (e) => {
      e.preventDefault();
      try {
         if (totalRelease == 0) {
            toast.error("Total release must greater than 0   ");
            return;
         }
         setLoading(true);
         const { data } = await API.post(
            endpoints["generate_promotion_code"](program.id),
            {
               prefix: prefix,
               totalRelease: totalRelease,
               endUsableDate: formatDate(new Date(endUsableDate)),
            }
         );
         if (data.code == "400") {
            toast.error(data.message);
         } else {
            e.target.reset();
            setEndUsableDate("");
            setTotalRelease(0);
            setPrefix("");
            setIsModelCreateCode(false);
            toast.success("Create sucessful!");
         }
         setLoading(false);
      } catch (error) {
         console.log(error);
         setLoading(false);
         toast.error("Something wrong");
      }
   };

   function padTo2Digits(num) {
      return num.toString().padStart(2, "0");
   }
   function formatDate(date) {
      return (
         [
            padTo2Digits(date.getDate()),
            padTo2Digits(date.getMonth() + 1),
            date.getFullYear(),
         ].join("/") +
         " " +
         [
            padTo2Digits(date.getHours()),
            padTo2Digits(date.getMinutes()),
            padTo2Digits(date.getSeconds()),
         ].join(":")
      );
   }

   return (
      <div className="dark:bg-neutral-800 bg-light-primary rounded-lg w-full h-full relative p-6 shadow-lg border-2 border-primary-color">
         <div className="flex justify-between items-center mb-4">
            <div className="font-semibold text-lg">Create Code</div>
            <div
               className="py-2 px-4 text-primary-color hover:bg-primary-color rounded-lg hover:text-white font-semibold bg-light-bg transition-all cursor-pointer border-2 border-primary-color"
               onClick={() => setIsModelCreateCode(false)}
            >
               Close
            </div>
         </div>
         <form
            onSubmit={handleSubmitCreate}
            className="flex flex-col space-y-2"
         >
            <div className="flex flex-col items-start">
               <label htmlFor="prefix" className="font-medium text-sm">
                  Prefix Code
               </label>
               <input
                  type="text"
                  id="prefix"
                  required
                  value={prefix}
                  className="p-3 w-full rounded-lg"
                  onChange={(e) => setPrefix(e.target.value.toUpperCase())}
               />
            </div>
            <div className="flex flex-col items-start">
               <label htmlFor="totalRelease" className="font-medium text-sm">
                  Total Release
               </label>
               <input
                  type="number"
                  name=""
                  id="totalRelease"
                  min={1}
                  required
                  className="p-3 rounded-lg w-full"
                  defaultValue={totalRelease}
                  onChange={(e) => setTotalRelease(Number(e.target.value))}
               />
            </div>
            <div className="flex flex-col items-start">
               <label htmlFor="endUsableDate" className="font-medium text-sm">
                  End usable
               </label>
               <input
                  type="datetime-local"
                  name=""
                  id="endUsableDate"
                  required
                  className="p-3 rounded-lg w-full"
                  defaultValue={endUsableDate}
                  onChange={(e) => setEndUsableDate(e.target.value)}
               />
            </div>
            <div className="flex gap-1 items-center text-xs font-medium">
               <div className="">Program duration: </div>
               <div className="">
                  {new Date(program.beginUsable).toLocaleDateString("en-GB")}
               </div>
               <BiRightArrowAlt className="text-xl" />
               <div className="">
                  {new Date(program.endUsable).toLocaleDateString("en-GB")}
               </div>
            </div>
            <button
               type="submit"
               className="mt-2 px-4 py-3 bg-primary-color rounded-lg text-white font-semibold"
            >
               Create
            </button>
         </form>
      </div>
   );
};

export default CreatePromotionCode;
