import * as firebase from "firebase/app";
import "firebase/firestore";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
   apiKey: "AIzaSyBD94WmL-C3ZRtDuxXI2dp-KJPT2dhh1ZE",
   authDomain: "ecom-chat-realtime.firebaseapp.com",
   projectId: "ecom-chat-realtime",
   storageBucket: "ecom-chat-realtime.appspot.com",
   messagingSenderId: "330488433038",
   appId: "1:330488433038:web:e82a6ff4091cd34495bcdf",
};

const app = firebase.initializeApp(firebaseConfig, "chatApp");
export const chat = getFirestore(app);
