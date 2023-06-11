import React, { useContext, useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import API, { endpoints } from "../../../API";
import LayoutDashboardManager from "../../../components/Dashboard/LayoutDashboardManager";
import { Chart, ArcElement } from "chart.js";
import { Store } from "../../../utils/Store";
import ExportExcel from "../../../components/ExportExcel";
Chart.register(ArcElement);

const CategoryStatisticle = () => {
   const [category, setCategory] = useState([]);
   const [dataStatCategory, setDataStatCategory] = useState([]);
   const [respondCateStat, setRespondCateStat] = useState([]);
   const { state, dispatch } = useContext(Store);
   const { agencyInfo } = state;
   const [dataCSV, setDataCSV] = useState([]);
   const [total, setTotal] = useState(0);

   useEffect(() => {
      setCategory([]);
      setDataStatCategory([]);
      setDataCSV([]);
      const loadDataCate = async () => {
         try {
            let tempTotal = 0;
            const resDataCate = await API.get(
               endpoints["stat_category_by_agency"](agencyInfo.id)
            );
            resDataCate.data.data.map((c) => {
               setCategory((category) => [...category, c[0]]);
               setDataStatCategory((dataStatCategory) => [
                  ...dataStatCategory,
                  c[1],
               ]);
               setDataCSV((data) => [
                  ...data,
                  { Category: c[0], Number: c[1] },
               ]);
               tempTotal += c[1];
            });
            setTotal(tempTotal);
            setRespondCateStat(resDataCate.data.data);
         } catch (error) {
            console.log(error);
         }
      };
      loadDataCate();
   }, []);

   const dataCate = {
      labels: category,
      datasets: [
         {
            label: "Number post",
            data: dataStatCategory,
            borderColor: [
               "#ff9f1c",
               "#e71d36",
               "#662e9b",
               "#00509d",
               "#FF0060",
               "#884A39",
            ],
            backgroundColor: [
               "#ff9f1c",
               "#e71d36",
               "#662e9b",
               "#00509d",
               "#FF0060",
               "#884A39",
            ],
            borderWidth: 2,
         },
      ],
   };

   return (
      <LayoutDashboardManager title="Category Stat">
         <div className="w-[90%] mx-auto my-10">
            <div className="flex justify-between items-center my-4">
               <div className="font-semibold text-2xl">
                  Statistical category
               </div>
               <ExportExcel csvData={dataCSV} fileName={`Stat category`} />
            </div>
            <div className="grid grid-cols-12 gap-4">
               <div className="col-span-6 dark:bg-dark-primary bg-light-primary rounded-lg p-8">
                  <Doughnut data={dataCate} />
               </div>
               <div className="col-span-6 dark:bg-dark-primary bg-light-primary rounded-lg p-8">
                  <div className="text-left font-medium ">
                     <table className="w-full">
                        <tr className="border-b-2 border-dark-spot dark:bg-light-primary  text-lg">
                           <td className="border-r-2 border-dark-spot dark:bg-light-primary">
                              Category
                           </td>
                           <td className="text-center">Number of post</td>
                           <td className="text-center">Ratio</td>
                        </tr>
                        {respondCateStat.map((item) => (
                           <tr
                              key={item.id}
                              className="border-b-2 border-dark-spot dark:bg-light-primary"
                           >
                              <td className="border-r-2 border-dark-spot dark:bg-light-primary">
                                 {item[0]}
                              </td>
                              <td className="text-center border-r-2 border-dark-spot dark:bg-light-primary">
                                 {item[1]}
                              </td>
                              <td className="text-center">
                                 {((item[1] / total) * 100).toFixed(2)}%
                              </td>
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

export default CategoryStatisticle;
