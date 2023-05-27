import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";

const Loading = () => {
   const [loading, setLoading] = useState(false);
   const router = useRouter();

   useEffect(() => {
      const handleStart = (url) => {
         url !== router.asPath && setLoading(true);
      };
      const handleComplete = (url) => {
         if (router.asPath.slice(0, 15) == "/signinprogress") {
            setLoading(false);
         }

         if (router.locale != "en") {
            (url.slice(3).length == 0 ? "/" : url.slice(3)) === router.asPath &&
               setLoading(false);
         } else {
            url === router.asPath && setLoading(false);
         }
         setLoading(false);
      };
      const handleError = () => {
         setLoading(false);
      };

      router.events.on("routeChangeStart", handleStart);
      router.events.on("routeChangeComplete", handleComplete);
      router.events.on("routeChangeError", handleError);

      return () => {
         router.events.off("routeChangeStart", handleStart);
         router.events.off("routeChangeComplete", handleComplete);
         router.events.off("routeChangeError", handleError);
      };
   });

   return (
      loading && (
         <div className="fixed top-0 right-0 w-screen h-screen flex items-center justify-center bg-opacity-20 bg-primary-color z-50">
            <div className="flex justify-center my-8">
               <SyncLoader size={20} color="#2065d1" />
            </div>
         </div>
      )
   );
};

export default Loading;
