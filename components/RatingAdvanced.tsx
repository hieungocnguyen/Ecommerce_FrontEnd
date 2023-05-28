import Rating from "@mui/material/Rating";
import dynamic from "next/dynamic";
import React from "react";
import { AiFillStar } from "react-icons/ai";

const RatingAdvanced = ({ statComment, commentCount, starAvg }) => {
   return (
      <div className=" mx-20 grid grid-cols-3 gap-10">
         <div className="border-r-2 border-gray-500">
            <div className="font-medium mb-2 opacity-80">Average rating</div>
            <div className="text-6xl font-extrabold">
               {starAvg.toFixed(1)}/5
            </div>

            <div className="mt-4">
               <Rating
                  size="large"
                  sx={{
                     "& .MuiRating-iconFilled": {
                        color: "#ffab00",
                     },
                     "& .MuiRating-iconEmpty": {
                        color: "#ffab00",
                     },
                  }}
                  name="half-rating-read"
                  precision={0.1}
                  // value={3.6}
                  value={starAvg}
                  readOnly
               />
               <div className="text-sm font-medium">
                  {commentCount}Review(s)
               </div>
            </div>
         </div>
         <div className="col-span-2">
            {statComment.map((stat) => (
               <div key={stat.id}>
                  <div className="flex items-center mt-2">
                     <span className=" font-semibold flex items-center">
                        {stat[0]}{" "}
                        <AiFillStar className="text-xl text-secondary-color" />
                     </span>
                     <div className="w-4/5 h-3 mx-4 bg-primary-color bg-opacity-20 rounded-full">
                        {/* <div
                           className={`h-3 bg-secondary-color rounded-full`}
                           style={{
                              width: `${(
                                 (stat[1] / commentCount) *
                                 100
                              ).toFixed(0)}`,
                           }}
                        ></div> */}
                        <div
                           className={`h-3 bg-primary-color rounded-full`}
                           style={{
                              width: `${(
                                 (stat[1] / commentCount) *
                                 100
                              ).toFixed(1)}%`,
                           }}
                        ></div>
                     </div>
                     <span className=" font-semibold">
                        {((stat[1] / commentCount) * 100).toFixed(1)}%
                     </span>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
};

// export default RatingAdvanced;
export default dynamic(() => Promise.resolve(RatingAdvanced), { ssr: false });
