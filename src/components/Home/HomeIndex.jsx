import React from "react";
import Header from "../commonUI/Header/Header";
import SideMenu from "@/components/Home/SideMenuCategories";
import LatestNews from "./LatestNews";
import TrendingNews from "./TrendingNews";

function HomeIndex() {


  return (
    <div className="w-full">
      <Header />
      <div className="flex flex-col gap-6 lg:flex-row ">
        <SideMenu />
        <div className="flex flex-col gap-6  md:flex-row flex-1 ">
          <LatestNews/>
          <TrendingNews />
        </div>
      </div>
    </div>
  );
}

export default HomeIndex;
