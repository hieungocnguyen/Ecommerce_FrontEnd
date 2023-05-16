import { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import API, { endpoints } from "../API";
import Image from "next/image";
import router from "next/router";
import { BiArrowBack } from "react-icons/bi";
import emptyBox from "../public/empty-box.png";
import AgencyCard from "../components/AgencyCard";

const AllAgency = () => {
   const [keyword, setKeyWord] = useState("");
   const [agencyList, setAgencyList] = useState([]);
   const [numberPage, setNumberPage] = useState(1);
   const [totalPage, setTotalPage] = useState(1);

   const fetchAgencies = async () => {
      try {
         const res = await API.post(endpoints["search_agency"], {
            kw: keyword,
            page: numberPage,
         });
         setAgencyList(res.data.data.listResult);
         setTotalPage(res.data.data.totalPage);
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      fetchAgencies();
   }, [numberPage]);

   const handleRouteAgency = (agencyID) => {
      router.push(`/agencyinfo/${agencyID}`);
   };

   return (
      <Layout title="All merchant">
         <div className="my-6">
            <div className="flex gap-4 items-center m-6">
               <div
                  className="bg-primary-color text-white p-3 text-2xl rounded-lg cursor-pointer hover:shadow-lg hover:shadow-primary-color"
                  onClick={() => router.back()}
               >
                  <BiArrowBack />
               </div>
               <div className="font-semibold text-2xl">/ All merchant</div>
            </div>
            <div className="mx-auto mb-8">
               <input
                  type="text"
                  onChange={(e) => setKeyWord(e.target.value)}
                  placeholder="Name merchant..."
                  className="p-4 w-2/3 bg-light-primary dark:bg-dark-primary rounded-lg font-medium"
               />
               <button
                  onClick={() => fetchAgencies()}
                  className="ml-4 px-5 py-4 bg-primary-color text-white font-medium rounded-lg hover:shadow-lg hover:shadow-primary-color transition-all"
               >
                  Search
               </button>
            </div>
            <div className="grid grid-cols-4 gap-8">
               {agencyList ? (
                  agencyList.length > 0 ? (
                     agencyList.map((agency) => (
                        <AgencyCard
                           agency={agency}
                           key={agency.id}
                           likeNumber={undefined}
                        />
                     ))
                  ) : (
                     <>
                        <div className="col-span-4 flex  justify-center items-center">
                           <div className="relative overflow-hidden aspect-square w-1/4 mx-auto">
                              <Image
                                 src={emptyBox}
                                 alt="empty"
                                 layout="fill"
                                 className="object-cover"
                              />
                           </div>
                        </div>
                     </>
                  )
               ) : (
                  <></>
               )}
            </div>
            {/* paginate */}
            <div
               className="flex gap-4
                   justify-center mt-8"
            >
               {totalPage > 1 &&
                  Array.from(Array(totalPage), (e, i) => {
                     return (
                        <div
                           key={i}
                           className={`w-8 h-8 rounded-lg border-2 border-primary-color flex justify-center items-center cursor-pointer paginator font-semibold ${
                              numberPage === i + 1
                                 ? "bg-primary-color text-white"
                                 : ""
                           } `}
                           onClick={(e) => {
                              setNumberPage(i + 1);
                           }}
                        >
                           {i + 1}
                        </div>
                     );
                  })}
            </div>
         </div>
      </Layout>
   );
};

export default AllAgency;
// export const getServerSideProps = async () => {
//    const fetchAllAgency = await API.post(endpoints["search_agency"], {
//       kw: "",
//       page: 0,
//    });
//    const agencyList = fetchAllAgency.data.data.listResult;
//    return { props: { agencyList } };
// };
