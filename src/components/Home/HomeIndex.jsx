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
  const [newsError, setNewsError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchNewsForCategory = async (categoryId) => {
    try {
      setLoading(true);
      const response = await listNewsByCategory({ categoryId });
      console.log("response--->>", response);
      
      if (response?.data) {
        const filteredNews = response.data.filter(
          (article) =>    
            // console.log("article.....................",article)        
            article.displayOn === "latest-news" || article.displayOn === "both"
        );
        console.log("filteredNews--->>",filteredNews);
        
        setNews(filteredNews);
      } else {
        throw new Error("News data is empty or malformed");
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      setNewsError("Failed to load news. Please try again later.");
    } finally {
      setLoading(false); // stop loader
    }
  };
  

  // Fetch news for the default category "LATEST" when the component mounts
  useEffect(() => {
    fetchNewsForCategory("");
  }, []); // Empty dependency array means this runs once when the component is mounted

  return (
    <div className="px-4  md:px-10 lg:px-20 xl:px-32">
      <Header />
      <HeaderAdd />
      <div className="flex flex-col gap-6 lg:flex-row">
        <SideMenu onCategorySelect={fetchNewsForCategory} />
        <div className="hidden lg:flex flex-col gap-6 md:flex-row flex-1">
          <LatestNews news={news} newsError={newsError} loading={loading} />
          <TrendingNews />
        </div>
      </div>
      <div className="block lg:hidden">
        <ResponsiveSmalview news={news} newsError={newsError}/>
      </div>
    </div>
  );
}

export default HomeIndex;
