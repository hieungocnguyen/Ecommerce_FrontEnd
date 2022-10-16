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
   cart: {
      cartItems: Cookies.get("cartItems")
         ? JSON.parse(Cookies.get("cartItems"))
         : [],
   },
   userInfo: Cookies.get("userInfo")
      ? JSON.parse(Cookies.get("userInfo"))
      : null,
};
function reducer(state: any, action: { type: any; payload: any }) {
   switch (action.type) {
      case "CART_ADD_ITEM": {
         const newItem = action.payload;
         const existItem = state.cart.cartItems.find(
            (item) => item.id === newItem.id
         );
         const cartItems = existItem
            ? state.cart.cartItems.map((item) =>
                 item.id === existItem.id ? newItem : item
              )
            : [...state.cart.cartItems, newItem];
         Cookies.set("cartItems", JSON.stringify(cartItems));
         return { ...state, cart: { ...state.cart, cartItems } };
      }
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
