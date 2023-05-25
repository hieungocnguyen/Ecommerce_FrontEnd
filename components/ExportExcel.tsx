import dynamic from "next/dynamic";
import React from "react";
import { CSVLink } from "react-csv";
import { RiFileExcel2Line } from "react-icons/ri";

const ExportExcel = ({ csvData, fileName }) => {
   return (
      <div className="inline-block">
         <CSVLink data={csvData} filename={fileName}>
            <div className="flex gap-1 items-center px-4 py-3 rounded-lg  bg-green-600 text-white font-semibold hover:shadow-lg hover:shadow-green-600">
               <RiFileExcel2Line className="text-3xl" />
               Export
            </div>
         </CSVLink>
      </div>
   );
};

// export default ExportExcel;
export default dynamic(() => Promise.resolve(ExportExcel), { ssr: false });
