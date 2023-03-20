import AdminLayoutDashboard from "../../components/Dashboard/AdminLayoutDashboard";
import React, { useContext, useEffect, useState } from "react";
import {
   Chart as ChartJS,
   CategoryScale,
   LinearScale,
   ArcElement,
   BarElement,
   Title,
   Tooltip,
   Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import API, { endpoints } from "../../API";
import { Store } from "../../utils/Store";
ChartJS.register(
   CategoryScale,
   ArcElement,
   LinearScale,
   BarElement,
   Title,
   Tooltip,
   Legend
);

export const options = {
   responsive: true,
   plugins: {
      legend: {
         position: "top" as const,
      },
   },
};

const AdminHome = () => {
   const [category, setCategory] = useState([]);
   const { state, dispatch } = useContext(Store);
   const { userInfo, agencyInfo } = state;
   const [respondCateStat, setRespondCateStat] = useState([]);
   const [dataStatCategory, setDataStatCategory] = useState([]);
   useEffect(() => {
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
   const labels = category;
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
   const options = {
      responsive: true,
      plugins: {
         legend: {
            position: "top" as const,
         },
      },
   };
   return (
      <AdminLayoutDashboard>
         <div className="w-[90%] mx-auto">
            <div className="font-semibold text-2xl my-8">
               Hello {userInfo ? userInfo.firstName : "admin"}! Welcome back
            </div>
            <div className="font-semibold text-2xl my-10">Statistical</div>
            <div>
               <div className="font-semibold text-xl my-4">
                  Statistical by category
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1 dark:bg-dark-primary bg-light-primary rounded-lg p-8">
                     <Doughnut data={dataCate} />
                  </div>
                  <div className="col-span-1 dark:bg-dark-primary bg-light-primary rounded-lg p-8">
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
         </div>
      </AdminLayoutDashboard>
   );
};

export default AdminHome;
