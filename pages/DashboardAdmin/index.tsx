import AdminLayoutDashboard from "../../components/Dashboard/AdminLayoutDashboard";
import React, { useContext, useEffect, useState } from "react";
import {
   Chart as ChartJS,
   CategoryScale,
   LinearScale,
   BarElement,
   Title,
   Tooltip,
   Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import API, { endpoints } from "../../API";
import { Store } from "../../utils/Store";
ChartJS.register(
   CategoryScale,
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
      };
      loadDataCate();
      console.log();
   }, []);
   const labels = category;
   const data = {
      labels,
      datasets: [
         {
            label: "Number posts",
            data: dataStatCategory,
            backgroundColor: "#525EC1",
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
               Hello {userInfo ? userInfo.firstName : "admin"}!
            </div>
            <div className="">
               <div className="font-semibold text-lg my-8">Category</div>
               <Bar options={options} data={data} />
            </div>
         </div>
      </AdminLayoutDashboard>
   );
};

export default AdminHome;
