import { getFirestore } from "firebase/firestore";

import * as firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
   apiKey: "AIzaSyBCREVd7MEPyfT9lu9oJqd0NUpQL6qogzY",
   authDomain: "ecom-notify-db.firebaseapp.com",
   databaseURL: "https://ecom-notify-db-default-rtdb.firebaseio.com",
   projectId: "ecom-notify-db",
   storageBucket: "ecom-notify-db.appspot.com",
   messagingSenderId: "501847373639",
   appId: "1:501847373639:web:05e072070a171f6cf17e62",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
// Initialize Firestore
export const db = getFirestore(app);
