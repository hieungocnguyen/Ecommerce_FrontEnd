import Cookies from "js-cookie";
import {
   createContext,
   JSXElementConstructor,
   ReactElement,
   ReactFragment,
   ReactPortal,
   useReducer,
} from "react";

export const Store = createContext(null);

const initialState = {
   compare: {
      products: Cookies.get("compare")
         ? JSON.parse(Cookies.get("compare"))
         : [],
   },
   cart: {
      cartItems: Cookies.get("cartItems")
         ? JSON.parse(Cookies.get("cartItems"))
         : [],
   },
   userInfo: Cookies.get("userInfo")
      ? JSON.parse(Cookies.get("userInfo"))
      : null,
   agencyInfo: Cookies.get("agencyInfo")
      ? JSON.parse(Cookies.get("agencyInfo"))
      : null,
   addressPayment: Cookies.get("addressPayment")
      ? JSON.parse(Cookies.get("addressPayment"))
      : null,
   allInCartToPayment: Cookies.get("allInCartToPayment")
      ? JSON.parse(Cookies.get("allInCartToPayment"))
      : null,
};
function reducer(state: any, action: { type: any; payload: any }) {
   switch (action.type) {
      case "CART_ADD_ITEM": {
         const newItem = action.payload;
         const existItem = state.cart.cartItems.find(
            (item) => item.id === newItem.id
         );
         // console.log(existItem);
         const cartItems = existItem
            ? state.cart.cartItems.map((item) =>
                 item.id === existItem.id
                    ? { ...item, quantity: item.quantity + newItem.quantity }
                    : item
              )
            : [...state.cart.cartItems, newItem];
         Cookies.set("cartItems", JSON.stringify(cartItems));
         return { ...state, cart: { ...state.cart, cartItems } };
      }
      case "CART_REMOVE_ITEM": {
         const cartItems = state.cart.cartItems.filter(
            (item) => item !== action.payload
         );
         Cookies.set("cartItems", JSON.stringify(cartItems));
         return { ...state, cart: { ...state.cart, cartItems } };
      }
      case "CART_REMOVE_ALL_ITEM": {
         Cookies.remove("cartItems");

         return { ...state, cart: { cartItems: [] } };
      }
      case "AGENCY_INFO_SET":
         return { ...state, agencyInfo: action.payload };
      case "AGENCY_INFO_REMOVE":
         Cookies.remove("agencyInfo");
         return { ...state, agencyInfo: null };
      case "USER_LOGIN":
         return { ...state, userInfo: action.payload };
      case "USER_LOGOUT":
         return {
            ...state,
            userInfo: null,
            cart: {
               cartItems: [],
               shippingAddress: { location: {} },
               paymentMethod: "",
            },
         };
      case "COMPARE_ADD_PRODUCT": {
         const newProduct = action.payload;
         const existProduct = state.compare.products.find(
            (item) => item.id === newProduct.id
         );
         const products = existProduct
            ? state.compare.products.map((product) =>
                 product.id === existProduct ? newProduct : product
              )
            : [...state.compare.products, newProduct];
         Cookies.set("compare", JSON.stringify(products));

         return { ...state, compare: { ...state.compare, products } };
      }
      case "COMPARE_REMOVE_PRODUCT": {
         const products = state.compare.products.filter(
            (item) => item.id !== action.payload.id
         );

         Cookies.set("compare", JSON.stringify(products));
         return { ...state, compare: { ...state.compare, products } };
      }
      // case "COMPARE_REMOVE_ALL_PRODUCT": {
      //    Cookies.remove("cartItems");
      //    return { ...state, compare: { ...state.compare } };
      // }
      case "ADD_ADDRESS_PAYMENT": {
         Cookies.set("addressPayment", JSON.stringify(action.payload));
         return { ...state, addressPayment: action.payload };
      }
      case "REMOVE_ADDRESS_PAYMENT": {
         Cookies.remove("addressPayment");
         return { ...state, addressPayment: null };
      }
      case "ADD_INFO_PAYMENT": {
         Cookies.set("allInCartToPayment", JSON.stringify(action.payload));

         return { ...state, allInCartToPayment: action.payload };
      }
      case "REMOVE_INFO_PAYMENT": {
         Cookies.remove("allInCartToPayment");
         return { ...state, allInCartToPayment: null };
      }

      default:
         return state;
   }
}
export function StoreProvider(props: {
   children:
      | string
      | number
      | boolean
      | ReactElement<any, string | JSXElementConstructor<any>>
      | ReactFragment
      | ReactPortal;
}) {
   const [state, dispatch] = useReducer(reducer, initialState);
   const value = { state, dispatch };
   return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
