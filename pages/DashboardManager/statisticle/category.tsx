import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import API, { endpoints } from "../../../API";
import LayoutDashboardManager from "../../../components/Dashboard/LayoutDashboardManager";
import { Chart, ArcElement } from "chart.js";
Chart.register(ArcElement);

const CategoryStatisticle = () => {
   const [category, setCategory] = useState([]);
   const [dataStatCategory, setDataStatCategory] = useState([]);
   const [respondCateStat, setRespondCateStat] = useState([]);
   useEffect(() => {
      setCategory([]);
      setDataStatCategory([]);
      const loadDataCate = async () => {
         const resDataCate = await API.get(endpoints["stat_post_category"]);
         resDataCate.data.data.map((c) => {
            setCategory((category) => [...category, c[0]]);
            setDataStatCategory((dataStatCategory) => [
               ...dataStatCategory,
               c[1],
            ]);
         });
         setRespondCateStat(resDataCate.data.data);
      };
      loadDataCate();
   }, []);
   const dataCate = {
      labels: category,
      datasets: [
         {
            label: "Number post",
            data: dataStatCategory,
            backgroundColor: [
               "rgba(255, 99, 132, 0.2)",
               "rgba(54, 162, 235, 0.2)",
               "rgba(255, 206, 86, 0.2)",
               "rgba(75, 192, 192, 0.2)",
               "rgba(153, 102, 255, 0.2)",
               "rgba(255, 159, 64, 0.2)",
               "rgba(255, 159, 64, 0.2)",
               "rgba(75, 192, 192, 0.2)",
               "rgba(153, 102, 255, 0.2)",
               "rgba(255, 159, 150, 0.2)",
               "rgba(14, 159, 64, 0.2)",
               "rgba(153, 102, 255, 0.2)",
               "rgba(255, 159, 150, 0.2)",
               "rgba(14, 159, 64, 0.2)",
            ],
            borderColor: [
               "rgba(255, 99, 132, 1)",
               "rgba(54, 162, 235, 1)",
               "rgba(255, 206, 86, 1)",
               "rgba(75, 192, 192, 1)",
               "rgba(153, 102, 255, 1)",
               "rgba(255, 159, 64, 1)",
               "rgba(255, 159, 64, 1)",
               "rgba(75, 192, 192, 1)",
               "rgba(153, 102, 255, 1)",
               "rgba(255, 159, 150, 1)",
               "rgba(14, 159, 64, 1)",
               "rgba(153, 102, 255, 1)",
               "rgba(255, 159, 150, 1)",
               "rgba(14, 159, 64, 1)",
            ],
            borderWidth: 2,
         },
      ],
   };

   return (
      <LayoutDashboardManager>
         <div className="w-[90%] mx-auto my-10">
            <div className="font-semibold text-2xl my-10">
               Category statistical
            </div>
            <div className="grid grid-cols-4 gap-4">
               <div className="col-span-2 dark:bg-dark-primary bg-light-primary rounded-lg p-8">
                  <Doughnut data={dataCate} />
               </div>
               <div className="col-span-2 dark:bg-dark-primary bg-light-primary rounded-lg p-8">
                  <div className="grid grid-cols-3 font-semibold text-lg border-b-2 pb-2">
                     <div className="col-span-2">Category</div>
                     <div className="">Posts</div>
                  </div>
                  <div className="">
                     {respondCateStat.map((c) => (
                        <div
                           key={c[0]}
                           className="py-2 grid grid-cols-3 border-b-2 "
                        >
                           <div className="col-span-2">{c[0]}</div>
                           <div className="">{c[1]}</div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </LayoutDashboardManager>
   );
};

export default CategoryStatisticle;
