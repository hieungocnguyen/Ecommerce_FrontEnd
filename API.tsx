import axios from "axios";
import Cookies from "js-cookie";

export let endpoints = {
   //upload cloudinary
   upload_cloudinary: "/upload/cloudinary",

   // user API
   register: "/user/register",
   user: (userID) => `/user/${userID}`,
   user_current_user: `/user/current-user`,
   change_password: (userID) => `/user/change-password/${userID}`,
   user_all: `/user/all`,
   reset_password: `/user/reset-password`,
   confirm_code: `/user/send-confirm`,
   authenticate: `/authenticate`,

   // sale post API
   get_all_salePost: "/sale-post/all",
   search_salePost: "/sale-post/search",
   publish_salePost: (postID) => `/sale-post/published/${postID}`,
   unpublish_salePost: (postID) => `/sale-post/un-published/${postID}`,
   salePost: (postID) => `/sale-post/${postID}`,
   create_salePost: (agencyID) => `/sale-post/create/${agencyID}`,
   add_item_salepost: (postID) => `/item/create/${postID}`,
   star_avg_post: (postID) => `/sale-post/get-star-average-rate/${postID}`,
   revenue_by_year: (agencyID) =>
      `/sale-post/stats-revenue-by-year/${agencyID}/`,
   revenue_by_month: (year, agencyID) =>
      `/sale-post/stats-revenue-month-by-year/${agencyID}/${year}`,
   revenue_by_quarter: (year, agencyID) =>
      `/sale-post/stats-revenue-quarter-by-year/${agencyID}/${year}`,
   count_comment_post: (postID) => `/action/comment/${postID}/count-comment`,
   create_piture: `/picture-post/create`,
   picture_post: (picID) => `/picture-post/${picID}`,
   like_post: (postID) => `/action/like/${postID}`,
   check_like: (postID) => `/action/like/state/${postID}`,
   wishlist: (userID) => `/sale-post/wish-list/${userID}`,
   get_post_published_by_agencyID: (agencyID) =>
      `/sale-post/published/${agencyID}/all`,
   get_post_unpublished_by_agencyID: (agencyID) =>
      `/sale-post/un-published/${agencyID}/all`,
   get_all_post_by_agencyID: (agencyID) =>
      `/sale-post/get-all-sale-post-by-agency-id/${agencyID}`,
   get_keyword_suggest: `/sale-post/get-keywords-suggest-for-search`,
   stat_comment_star_post: (postID) =>
      `/action/comment/stats-comments-by-sale-post/${postID}`,

   //cart API
   add_to_cart: "/cart/add-to-cart",
   update_cart: "/cart/update-cart",
   get_cart_by_id: (userID) => `/cart/get-cart/${userID}`,
   get_total: (userID) => `/cart/get-total-price-in-cart/${userID}`,
   clear_cart: `/cart/clear-cart`,
   delete_item_in_cart: (itemID) => `/cart/remove-item/${itemID}`,
   get_cart_checkout: (userID) =>
      `/cart/get-check-out-info-before-payment/${userID}`,

   //order API
   order_user: (userID) => `/order/orders-agency/user/${userID}`,
   order_agency: (agencyID) => `/order/orders-agency/agency/${agencyID}`,
   change_state: (orderAgencyID, stateID) =>
      `/order/orders-agency/${orderAgencyID}/${stateID}`,
   cancel_order: (orderAgencyID) =>
      `/order/orders-agency/cancel-order/${orderAgencyID}`,
   get_order_detail: (orderAgencyID) =>
      `/order/order-detail/get-orders-detail-by-order-agency/${orderAgencyID}`,

   //comment
   comment_post: (postID) => `/action/comment/create/${postID}`,
   comment_all: `action/comment/all`,
   comment_all_post: (postID) => `/action/comment/${postID}/all`,

   //agency
   register_agency: `/agency/register`,
   all_agency_cesorship: `/censorship/all`,
   all_agency: `/agency/all`,
   agency_info: (agencyID) => `/agency/${agencyID}`,
   get_agency_info_by_userID: (userID) =>
      `/agency/get-agency-by-user-id/${userID}`,
   uncensored_agency: `/censorship/uncensored`,
   accept_agency: (censorshipID) => `/censorship/accepted/${censorshipID}`,
   deny_agency: (censorshipID) => `/censorship/denied/${censorshipID}`,
   agency_fields_all: `/agency-field/all`,
   ban_agency: (agencyID) => `/agency/ban/${agencyID}`,
   unban_agency: (agencyID) => `/agency/unban/${agencyID}`,
   follow_agency: (agencyID) => `/action/follow/${agencyID}`,
   get_state_follow_agency: (agencyID) => `/action/follow/state/${agencyID}`,
   get_list_agency_follow: (userID) => `/agency/follow-list/${userID}`,
   search_agency: `/agency/search`,
   get_top_agency: `/agency/top-agency`,
   count_follow_agency: (agencyID) =>
      `/action/follow/count-follow-by-agency/${agencyID}`,
   stats_agency: (agencyID) => `/general-stats/view-agency/${agencyID}`,

   //category
   category_all: `/category/all`,
   get_category_by_categoryID: (categoryID) => `/category/${categoryID}`,
   get_all_category_by_admin: `/admin/get-all-categories`,
   update_category: (cateID) => `/admin/update-category/${cateID}`,
   create_category: `/admin/add-new-category`,
   //stat
   stat_post_category: `/sale-post/stats-by-category`,
   stat_category_by_agency: (agencyID) =>
      `/sale-post/stats-by-category/${agencyID}`,

   //item
   item: (itemID) => `/item/${itemID}`,

   //payment
   momo_payment_info: `/cart/get-momo-payment-info`,
   payment_cart: (paymentTypeID, addressID) =>
      `/cart/payment-cart/${paymentTypeID}/${addressID}`,

   //loation
   create_address: `/location/address-book/create`,
   get_address_book: (userID) =>
      `/location/address-book/get-address-book-by-user-id/${userID}`,
   get_full_address: (wardID) => `/location/get-full-address/${wardID}`,
   delete_address: (addressID) =>
      `/location/address-book/delete-by-id/${addressID}`,
   get_location_all_provinces: `/location/provinces/all`,
   get_location_district_by_provinceID: (provinceID) =>
      `/location/districts/get-districts-by-province-id/${provinceID}`,
   get_location_ward_by_districtID: (districtID) =>
      `/location/wards/get-wards-by-district-id/${districtID}`,
   get_nearest_location: (latitude, longitude) =>
      `/location/get-nearest-location?latitude=${latitude}&longitude=${longitude}`,
   //order-tracking
   get_provinces: `/order-tracking/ghn/location/get-provinces`,
   get_districts: `/order-tracking/ghn/location/get-districts`,
   get_wards: `/order-tracking/ghn/location/get-wards`,
   get_service_package: `/order-tracking/ghn/order/get-service-package-of-ghn-express`,
   get_print_order: (orderAgentID) =>
      `/order-tracking/ghn/order/print-order/${orderAgentID}`,
   get_review_info_order: (orderAgentID) =>
      `/order-tracking/ghn/order/review-order-info/${orderAgentID}`,
   get_pick_shift_order: `/order-tracking/ghn/order/get-pick-shift`,
   set_pick_shift_order: (orderAgencyID, pickShiftID) =>
      `/order-tracking/ghn/order/set-pick-shift/${orderAgencyID}/${pickShiftID}`,

   //notification
   update_seen_status: (recipientID) =>
      `/notify/update-seen-status/${recipientID}`,
   send_notify: `/notify/send-notify`,

   //renewal
   get_list_renewal_manager_by_agencyID: (agencyID) =>
      `/renewal/get-renewal-manage-by-agency-id/${agencyID}`,
   get_list_renewal_package: `/renewal/get-list-renewal-package`,
   create_order_renewal: (agencyID, packageID) =>
      `/renewal/create-order-renewal/${agencyID}/${packageID}`,
   get_renewal_momo_payment_info: (packageID) =>
      `/renewal/get-momo-payment-info/${packageID}`,
   stat_renewal_by_year: `/renewal/stats-revenue-by-year`,
   stat_renewal_by_quarter: (year) =>
      `/renewal/stats-revenue-quarter-by-year/${year}`,
   stat_renewal_by_month: (year) =>
      `/renewal/stats-revenue-month-by-year/${year}`,
   get_all_renewal: `/renewal/get-all-orders-renewal`,
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
