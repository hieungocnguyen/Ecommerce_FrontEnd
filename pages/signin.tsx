import Layout from "../components/Layout/Layout";
import { useForm } from "react-hook-form";
import Link from "next/link";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Store } from "../utils/Store";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../components/Loader";
import { BiHomeAlt } from "react-icons/bi";
import API, { authAxios, endpoints } from "../API";
import useTrans from "../hook/useTrans";

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
   const [loading, setLoading] = useState(false);
   const trans = useTrans();

   const submitHandler = async ({ username, password }) => {
      try {
         setLoading(true);
         const dataToken = await axios.post(
            "http://localhost:8080/ou-ecommerce/authenticate",
            {
               username,
               password,
            }
         );

         Cookies.set("accessToken", dataToken.data.data.token);

         const dataCurrentUser = await authAxios().get(
            endpoints["user_current_user"]
         );

         Cookies.set("userInfo", JSON.stringify(dataCurrentUser.data.data));
         dispatch({ type: "USER_LOGIN", payload: dataCurrentUser.data.data });

         if (dataCurrentUser.data.code === "200") {
            setLoading(false);
            router.push("/");
            // router.back();
            toast.success(`Sign in successful!`, {
               position: "top-center",
            });
         } else {
            setLoading(false);
            toast.error(`Something wrong, please check again.`, {
               position: "top-center",
            });
         }
      } catch (error) {
         console.log(error);
         setLoading(false);
         if (error.response) {
            if (
               error.response.data.code === "401" ||
               error.response.data.code === "400"
            ) {
               toast.error("Username or password incorrect!", {
                  position: "top-center",
               });
            } else {
               toast.error(error.response.data.message, {
                  position: "top-center",
               });
            }
         }
      }
   };
   return (
      <Layout title="Sign in">
         <div>
            <div className="flex gap-4 items-center m-6">
               <div
                  className="bg-primary-color text-white p-3 text-2xl rounded-lg cursor-pointer hover:shadow-lg hover:shadow-primary-color"
                  onClick={() => router.push("/")}
               >
                  <BiHomeAlt />
               </div>
               <div className="font-semibold text-2xl">
                  / {trans.signIn.sign_in}
               </div>
            </div>
            <form onSubmit={handleSubmit(submitHandler)}>
               <div className="flex flex-col max-w-md mx-auto font-medium">
                  <label
                     htmlFor="username"
                     className="mr-3 font-semibold text-left pt-5 pb-2"
                  >
                     {trans.signIn.username}
                  </label>
                  <input
                     type="text"
                     id="username"
                     {...register("username")}
                     className="p-4 rounded-lg bg-light-primary dark:bg-dark-primary"
                     required
                  />
                  <label
                     htmlFor="password"
                     className="mr-3 font-semibold text-left py-5 pb-2"
                  >
                     {trans.signIn.password}
                  </label>
                  <input
                     type="password"
                     id="password"
                     {...register("password")}
                     className="p-4 rounded-lg bg-light-primary dark:bg-dark-primary"
                     autoComplete="on"
                     required
                  />
               </div>
               <button
                  className="bg-primary-color py-3 px-5 my-4 cursor-pointer hover:shadow-lg hover:shadow-primary-color transition-all rounded-lg font-semibold text-white "
                  title="Sign in"
               >
                  {trans.signIn.sign_in_with_OM}
               </button>
               <Link href="/forgotPassword">
                  <div
                     className="text-primary-color cursor-pointer mb-10 font-semibold w-fit mx-auto"
                     title="Reset password"
                  >
                     {trans.signIn.forgot_password}
                  </div>
               </Link>
            </form>
            <div className="flex flex-col max-w-sm mx-auto">
               <Link href="https://accounts.google.com/o/oauth2/auth?scope=email&redirect_uri=http://localhost:8080/ou-ecommerce/login-google&response_type=code&client_id=405256729803-ldem34qntvtuhmtenig599itet2489ga.apps.googleusercontent.com&approval_prompt=force">
                  <button
                     className="p-2 bg-[#EA4335] rounded-lg hover:shadow-lg hover:shadow-[#EA4335] transition-all mb-4 font-semibold text-white"
                     title="Google account"
                  >
                     {trans.signIn.sign_in_with_GG}
                  </button>
               </Link>
               <Link href="https://www.facebook.com/dialog/oauth?scope=email&client_id=555265043013184&redirect_uri=http://localhost:8080/ou-ecommerce/login-facebook">
                  <button
                     className="p-2 bg-[#1877f2] rounded-lg mb-4 font-semibold text-white hover:shadow-lg hover:shadow-primary-color transition-all"
                     title="Facebook account"
                  >
                     {trans.signIn.sign_in_with_FB}
                  </button>
               </Link>
            </div>
            <div className="my-4">
               {trans.signIn.dont_have_account}{" "}
               <Link href={`/register`}>
                  <span className="text-primary-color cursor-pointer font-semibold">
                     {trans.signIn.register}
                  </span>
               </Link>
            </div>
         </div>
         {loading ? <Loader /> : <></>}
         <Toaster />
      </Layout>
   );
};

export default Signin;
