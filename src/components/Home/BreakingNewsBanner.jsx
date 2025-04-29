"use client";
import React, { useState, useEffect } from "react";
// import { listNewsByCategory } from "@/your/api/path"; // make sure this is correct

const BreakingNewsBanner = () => {
//   const [breakingNews, setBreakingNews] = useState([]);

//   const fetchBreakingNews = async () => {
//     try {
//       const response = await listNewsByCategory({ categoryId: "breaking" });

//       if (response?.result === true) {
//         const filteredBreaking = response.data.filter(
//           (article) =>
//             article?.displayOn === "breaking-news" || article?.displayOn === "both"
//         );
//         setBreakingNews(filteredBreaking);
//       } else {
//         setBreakingNews([]);
//       }
//     } catch (error) {
//       console.error("Error fetching breaking news:", error);
//       setBreakingNews([]);
//     }
//   };

//   useEffect(() => {
//     fetchBreakingNews();
//   }, []);

//   if (!breakingNews || breakingNews.length === 0) return null;

  return (
    <div className=" text-white  rounded mb-4 ">
      <img
        src="/images/categories/breakingNews.jpg" 
        alt="Breaking News"
        className="w-full h-auto inline-block mr-2"
      />
      {/* <h2 className="font-bold inline-block align-middle">Breaking News:</h2> */}

      {/* <ul className="list-disc ml-5 mt-2">
        {breakingNews.map((newsItem) => (
          <li key={newsItem.id}>{newsItem.title}</li>
        ))}
      </ul> */}
    </div>
  );
};

export default BreakingNewsBanner;
