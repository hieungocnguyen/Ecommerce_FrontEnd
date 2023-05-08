import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import Cookies from "js-cookie";
import { Store } from "../utils/Store";
import toast, { Toaster } from "react-hot-toast";
import API, { endpoints } from "../API";

const SignGG = () => {
   const router = useRouter();
   const jwt = router.query.jwt;
   const msg = router.query.msg;
   const { state, dispatch } = useContext(Store);
   const { userInfo } = state;

   const loadCurrentUser = async () => {
      try {
         const resUser = await API.get(endpoints["user_current_user"], {
            headers: {
               Authorization: `Bearer ${jwt}`,
            },
         });
         Cookies.set("accessToken", jwt);
         Cookies.set("userInfo", JSON.stringify(resUser.data.data));
         dispatch({ type: "USER_LOGIN", payload: resUser.data.data });
         router.push("/");
         toast.success("Sign in successful!", {
            position: "top-center",
         });
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      if (jwt) {
         loadCurrentUser();
      }
      if (msg) {
         router.push("/signin");
         toast.error(`${msg}`, {
            position: "top-center",
         });
      }
   }, [dispatch, jwt, msg, router]);
   return (
      <div>
         <div></div>
         <Toaster />
      </div>
   );
};

export default SignGG;
