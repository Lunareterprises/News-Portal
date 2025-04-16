"use client";

import { useState, useEffect } from "react";
import Carousel from "./Carousel_component";
import LatestNews from "./LatestNews";
import TrendingNews from "./TrendingNews";

function ResponsiveSmalview({news, newsError}) {
  const [activeTab, setActiveTab] = useState("latest");


  return (
    <div>
      <div className="flex flex-col gap-6 md:flex-row flex-1 mt-6">
        <Carousel />
      </div>

      <div className="sticky top-24 bg-[#F5F5F5] z-40 ">
        <div className="flex gap-4 py-3 tracking-wide">
          <button
            className={`px-4 py-2 text-sm whitespace-nowrap font-normal ${
              activeTab === "latest" ? " bg-[#2872AF] text-white py-2 px-6" : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("latest")}
          >
            Latest News
          </button>
          <button
            className={`px-4 py-2 text-sm whitespace-nowrap font-normal ${
              activeTab === "trending" ? " bg-[#2872AF] text-white  px-6" : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("trending")}
          >
            Trending  News
          </button>
        </div>
      </div>

      <div className="mt-4">
        {activeTab === "latest" ? <LatestNews news={news} newsError={newsError}/> : <TrendingNews />}
      </div>
    </div>
  );
}

export default ResponsiveSmalview;
