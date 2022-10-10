import React from "react";
import Layout from "../components/Layout/Layout";
import { useForm } from "react-hook-form";
import Link from "next/link";

const Register = () => {
   const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
   } = useForm();
   const onSubmit = (data) => console.log(data);
   return (
      <Layout title="Register">
         <div className="pt-6">
            <div className="font-semibold text-2xl pt-4 pb-10">
               Create a new account
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
               <div className="flex flex-col max-w-md mx-auto">
                  <label
                     htmlFor="username"
                     className="font-semibold text-left pt-4"
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
                     className="font-semibold text-left pt-4"
                  >
                     Password
                  </label>
                  <input
                     type="text"
                     id="password"
                     {...register("password")}
                     className="p-2 rounded-lg"
                  />
                  <label
                     htmlFor="confirmPassword"
                     className="font-semibold text-left pt-4"
                  >
                     Confirm Password
                  </label>
                  <input
                     type="text"
                     id=" confirmPassword"
                     className="p-2 rounded-lg"
                  />
               </div>

               <button className="bg-blue-main py-3 px-5 my-5 cursor-pointer hover:opacity-80 rounded-lg font-semibold text-white">
                  Create
               </button>
            </form>
            <Link href="/signin">
               <div className="cursor-pointer text-blue-main">
                  Back to sign in
               </div>
            </Link>
         </div>
      </Layout>
   );
};

export default Register;
