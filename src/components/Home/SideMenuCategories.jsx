"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const SideMenuCategories = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Latest News");
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isNewsOpen, setIsNewsOpen] = useState(false);
  const [isDistrictOpen, setIsDistrictOpen] = useState(false);
  const scrollContainerRef = useRef(null);

  const districtsInKerala = [
    "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha",
    "Kottayam", "Idukki", "Ernakulam", "Thrissur", "Palakkad",
    "Malappuram", "Kozhikode", "Wayanad", "Kannur", "Kasaragod",
  ];

  const newsFrom = ["Kerala News", "India News", "World News"]

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/data/categories.json");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Check if content overflows
  useEffect(() => {
    const checkOverflow = () => {
      if (scrollContainerRef.current) {
        setIsOverflowing(
          scrollContainerRef.current.scrollWidth > scrollContainerRef.current.clientWidth
        );
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [categories]);

  console.log("selectedCategory : ",selectedCategory)
  return (
    <>
      {/* Sidebar for large screens */}
      <div className="w-1/5 min-w-[250px] bg-white h-screen hidden lg:block ">
        <ul className="space-y-2 overflow-y-auto max-h-[calc(100vh-50px)] scrollbar-hide scroll-smooth ">
          {/* Latest News */}
          <li
            className={`flex text-sm items-center gap-3 px-6 py-2 cursor-pointer ${
              selectedCategory === "Latest News" ? "bg-[#2872AF] text-white" : "hover:text-blue-500"
            }`}
            onClick={() => setSelectedCategory("Latest News")}
          >
            <Image
              width={32}
              height={32}
              src="/images/categories/images1.png"
              alt="Latest News"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span>Latest News</span>
          </li>


          {/* News Dropdown */}
        <li className="flex flex-col text-sm px-6 py-2">
          <div
            className="flex justify-between w-full items-center cursor-pointer"
            onClick={() => setIsNewsOpen(!isNewsOpen)}
          >
            <div className="flex w-full items-center gap-3">
              <Image
                width={32}
                height={32}
                src="/images/categories/images14.png"
                alt="News"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span>News</span>
            </div>
            <span className="text-[12px]">{isNewsOpen ? "▲" : "▼"}</span>
          </div>
          {isNewsOpen && (
            <ul className="pl-10 space-y-2 mt-2">
              {["Kerala", "India", "World News"].map((item) => (
                <li
                  key={item}
                  className={`cursor-pointer py-1 px-2  ${
                    selectedCategory === item ? "bg-[#2872AF] text-white" : "hover:text-blue-500"
                  }`}
                  onClick={() => setSelectedCategory(item)}
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </li>

        {/* District News Dropdown */}
        <li className="flex flex-col text-sm px-6 py-2">
          <div
            className="flex justify-between w-full items-center cursor-pointer"
            onClick={() => setIsDistrictOpen(!isDistrictOpen)}
          >
            <div className="flex w-full items-center gap-3">
              <Image
                width={32}
                height={32}
                src="/images/categories/images15.png"
                alt="District News"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span>District News</span>
            </div>
            <span className="text-[12px]">{isDistrictOpen ? "▲" : "▼"}</span>
          </div>
          {isDistrictOpen && (
            <ul className="pl-10 space-y-2 mt-2">
              {districtsInKerala.map((district) => (
                <li
                  key={district}
                  className={`cursor-pointer py-1 px-2  ${
                    selectedCategory === district ? "bg-[#2872AF] text-white" : "hover:text-blue-500"
                  }`}
                  onClick={() => setSelectedCategory(district)}
                >
                  {district}
                </li>
              ))}
            </ul>
          )}
        </li>


          {/* Dynamic Categories */}
          {categories.map((category) => (
            <li
              key={category.id}
              className={`flex text-sm items-center gap-3 px-6 py-2 cursor-pointer ${
                selectedCategory === category.name ? "bg-[#2872AF] text-white" : "hover:text-blue-500"
              }`}
              onClick={() => setSelectedCategory(category.name)}
            >
              <Image
                src={category.image}
                width={32}
                height={32}
                alt={category.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span>{category.name}</span>
            </li>
          ))}
        </ul>
      </div>

      
      {/* Horizontal Scrollable Navbar for Mobile */}
      
      <div
      ref={scrollContainerRef}
      className="tracking-wide lg:hidden w-full flex items-center overflow-x-scroll h-10 overflow-y-hidden relative text-sm whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
    >
      {/* Latest News */}
      <button
        className={`px-4 py-2 whitespace-nowrap ${
          selectedCategory === "Latest News"
            ? "text-[#2872AF] font-semibold"
            : "bg-gray-100"
        }`}
        onClick={() => setSelectedCategory("Latest News")}
      >
        {selectedCategory === "Latest News" ? "Latest News" : "Latest News"}
      </button>

      {/* News Dropdown */}

      <div className="relative inline-flex dropdown-menu">
        <button
          className={`px-4 py-2 flex items-center whitespace-nowrap ${
            newsFrom.includes(selectedCategory) ? "text-[#2872AF] font-semibold" : "bg-gray-100"
          }`}
          onClick={() => setIsNewsOpen(!isNewsOpen)}
        >
          {newsFrom.includes(selectedCategory) ? selectedCategory : "News"}
          <span className="ml-2 text-[12px]">{isNewsOpen ? "▲" : "▼"}</span>
        </button>
        {isNewsOpen && (
          <ul className="fixed left-0 top-12 w-40 bg-white shadow-md z-50 border border-gray-200">
            {newsFrom.map((district) => (
              <li
                key={district}
                className={`cursor-pointer py-2 px-4 ${
                  selectedCategory === district ? "text-[#2872AF] font-semibold" : "hover:bg-gray-200"
                }`}
                onClick={() => {
                  setSelectedCategory(district);
                  setIsNewsOpen(false);
                }}
              >
                {district}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* District News Dropdown */}
      <div className="relative inline-flex dropdown-menu">
        <button
          className={`px-4 py-2 flex items-center whitespace-nowrap ${
            districtsInKerala.includes(selectedCategory) ? "text-[#2872AF] font-semibold" : "bg-gray-100"
          }`}
          onClick={() => setIsDistrictOpen(!isDistrictOpen)}
        >
          {districtsInKerala.includes(selectedCategory) ? selectedCategory : "District News"}
          <span className="ml-2 text-[12px]">{isDistrictOpen ? "▲" : "▼"}</span>
        </button>
        {isDistrictOpen && (
          <ul className="fixed left-0 top-12 w-40 bg-white shadow-md z-50 border border-gray-200">
            {districtsInKerala.map((district) => (
              <li
                key={district}
                className={`cursor-pointer py-2 px-4 ${
                  selectedCategory === district ? "text-[#2872AF] font-semibold" : "hover:bg-gray-200"
                }`}
                onClick={() => {
                  setSelectedCategory(district);
                  setIsDistrictOpen(false);
                }}
              >
                {district}
              </li>
            ))}
          </ul>
        )}
      </div>






      {/* Other Categories */}
      {categories.map((category) => (
        <button
          key={category.id}
          className={`px-4 py-2 rounded ${
            selectedCategory === category.name
              ? "text-[#2872AF] font-semibold"
              : "bg-gray-100"
          }`}
          onClick={() => setSelectedCategory(category.name)}
        >
          {selectedCategory === category.name ? ` ${category.name}` : category.name}
        </button>
      ))}

      {/* District Buttons */}
      {districtsInKerala.map((district) => (
        <button
          key={district}
          className={`px-4 py-2 rounded ${
            selectedCategory === district
              ? "text-[#2872AF] font-semibold"
              : "bg-gray-100"
          }`}
          onClick={() => setSelectedCategory(district)}
        >
          {selectedCategory === district ? ` ${district}` : district}
        </button>
      ))}
    </div>
















    </>
  );
};

export default SideMenuCategories;
