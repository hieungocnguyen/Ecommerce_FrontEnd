import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
   return (
      <Html lang="en">
         <Head>
            <meta property="og:type" content="website" />
            <meta property="og:title" content="Open Market - Super Ecommerce" />
            <meta
               property="og:description"
               content="Quality leading E-commerce Website"
            />
            <meta
               property="og:image"
               content="https://res.cloudinary.com/dec25/image/upload/v1683117159/avtArtboard_18_2x-100_l1mifl.jpg"
            />
         </Head>
         <body>
            <Main />
            <NextScript />
         </body>
      </Html>
   );
}
