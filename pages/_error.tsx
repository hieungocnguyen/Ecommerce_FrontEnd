/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Layout from "../components/Layout/Layout";

export default function Error({ statusCode }) {
   return (
      <Layout title="Error">
         {statusCode && <h1>Error: {statusCode}</h1>}
         <p>We are sorry! There was an error</p>
         <Link href="/">
            <div className="py-3 px-4 bg-primary-color text-white rounded-lg font-semibold">
               Back to home
            </div>
         </Link>
      </Layout>
   );
}

Error.getInitialProps = ({ res, err }) => {
   const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
   return { statusCode };
};
