import AdminLayoutDashboard from "../../components/Dashboard/AdminLayoutDashboard";
import React, { useContext, useEffect, useState } from "react";
import { Store } from "../../utils/Store";

const AdminHome = () => {
   const { state } = useContext(Store);
   const { userInfo } = state;
   return (
      <AdminLayoutDashboard title="General">
         <div className="w-[90%] mx-auto">
            <div className="font-semibold text-2xl my-8">
               Hello {userInfo ? userInfo.firstName : "admin"}!
            </div>
         </div>
      </AdminLayoutDashboard>
   );
};

export default AdminHome;
