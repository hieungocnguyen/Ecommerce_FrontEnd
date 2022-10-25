import axios from "axios";
import Cookies from "js-cookie";
export let endpoints = {
   //upload cloudinary
   upload_cloudinary: "/upload/cloudinary",
   // user API
   register: "/user/register",
   user: (userID) => `/user/${userID}`,
   change_password: (userID) => `/user/change-password/${userID}`,
   // sale post API
   get_all_salePost: "sale-post/all",
   search_salePost: "/sale-post/search",
   publish_salePost: (postID) => `/sale-post/published/${postID}`,
   unpublish_salePost: (postID) => `/sale-post/un-published/${postID}`,
   salePost: (postID) => `/sale-post/${postID}`,
   create_salePost: (agencyID) => `/sale-post/create/${agencyID}`,
   //cart API
   add_to_cart: "cart/add-to-cart",
   get_cart_by_id: (userID) => `/cart/get-cart/${userID}`,
   get_total: (userID) => `/cart/get-total-price-in-cart/${userID}`,
   payment_cart: (paymentTypeID) => `/cart/payment-cart/${paymentTypeID}`,
   clear_cart: `/cart/clear-cart`,
   delete_item_in_cart: (itemID) => `/cart/remove-item/${itemID}`,
   //order API
   order_user: (userID) => `/order/orders-agency/user/${userID}`,
   //comment
   comment_post: (postID) => `/action/comment/create/${postID}`,
   comment_all: `action/comment/all`,
   comment_all_post: (postID) => `/action/comment/${postID}/all`,
   //agency
   register_agency: `/agency/register`,
   all_agency: `/agency/all`,
   agency_info: (agencyID) => `/agency/${agencyID}`,
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
