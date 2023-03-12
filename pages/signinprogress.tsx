import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import Cookies from "js-cookie";
import { Store } from "../utils/Store";
import toast, { Toaster } from "react-hot-toast";

const SignGG = () => {
   const router = useRouter();
   const jwt = router.query.jwt;
   const msg = router.query.msg;
   const { state, dispatch } = useContext(Store);
   const { userInfo } = state;

   useEffect(() => {
      const loadCurrentUser = async () => {
         const resUser = await axios.get(
            "http://localhost:8080/ou-ecommerce/api/user/current-user",
            {
               headers: {
                  Authorization: `Bearer ${jwt}`,
               },
            }
         );
         Cookies.set("accessToken", jwt);
         Cookies.set("userInfo", JSON.stringify(resUser.data.data));
         dispatch({ type: "USER_LOGIN", payload: resUser.data.data });
         if (resUser) {
            router.push("/");
            toast.success("Sign in successful!", {
               position: "bottom-center",
            });
         }
      };
      if (jwt) {
         loadCurrentUser();
      }
      if (msg) {
         router.push("/signin");
         toast.error(`${msg}`, {
            position: "bottom-center",
         });
      }
   }, [msg, jwt]);
   return (
      <div>
         <div></div>
         <Toaster />
      </div>
   );
};

export default SignGG;
