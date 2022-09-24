import { useRouter } from "next/router";
import React from "react";
import CategoryList from "../../components/CategoryList";
import Layout from "../../components/Layout/Layout";

const CategoryPage = () => {
   const router = useRouter();
   const { slug } = router.query;
   return (
      <div>
         <Layout title="Category Page">
            <div className="text-center font-bold text-xl mb-3 capitalize">
               Category: {slug}
            </div>
            <CategoryList />
         </Layout>
      </div>
   );
};

export default CategoryPage;
