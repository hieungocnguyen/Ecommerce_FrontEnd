import React, { useContext, useEffect, useState } from "react";
import LayoutDashboardManager from "../../../components/Dashboard/LayoutDashboardManager";
import { Bar, Chart, PolarArea } from "react-chartjs-2";
import API, { endpoints } from "../../../API";
import { Store } from "../../../utils/Store";
import {
   Chart as ChartJS,
   CategoryScale,
   LinearScale,
   BarElement,
   Title,
   Tooltip,
   Legend,
} from "chart.js";
import ExportExcel from "../../../components/ExportExcel";
ChartJS.register(
   CategoryScale,
   LinearScale,
   BarElement,
   Title,
   Tooltip,
   Legend
);

const options = {
   responsive: true,
   plugins: {
      legend: {
         position: "top" as const,
      },
   },
};

const BestSeller = () => {
   const [items, setItems] = useState<any>([]);
   const [dataStatItem, setDataStatItem] = useState([]);
   const { state, dispatch } = useContext(Store);
   const { agencyInfo } = state;
   const [numberTop, setNumberTop] = useState(4);
   const [dataTable, setDataTable] = useState<any>([]);
   const [dataCSV, setDataCSV] = useState([]);

   const fetchData = async () => {
      try {
         setItems([]);
         setDataStatItem([]);
         setDataCSV([]);
         const res = await API.get(
            endpoints["item_best_seller_by_agency"](numberTop, agencyInfo.id)
         );
         setDataTable(res.data.data);
         res.data.data.map((item) => {
            setItems((items) => [...items, item[2]]);
            setDataStatItem((dataStatItem) => [...dataStatItem, item[4]]);
            setDataCSV((data) => [
               ...data,
               {
                  Items: item[2],
                  Sold: `${item[4]}`,
               },
            ]);
         });
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      fetchData();
   }, [agencyInfo]);

   const data = {
      labels: items,
      datasets: [
         {
            label: "Best seller",
            data: dataStatItem,
            borderColor: ["#ff9f1c", "#e71d36", "#662e9b", "#00509d"],
            backgroundColor: ["#ff9f1c", "#e71d36", "#662e9b", "#00509d"],
            borderWidth: 2,
         },
      ],
   };

   return (
      <LayoutDashboardManager title="Best Seller">
         <div className=" mx-auto my-10">
            <div className="flex justify-between items-center my-4">
               <div className="font-semibold text-2xl">Best Seller Items</div>
            </div>
            <div className="grid grid-cols-12 gap-4">
               <div className="col-span-8 dark:bg-dark-primary bg-light-primary rounded-lg p-8">
                  <Bar options={options} data={data} />
               </div>
               <div className="col-span-4 dark:bg-dark-primary bg-light-primary rounded-lg p-8">
                  <div className="flex justify-around gap-4 mb-4">
                     <input
                        type="number"
                        value={numberTop}
                        onChange={(e) => setNumberTop(Number(e.target.value))}
                        className="w-20 rounded-lg p-3"
                     />
                     <div
                        className="p-3 bg-primary-color rounded-lg cursor-pointer text-white font-semibold"
                        onClick={() => fetchData()}
                     >
                        Apply
                     </div>
                     <ExportExcel csvData={dataCSV} fileName={`Best seller`} />
                  </div>
                  <div className="text-center font-medium overflow-auto">
                     <table className="w-full">
                        <tr className="border-b-2 border-dark-primary">
                           <td className="border-r-2 border-dark-primary">
                              Item
                           </td>
                           <td>Sold</td>
                        </tr>
                        {dataTable.map((item) => (
                           <tr
                              key={item.id}
                              className="border-b-2 border-dark-primary"
                           >
                              <td className="border-r-2 border-dark-primary">
                                 {item[2]}
                              </td>
                              <td className="">{item[4]}</td>
                           </tr>
                        ))}
                     </table>
                  </div>
               </div>
            </div>
         </div>
      </LayoutDashboardManager>
   );
};

export default BestSeller;
