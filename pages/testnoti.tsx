import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "./lib/firebase-config";
import { useEffect, useState } from "react";

const Testnoti = () => {
   const [items, setItems] = useState([]);

   //    useEffect(() => {
   //       const unsubcribe = onSnapshot(collection(db, "test1"), (snapshot) => {
   //          setItems(
   //             snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
   //          );
   //       });

   //       return () => {
   //          unsubcribe();
   //       };
   //    }, []);

   return (
      <div>
         {items.length > 0 ? (
            items.map((item) => <div key={item.id}>{item.data.title}</div>)
         ) : (
            <div>empty</div>
         )}
      </div>
   );
};

export default Testnoti;
