/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

export default function Error({ statusCode }) {
   return (
      <div>
         {statusCode && <h1>Error: {statusCode}</h1>}
         <p>We are sorry! There was an error</p>
         <Link href="/">
            <a>Go back home</a>
         </Link>
      </div>
   );
}

Error.getInitialProps = ({ res, err }) => {
   const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
   return { statusCode };
};
