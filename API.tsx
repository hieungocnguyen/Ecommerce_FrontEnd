import axios from "axios";
import Cookies from "js-cookie";
export let endpoints = {
   //upload cloudinary
   upload_cloudinary: "/upload/cloudinary",
   // user API
   register: "/user/register",
   user: (userID) => `/user/${userID}`,
   // sale post API
   get_all_salePost: "sale-post/all",
   //cart API
   add_to_cart: "cart/add-to-cart",
   get_cart_by_id: (userID) => `/cart/get-cart/${userID}`,
};
export const authAxios = () =>
   axios.create({
      baseURL: "http://localhost:8080/ou-ecommerce/api",
      headers: {
         Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
   });

export default axios.create({
   baseURL: "http://localhost:8080/ou-ecommerce/api",
});
