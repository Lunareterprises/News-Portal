"use client";
import React, { useState, useEffect } from "react";
import Header from "../commonUI/Header/Header";
import SideMenu from "@/components/Home/SideMenuCategories";
import LatestNews from "./LatestNews";
import TrendingNews from "./TrendingNews";
import ResponsiveSmalview from "./ResponsiveSmalview";
import HeaderAdd from "./HeaderAdd";
import { listNewsByCategory } from "@/services/newsService";
// import BreakingNewsBanner from "./BreakingNewsBanner";
import Footer from "../commonUI/Footer/Footer";
import YouTubeCarousel from "./YouTubeCarousel";
import Gallery from "./Gallery";
import AdBanner from "../adSense/AdBanner";

function HomeIndex() {
  const [news, setNews] = useState([]);
  const [newsError, setNewsError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState("Latest News");


  
  const fetchNewsForCategory = async (categoryId, categoryName = "Latest News") => {
    try {
      setLoading(true);
      const response = await listNewsByCategory({ categoryId });
  
      if (response?.result === true) {
        const filteredNews = response?.data.filter(
          (article) => article?.displayOn === "latest-news" || article?.displayOn === "both"
        );
        setNews(filteredNews);
      } else {
        setNews("");
        console.log("News data is empty or malformed");
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
      setSelectedCategoryName(categoryName); // 🛑 Update the category name here
    }
  };
  

  useEffect(() => {
    fetchNewsForCategory("");
  }, []); 

  return (
    <div>
      <div className="px-4  md:px-10 lg:px-20 xl:px-32">
      {/* <AdBanner /> */}
      <Header />
      <HeaderAdd />
      <div className="flex flex-col  lg:flex-col">
        <div className="flex gap-6 lg:flex-row">
        <SideMenu onCategorySelect={(categoryId, categoryName) => fetchNewsForCategory(categoryId, categoryName)} />

          <div className="hidden lg:flex flex-col gap-6 md:flex-row ">
            <div className="flex flex-col w-full  h-[150vh] ">
              {/* <BreakingNewsBanner /> */}
              <LatestNews news={news} newsError={newsError} loading={loading} selectedCategoryName={selectedCategoryName} />

            </div>
            <div className="w-2/4 ">
              <TrendingNews  height="1000px"/>
            </div>
          </div>
        </div>
        <div className="hidden lg:block">
          <YouTubeCarousel />
          <Gallery />
        </div>
      </div>

      <div className="block lg:hidden">
        <ResponsiveSmalview news={news} newsError={newsError} selectedCategoryName={selectedCategoryName}/>
      </div>
      {/* <Footer /> */}
    </div>
    
    </div>
  );
}

export default HomeIndex;
