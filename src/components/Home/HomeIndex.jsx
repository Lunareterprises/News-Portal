"use client";
import React, { useState, useEffect } from "react";
import Header from "../commonUI/Header/Header";
import SideMenu from "@/components/Home/SideMenuCategories";
import LatestNews from "./LatestNews";
import TrendingNews from "./TrendingNews";
import ResponsiveSmalview from "./ResponsiveSmalview";
import HeaderAdd from "./HeaderAdd";
import { listNewsByCategory } from "@/services/newsService";

function HomeIndex() {
  const [news, setNews] = useState([]);

  const fetchNewsForCategory = async (categoryId) => {
    try {
      const response = await listNewsByCategory({ categoryId });
      console.log("categoryId//////.....>",categoryId);
      setNews(response.data);  
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  // Fetch news for the default category "LATEST" when the component mounts
  useEffect(() => {
    fetchNewsForCategory("LATEST");
  }, []);  // Empty dependency array means this runs once when the component is mounted

  return (
    <div className="px-4  md:px-10 lg:px-20 xl:px-32">
      <Header />
      <HeaderAdd />
      <div className="flex flex-col gap-6 lg:flex-row">
        <SideMenu onCategorySelect={fetchNewsForCategory} />
        <div className="hidden lg:flex flex-col gap-6 md:flex-row flex-1">
          <LatestNews news={news} />
          <TrendingNews />
        </div>
      </div>
      <div className="block lg:hidden">
        <ResponsiveSmalview />
      </div>
    </div>
  );
}

export default HomeIndex;
