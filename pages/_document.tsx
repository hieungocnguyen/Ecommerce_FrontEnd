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
               content="https://res.cloudinary.com/ngnohieu/image/upload/v1684215390/thumbnailArtboard_19_lh1aia.png"
            />
         </Head>
         <body>
            <Main />
            <NextScript />
         </body>
      </Html>
   );
}
