import Layout from "../components/Layout/Layout";

import { useForm } from "react-hook-form";
import Link from "next/link";

const Signin = () => {
   const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
   } = useForm();
   const onSubmit = (data) => console.log(data);

   return (
      <Layout title="Sign in">
         <div className="pt-6">
            <div className="font-semibold text-2xl pt-4 pb-10">Sign In</div>
            <form onSubmit={handleSubmit(onSubmit)}>
               <div className="flex flex-col max-w-md mx-auto">
                  <label
                     htmlFor="username"
                     className="mr-3 font-semibold text-left pt-4"
                  >
                     Username
                  </label>
                  <input
                     type="text"
                     id="username"
                     {...register("username")}
                     className="p-2 rounded-lg"
                  />
                  <label
                     htmlFor="password"
                     className="mr-3 font-semibold text-left pt-4"
                  >
                     Password
                  </label>
                  <input
                     type="text"
                     id="password"
                     {...register("password")}
                     className="p-2 rounded-lg"
                  />
               </div>
               <button className="bg-blue-main py-3 px-5 my-10 cursor-pointer hover:opacity-80 rounded-lg font-semibold text-white">
                  Sign in
               </button>
            </form>
            <div className="flex flex-col max-w-sm mx-auto">
               <button className="p-2 bg-blue-main rounded-lg hover:opacity-80 mb-4 font-semibold">
                  Sign in with Google
               </button>
               <button className="p-2 bg-blue-main rounded-lg hover:opacity-80 mb-4 font-semibold">
                  Sign in with Facebook
               </button>
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
      </Layout>
   );
};

export default Signin;
