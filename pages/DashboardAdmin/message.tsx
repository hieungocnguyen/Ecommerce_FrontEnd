/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { BiImageAdd, BiPaperPlane } from "react-icons/bi";
import AdminLayoutDashboard from "../../components/Dashboard/AdminLayoutDashboard";
import { Box, LinearProgress } from "@mui/material";
import Image from "next/image";
import Fancybox from "../../components/FancyBox";
import { useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
   arrayUnion,
   collection,
   doc,
   getDoc,
   onSnapshot,
   orderBy,
   query,
   serverTimestamp,
   setDoc,
   updateDoc,
} from "firebase/firestore";
import { chat } from "../../lib/chat_firebase";
import API, { endpoints } from "../../API";
import moment from "moment";
import { Store } from "../../utils/Store";
import emptyImage from "../../public/empty-box.png";
import vectorChat from "../../public/vectorchat.png";

const MessageAdmin = () => {
   const [agencyID, setAgencyID] = useState(0);
   const [agencyList, setAgencyList] = useState<any>([]);
   const { state } = useContext(Store);
   const { userInfo } = state;
   const [empty, setEmpty] = useState(true);

   useEffect(() => {
      try {
         let empty = true;
         const unsuscribe = onSnapshot(
            query(collection(chat, `admin`), orderBy("createdAt")),
            (snapshot) => {
               let agencies = [];
               snapshot.forEach((doc) => {
                  agencies.push({ ...doc.data() });
                  console.log(doc.data());
               });
               setAgencyList(agencies.reverse());
               if (agencies.length > 0) {
                  setEmpty(false);
                  empty = false;
               }
               if (agencyID == 0 && userInfo && agencies.length > 0 && !empty) {
                  setAgencyID(agencies[0].id);
               }
            }
         );

         return () => unsuscribe();
      } catch (error) {
         console.log(error);
      }
   }, []);

   return (
      <AdminLayoutDashboard title="Message">
         <div className="w-[95%] mx-auto h-screen p-6">
            <div className="grid grid-cols-12 h-full bg-light-primary rounded-lg">
               <div className="col-span-4 m-3 mr-0 py-2 rounded-xl bg-light-bg overflow-auto">
                  <div className="mt-2">
                     {agencyList.map((customer) => (
                        <div
                           key={customer?.id}
                           className={`py-2 px-2 m-2 mt-0 grid grid-cols-12 gap-2 items-center rounded-md cursor-pointer hover:brightness-95 ${
                              !customer?.isSeen ? "bg-gray-200" : "bg-gray-50"
                           }`}
                           onClick={() => {
                              setAgencyID(Number(customer?.id));
                              console.log(customer);
                           }}
                        >
                           <div
                              className={`col-span-2 relative overflow-hidden w-full aspect-square border-2 border-primary-color rounded-full cursor-pointer hover:brightness-90`}
                           >
                              <Image
                                 src={customer?.avatar}
                                 alt="avt"
                                 layout="fill"
                                 className="object-cover rounded-full"
                              />
                           </div>
                           <div className="col-span-10">
                              <div
                                 className={`text-lg text-primary-color text-ellipsis line-clamp-1 overflow-hidden ${
                                    !customer?.isSeen
                                       ? "font-medium"
                                       : "font-medium"
                                 }`}
                              >
                                 {customer?.displayName}
                              </div>
                              <div
                                 className={`text-ellipsis line-clamp-1 overflow-hidden text-sm ${
                                    !customer?.isSeen
                                       ? "font-semibold"
                                       : "font-normal"
                                 }`}
                              >
                                 {customer?.messageLatest}
                              </div>
                              <div className="text-xs italic">
                                 {moment(customer?.createdAt?.seconds * 1000)
                                    .startOf("m")
                                    .fromNow()}
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
                  {empty && (
                     <div className="relative overflow-hidden w-1/2 aspect-square mx-auto mt-52">
                        <Image
                           src={emptyImage}
                           alt="img"
                           layout="fill"
                           className="object-cover"
                        />
                     </div>
                  )}
               </div>
               <div className="col-span-8 grid grid-rows-6">
                  <MessageView
                     agencyID={agencyID}
                     userInfo={userInfo}
                     empty={empty}
                  />
               </div>
            </div>
         </div>
      </AdminLayoutDashboard>
   );
};

export default MessageAdmin;

const MessageView = ({ agencyID, userInfo, empty }) => {
   const [messages, setMessages] = useState([]);
   const [newMessage, setNewMessage] = useState("");
   const [infoAgency, setInfoAgency] = useState<any>({});
   const [isSeenCustomer, setIsSeenCustomer] = useState(false);
   const scrollRef = useRef(null);
   const [selectedImage, setSelectedImage] = useState();
   const [importImage, setImportImage] = useState(false);
   const [progress, setProgress] = useState(0);
   const imageUploadRef = useRef(null);
   const [disableButtonInteractive, setDisableButtonInteractive] =
      useState(false);

   const fetchsetSeenMessage = async () => {
      if (agencyID) {
         const docRef = doc(chat, `admin`, `agency${agencyID}`);
         await setDoc(
            docRef,
            {
               isSeen: true,
            },
            { merge: true }
         );
      }
   };

   //snapshot messages
   useEffect(() => {
      try {
         fetchsetSeenMessage();
         const docRef = doc(chat, `admin`, `agency${agencyID}`);

         const unsuscribe = onSnapshot(docRef, (doc) => {
            if (doc.data() && doc.data().messages) {
               setMessages(
                  doc
                     .data()
                     .messages.sort((a, b) =>
                        a.createdAt.seconds < b.createdAt.seconds ? 1 : -1
                     )
               );
               setInfoAgency(doc.data());
               fetchsetSeenMessage();
            } else {
               setMessages([]);
            }
         });

         return () => unsuscribe();
      } catch (error) {
         console.log(error);
      }
   }, [agencyID]);

   //snapshot seen
   useEffect(() => {
      try {
         const docRef = doc(chat, `agency${agencyID}`, `admin`);

         const unsuscribe = onSnapshot(docRef, (doc) => {
            if (doc.data() && doc.data().messages) {
               setIsSeenCustomer(doc.data().isSeen);
            } else {
               setIsSeenCustomer(true);
            }
         });

         return () => unsuscribe();
      } catch (error) {
         console.log(error);
      }
   }, [agencyID]);

   const handleSubmit = async (event) => {
      event.preventDefault();
      setIsSeenCustomer(false);

      const docRef = doc(chat, `agency${agencyID}`, "admin");
      if ((await getDoc(docRef)).exists()) {
         await setDoc(
            docRef,
            {
               avatar:
                  "https://res.cloudinary.com/ngnohieu/image/upload/v1685723176/thumbnailArtboard_19_Small_drrxuq.png",
               createdAt: serverTimestamp(),
               displayName: "✨Admin Open Market",
            },
            { merge: true }
         );
      } else {
         await setDoc(docRef, {
            id: -1,
            avatar:
               "https://res.cloudinary.com/ngnohieu/image/upload/v1685723176/thumbnailArtboard_19_Small_drrxuq.png",
            createdAt: serverTimestamp(),
            displayName: "✨Admin Open Market",
            messageLatest: "Click to start chat",
            isSeen: false,
            messages: [],
         });
      }

      if (selectedImage) {
         try {
            setDisableButtonInteractive(true);
            let urlImage = "";
            setProgress(20);
            const resUploadCloudinary = await API.post(
               endpoints["upload_cloudinary"],
               { file: selectedImage },
               {
                  headers: {
                     "Content-Type": "multipart/form-data",
                  },
               }
            );
            urlImage = resUploadCloudinary.data.data;
            if (resUploadCloudinary.data.data) {
               setProgress(100);
            }

            //set message to admin/agencyXX
            const chatRefCustomer = doc(chat, `admin`, `agency${agencyID}`);
            await updateDoc(chatRefCustomer, {
               messageLatest: "Image",
               isSeen: false,
               createdAt: new Date(),
               messages: arrayUnion({
                  message: urlImage,
                  owner: 0, //agency send
                  createdAt: new Date(),
                  type: "image",
               }),
            });

            //set message to customerXX/agencyXX
            const chatRefAgency = doc(chat, `agency${agencyID}`, `admin`);
            await updateDoc(chatRefAgency, {
               messageLatest: "Image",
               isSeen: false,
               createdAt: new Date(),
               messages: arrayUnion({
                  message: urlImage,
                  owner: 1,
                  createdAt: new Date(),
                  type: "image",
               }),
            });
            setProgress(0);
            setSelectedImage(undefined);
            setImportImage(false);
            imageUploadRef.current.value = null;
            setDisableButtonInteractive(false);
         } catch (error) {
            console.log(error);
         }
      } else {
         if (newMessage === "") return;
         const text = newMessage;
         setNewMessage("");

         try {
            //set message to agencyXX/customerXX
            const chatRefCustomer = doc(chat, `admin`, `agency${agencyID}`);
            await updateDoc(chatRefCustomer, {
               messageLatest: text,
               isSeen: false,
               createdAt: new Date(),
               messages: arrayUnion({
                  message: text,
                  owner: 0, //agency send
                  createdAt: new Date(),
                  type: "text",
               }),
            });

            //set message to customerXX/agencyXX
            const chatRefAgency = doc(chat, `agency${agencyID}`, `admin`);
            await updateDoc(chatRefAgency, {
               messageLatest: text,
               isSeen: false,
               createdAt: new Date(),
               messages: arrayUnion({
                  message: text,
                  owner: 1,
                  createdAt: new Date(),
                  type: "text",
               }),
            });
         } catch (error) {
            console.log(error);
         }
      }
   };

   const imageChange = (e) => {
      if (e.target.files[0] === undefined) {
         setImportImage(false);
      } else {
         // size < 2MB
         if (e.target.files[0].size <= 2097152) {
            setSelectedImage(e.target.files[0]);
            setImportImage(true);
         } else {
            setImportImage(false);
            toast.error("Maximum upload size is 2MB, please try other image");
         }
      }
   };

   useEffect(() => {
      // 👇️ scroll to bottom every time messages change
      scrollRef.current?.scrollIntoView();
   }, [messages, isSeenCustomer]);

   return (
      <>
         <div className="row-span-5 bg-light-bg p-2 m-3 mb-0 rounded-xl ">
            {!empty && (
               <div className="flex items-center gap-1 justify-start p-1 border-b-2 border-gray-300">
                  <div className="relative w-12 aspect-square overflow-hidden rounded-full border-2 border-primary-color">
                     <Image
                        src={infoAgency?.avatar}
                        alt="avt"
                        layout="fill"
                        className="object-cover"
                     />
                  </div>

                  <div className="font-semibold">{infoAgency?.displayName}</div>
               </div>
            )}

            <Fancybox
               options={{
                  Carousel: {
                     infinite: false,
                  },
               }}
            >
               <div className="mt-2 h-[485px] flex flex-col justify-end overflow-hidden">
                  {empty && messages.length == 0 && (
                     <div className="mb-10 flex flex-col items-center">
                        <div className="relative overflow-hidden w-1/5 aspect-square mb-2 opacity-50">
                           <Image
                              src={vectorChat}
                              alt="img"
                              layout="fill"
                              className="object-cover"
                           />
                        </div>
                     </div>
                  )}
                  <div className="flex flex-col-reverse space-y-1 h-fit overflow-auto pr-2 pl-0">
                     <div ref={scrollRef}></div>
                     {isSeenCustomer && messages[0]?.owner == 0 && (
                        <div className="text-right text-sm opacity-80 mr-1 italic">
                           {`${infoAgency?.displayName} has seen`}
                        </div>
                     )}
                     {messages.map((message, index) => (
                        <div key={message.id} className="">
                           {message?.owner == 0 ? (
                              <>
                                 <div className="flex justify-end">
                                    {message?.type == "image" ? (
                                       <a
                                          data-fancybox="gallery"
                                          href={message?.message}
                                       >
                                          <img
                                             src={message?.message}
                                             alt="img"
                                             style={{
                                                width: "auto",
                                                height: "160px",
                                             }}
                                             className="rounded-xl bg-gray-300 "
                                          />
                                       </a>
                                    ) : (
                                       <>
                                          <div
                                             className={`text-white p-2 px-4 rounded-3xl bg-primary-color max-w-xl font-medium`}
                                          >
                                             {message?.message}
                                          </div>
                                       </>
                                    )}
                                 </div>
                              </>
                           ) : (
                              <div className="mb-1 flex justify-start">
                                 <div className="flex gap-2 items-end">
                                    {messages[index - 1]?.owner != 1 ? (
                                       <>
                                          <div className="relative overflow-hidden h-8 aspect-square rounded-full border-2 border-primary-color">
                                             <Image
                                                src={infoAgency?.avatar}
                                                alt="img"
                                                layout="fill"
                                                className="object-cover"
                                             />
                                          </div>
                                       </>
                                    ) : (
                                       <div className="w-8"></div>
                                    )}
                                    {message?.type == "image" ? (
                                       <a
                                          data-fancybox="gallery"
                                          href={message?.message}
                                       >
                                          <img
                                             src={message?.message}
                                             alt="img"
                                             style={{
                                                width: "auto",
                                                height: "160px",
                                             }}
                                             className="rounded-xl bg-gray-300 "
                                          />
                                       </a>
                                    ) : (
                                       <>
                                          <div
                                             className={`font-medium p-2 px-4 rounded-3xl bg-secondary-color text-dark-primary max-w-[600px]`}
                                          >
                                             {message?.message}
                                          </div>
                                       </>
                                    )}
                                 </div>
                              </div>
                           )}
                        </div>
                     ))}
                  </div>
               </div>
            </Fancybox>
         </div>

         <form
            className=" row-span-1 grid grid-cols-12 gap-4 items-center mx-3"
            onSubmit={handleSubmit}
         >
            <label
               className={`${
                  selectedImage != undefined && importImage
                     ? "col-span-2 w-4/5"
                     : "col-span-1 w-full"
               } relative overflow-hidden aspect-square rounded-xl cursor-pointer hover:brightness-80 mx-auto`}
               htmlFor="upload-photo"
            >
               {selectedImage != undefined && importImage && (
                  <Image
                     src={URL.createObjectURL(selectedImage)}
                     alt="avatar"
                     layout="fill"
                     className="object-cover"
                  />
               )}

               <div className="text-2xl p-3 bg-gray-300">
                  <BiImageAdd />
               </div>
               <input
                  type="file"
                  name="photo"
                  id="upload-photo"
                  className="hidden disabled:cursor-not-allowed"
                  onChange={imageChange}
                  accept="image/png, image/jpeg"
                  ref={imageUploadRef}
                  disabled={disableButtonInteractive || empty ? true : false}
               />
            </label>
            <div
               className={`${
                  selectedImage != undefined && importImage
                     ? "col-span-8"
                     : "col-span-9"
               } flex flex-col items-center gap-1 justify-center`}
            >
               {progress > 0 && (
                  <Box sx={{ width: "95%" }}>
                     <LinearProgress variant="determinate" value={progress} />
                  </Box>
               )}
               {selectedImage != undefined && importImage ? (
                  <div className="grid grid-cols-2 gap-4 w-full">
                     <label
                        className={`p-3 w-full rounded-xl bg-primary-color text-blue-50 font-semibold hover:shadow-lg hover:shadow-primary-color hover:brightness-90 text-center ${
                           disableButtonInteractive
                              ? "hover:cursor-not-allowed bg-opacity-50"
                              : "cursor-pointer"
                        }`}
                        htmlFor="upload-photo"
                     >
                        Choose other
                     </label>
                     <button
                        className="p-3 w-full rounded-xl cursor-pointer bg-secondary-color text-orange-50 font-semibold hover:shadow-lg hover:shadow-secondary-color hover:brightness-90 disabled:hover:cursor-not-allowed disabled:bg-opacity-50"
                        disabled={disableButtonInteractive ? true : false}
                        onClick={() => {
                           setSelectedImage(undefined);
                           setImportImage(false);
                           imageUploadRef.current.value = null;
                        }}
                     >
                        Cancel
                     </button>
                  </div>
               ) : (
                  <input
                     type="text"
                     className="p-3 rounded-xl h-fit w-full disabled:bg-gray-300 disabled:cursor-not-allowed"
                     value={newMessage}
                     onChange={(e) => setNewMessage(e.target.value)}
                     disabled={selectedImage || empty ? true : false}
                  />
               )}
            </div>
            <button
               type="submit"
               className="col-span-2 p-3 bg-primary-color text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-color hover:brightness-90 flex gap-2 justify-center items-center cursor-not-allowed"
               disabled={empty}
            >
               Send
               <BiPaperPlane className="text-xl" />
            </button>
         </form>
      </>
   );
};
