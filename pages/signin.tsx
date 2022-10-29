import Layout from "../components/Layout/Layout";
import { useForm } from "react-hook-form";
import Link from "next/link";
import axios from "axios";
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { Store } from "../utils/Store";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";

const Signin = () => {
   const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
   } = useForm();
   const { state, dispatch } = useContext(Store);
   const { userInfo } = state;
   const router = useRouter();
   const { redirect } = router.query;

   const submitHandler = async ({ username, password }) => {
      try {
         const dataToken = await axios.post(
            "http://localhost:8080/ou-ecommerce/authenticate",
            {
               username,
               password,
            }
         );
         Cookies.set("accessToken", dataToken.data.data.token);
         const dataCurrentUser = await axios.get(
            "http://localhost:8080/ou-ecommerce/api/user/current-user",
            {
               headers: {
                  Authorization: `Bearer ${dataToken.data.data.token}`,
               },
            }
         );

         Cookies.set("userInfo", JSON.stringify(dataCurrentUser.data.data));
         dispatch({ type: "USER_LOGIN", payload: dataCurrentUser.data.data });
         router.push("/");
      } catch (error) {
         toast.error("Sign in failed, try again", {
            position: "bottom-center",
         });
      }
   };
   return (
      <Layout title="Sign in">
         <div className="pt-6">
            <div className="font-semibold text-2xl pt-10 pb-2">Sign In</div>
            <form onSubmit={handleSubmit(submitHandler)}>
               <div className="flex flex-col max-w-md mx-auto">
                  <label
                     htmlFor="username"
                     className="mr-3 font-semibold text-left pt-5 pb-2"
                  >
                     Username
                  </label>
                  <input
                     type="text"
                     id="username"
                     {...register("username")}
                     className="p-4 rounded-lg"
                  />
                  <label
                     htmlFor="password"
                     className="mr-3 font-semibold text-left py-5 pb-2"
                  >
                     Password
                  </label>
                  <input
                     type="password"
                     id="password"
                     {...register("password")}
                     className="p-4 rounded-lg"
                  />
               </div>
               <button className="bg-blue-main py-3 px-5 my-4 cursor-pointer hover:opacity-80 rounded-lg font-semibold text-white ">
                  Sign in with Mallity
               </button>
               <Link href="/forgotPassword">
                  <div className="text-blue-main cursor-pointer mb-10">
                     Forgt password?
                  </div>
               </Link>
            </form>
            <div className="flex flex-col max-w-sm mx-auto">
               <Link href="https://accounts.google.com/o/oauth2/auth?scope=email&redirect_uri=http://localhost:8080/ou-ecommerce/login-google&response_type=code&client_id=405256729803-ldem34qntvtuhmtenig599itet2489ga.apps.googleusercontent.com&approval_prompt=force">
                  <button className="p-2 bg-[#EA4335] rounded-lg hover:opacity-80 mb-4 font-semibold text-white">
                     Sign in with Google
                  </button>
               </Link>
               <Link href="https://www.facebook.com/dialog/oauth?scope=email&client_id=555265043013184&redirect_uri=http://localhost:8080/ou-ecommerce/login-facebook">
                  <button className="p-2 bg-[#1877f2] rounded-lg hover:opacity-80 mb-4 font-semibold text-white">
                     Sign in with Facebook
                  </button>
               </Link>
            </div>
            <div className="my-4">
               Don&apos;t have an account?{" "}
               <Link href={`/register`}>
                  <span className="text-blue-main cursor-pointer">
                     Register
                  </span>
               </Link>
            </div>
         </div>
         <Toaster />
      </Layout>
   );
};

export default Signin;
