import React, { useEffect, useState } from "react";
import AdminLayoutDashboard from "../../components/Dashboard/AdminLayoutDashboard";
import API, { endpoints } from "../../API";
import UpdateRenewal from "../../components/Model/UpdateRenewal";

const RenewalAdminManage = () => {
   const [packages, setPackages] = useState([]);
   const [openModel, setOpenmodel] = useState(false);
   const [pack, setPack] = useState<any>({});

   const fetchPackage = async () => {
      try {
         const res = await API.get(endpoints["get_list_renewal_package"]);
         const dataPackage = [...res.data.data];
         setPackages(dataPackage.filter((i) => i.id != 1));
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      fetchPackage();
   }, [openModel]);

   return (
      <AdminLayoutDashboard title="Renewal">
         <div className="w-[95%] mx-auto mt-8">
            <div className="font-semibold text-2xl">Renewal</div>
            <div className="grid grid-cols-3 gap-12 text-center mt-6">
               {packages.map((p) => (
                  <div
                     key={p.id}
                     className="flex flex-col p-4 bg-light-primary rounded-lg"
                  >
                     <div className="font-semibold uppercase">
                        {p.packageName}
                     </div>
                     <div className="font-semibold text-lg mt-1 text-primary-color">
                        {p.numberOfDaysAvailable} Days
                     </div>
                     <div className="line-through mt-6">
                        {p.usualPrice.toLocaleString("it-IT", {
                           style: "currency",
                           currency: "VND",
                        })}
                     </div>
                     <div className="text-2xl font-semibold text-primary-color">
                        {p.discountPrice.toLocaleString("it-IT", {
                           style: "currency",
                           currency: "VND",
                        })}
                     </div>
                     <div className="mt-6 w-[80%] mx-auto h-24">
                        {p.description}
                     </div>
                     <div
                        className="mt-4 py-3 text-white font-semibold rounded-lg bg-primary-color hover:shadow-lg hover:shadow-primary-color cursor-pointer"
                        onClick={() => {
                           setOpenmodel(true);
                           setPack(p);
                        }}
                     >
                        Edit
                     </div>
                  </div>
               ))}
            </div>
            <div
               className={`fixed top-0 right-0 w-full h-screen backdrop-blur-sm items-center sm:justify-center justify-start z-30 ${
                  openModel ? "flex" : "hidden"
               }`}
            >
               {openModel && (
                  <div className="w-1/4 h-fit">
                     <UpdateRenewal pack={pack} setOpenmodel={setOpenmodel} />
                  </div>
               )}
            </div>
         </div>
      </AdminLayoutDashboard>
   );
};

export default RenewalAdminManage;
