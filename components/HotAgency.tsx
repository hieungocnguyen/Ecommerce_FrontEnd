import { useEffect, useState } from "react";
import API from "../API";

const HotAgency = () => {
   const [hotAgency, setHotAgency] = useState([]);
   useEffect(() => {
      const loadHotAagencies = async () => {
         const resHot = await API.get(
            "http://localhost:8080/ou-ecommerce/api/agency/top-agency/4"
         );
         setHotAgency(resHot.data.data);
      };
      loadHotAagencies();
   }, []);
   return (
      <div>
         <h1 className="text-center font-bold text-2xl my-5">Hot Agency</h1>
         <div>
            {hotAgency.map((h) => (
               <div key={h.id}>{h[0].name}</div>
            ))}
         </div>
      </div>
   );
};

export default HotAgency;
