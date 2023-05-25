import dynamic from "next/dynamic";
import React from "react";
import { CSVLink, CSVDownload } from "react-csv";

const headers = [
   { label: "First Name", key: "firstName" },
   { label: "Last Name", key: "lastName" },
   { label: "Email", key: "email" },
   { label: "Age", key: "age" },
];

const data = [
   {
      firstName: "Warren",
      lastName: "Morrow",
      email: "sokyt@mailinator.com",
      age: "36",
   },
   {
      firstName: "Gwendolyn",
      lastName: "Galloway",
      email: "weciz@mailinator.com",
      age: "76",
   },
   {
      firstName: "Astra",
      lastName: "Wyatt",
      email: "quvyn@mailinator.com",
      age: "57",
   },
   {
      firstName: "Jasmine",
      lastName: "Wong",
      email: "toxazoc@mailinator.com",
      age: "42",
   },
   {
      firstName: "Brooke",
      lastName: "Mcconnell",
      email: "vyry@mailinator.com",
      age: "56",
   },
   {
      firstName: "Christen",
      lastName: "Haney",
      email: "pagevolal@mailinator.com",
      age: "23",
   },
   {
      firstName: "Tate",
      lastName: "Vega",
      email: "dycubo@mailinator.com",
      age: "87",
   },
   {
      firstName: "Amber",
      lastName: "Brady",
      email: "vyconixy@mailinator.com",
      age: "78",
   },
   {
      firstName: "Philip",
      lastName: "Whitfield",
      email: "velyfi@mailinator.com",
      age: "22",
   },
   {
      firstName: "Kitra",
      lastName: "Hammond",
      email: "fiwiloqu@mailinator.com",
      age: "35",
   },
   {
      firstName: "Charity",
      lastName: "Mathews",
      email: "fubigonero@mailinator.com",
      age: "63",
   },
];

const csvReport = {
   data: data,
   headers: headers,
   filename: "Clue_Mediator_Report.csv",
};

const test = () => {
   return (
      <div>
         <CSVLink {...csvReport}>Download me</CSVLink>
      </div>
   );
};

// export default test;
export default dynamic(() => Promise.resolve(test), { ssr: false });
