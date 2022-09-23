import { useRouter } from "next/router";
import React from "react";
import Layout from "../components/Layout/Layout";

const Search = () => {
   const router = useRouter();
   return (
      <div>
         <Layout title="Search Page">Result for {router.query.input} </Layout>
      </div>
   );
};

export default Search;
