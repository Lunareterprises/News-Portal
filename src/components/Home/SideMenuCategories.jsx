"use client";

import { listCategory, listNews, listNewsByCategory } from "@/services/newsService";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const districtsInKerala = [
  { id: "THIRUVANANTHAPURAM", name: "Thiruvananthapuram" },
  { id: "KOLLAM", name: "Kollam" },
  { id: "PATHANAMTHITTA", name: "Pathanamthitta" },
  { id: "ALAPPUZHA", name: "Alappuzha" },
  { id: "KOTTAYAM", name: "Kottayam" },
  { id: "IDUKKI", name: "Idukki" },
  { id: "ERNAKULAM", name: "Ernakulam" },
  { id: "THRISSUR", name: "Thrissur" },
  { id: "PALAKKAD", name: "Palakkad" },
  { id: "MALAPPURAM", name: "Malappuram" },
  { id: "KOZHIKODE", name: "Kozhikode" },
  { id: "WAYANAD", name: "Wayanad" },
  { id: "KANNUR", name: "Kannur" },
  { id: "KASARAGOD", name: "Kasaragod" },
];

const newsFrom = [
  { id: "KERALA_NEWS", name: "Kerala News" },
  { id: "INDIA_NEWS", name: "India News" },
  { id: "WORLD_NEWS", name: "World News" },
];

const SideMenuCategories = ({onCategorySelect}) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({
    id: "LATEST",
    name: "Latest News",
  });
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isNewsOpen, setIsNewsOpen] = useState(false);
  const [isDistrictOpen, setIsDistrictOpen] = useState(false);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await listCategory();
        setCategories(response.data);

        
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

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

  const isSelected = (item) => selectedCategory?.name === item.name;

  // Function to handle category selection and trigger the backend call
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    onCategorySelect(category.id); // Passing category id to parent component
    setIsNewsOpen(false);
    setIsDistrictOpen(false);
  };

  // // Example backend call with category ID
  // const fetchCategoryData = async (categoryId) => {
  //   try {
  //     const response = await listNewsByCategory({ categoryId: categoryId });
  //     const data = response.data;
  //     console.log("Fetched data:", data);
  //   } catch (error) {
  //     console.error("Error fetching data for category:", categoryId, error);
  //   }
  // };

  return (
    <>
      {/* Sidebar */}
      <div className="w-1/5 min-w-[250px] bg-white h-screen hidden lg:block">
        <ul className="space-y-2 overflow-y-auto max-h-[calc(100vh)] scrollbar-hide scroll-smooth">
          {/* Latest News */}
          <li
            className={`flex text-sm items-center gap-3 px-6 py-2 cursor-pointer ${
              selectedCategory.name === "Latest News"
                ? "bg-[#2872AF] text-white"
                : "hover:text-blue-500"
            }`}
            onClick={() => handleCategorySelect({ id: "LATEST", name: "Latest News" })}
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
          <li className="flex flex-col text-sm">
            <div
              className={`flex justify-between w-full px-6 py-2 items-center cursor-pointer ${
                newsFrom.some((item) => isSelected(item)) ? "bg-[#2872AF] text-white" : ""
              }`}
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
                <span>
                  {newsFrom.some((item) => isSelected(item)) ? selectedCategory.name : "News"}
                </span>
              </div>
              <span className="text-[12px]">{isNewsOpen ? "▲" : "▼"}</span>
            </div>
            {isNewsOpen && (
              <ul className="pl-10 space-y-2 mt-2">
                {newsFrom.map((item) => (
                  <li
                    key={item.id}
                    className={`cursor-pointer py-1 px-2 ${
                      isSelected(item) ? "bg-[#2872AF] text-white" : "hover:text-[#2872AF]"
                    }`}
                    onClick={() => handleCategorySelect(item)}
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            )}
          </li>

          {/* District Dropdown */}
          <li className="flex flex-col text-sm">
            <div
              className={`flex justify-between w-full items-center cursor-pointer px-6 py-2 ${
                districtsInKerala.some((item) => isSelected(item)) ? "bg-[#2872AF] text-white" : ""
              }`}
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
                <span>
                  {districtsInKerala.some((item) => isSelected(item))
                    ? selectedCategory.name
                    : "District News"}
                </span>
              </div>
              <span className="text-[12px]">{isDistrictOpen ? "▲" : "▼"}</span>
            </div>
            {isDistrictOpen && (
              <ul className="pl-10 space-y-2 mt-2">
                {districtsInKerala.map((item) => (
                  <li
                    key={item.id}
                    className={`cursor-pointer py-1 px-2 ${
                      isSelected(item) ? "bg-[#2872AF] text-white" : "hover:text-[#2872AF]"
                    }`}
                    onClick={() => handleCategorySelect(item)}
                  >
                    {item.name}
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
                selectedCategory.name === category.name
                  ? "bg-[#2872AF] text-white"
                  : "hover:text-blue-500"
              }`}
              onClick={() => handleCategorySelect({ id: category.id, name: category.name })}
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}/${category.image}`}
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

      {/* Mobile Scrollable Menu */}
      <div
        ref={scrollContainerRef}
        className="tracking-wide lg:hidden w-full flex items-center overflow-x-scroll h-10 overflow-y-hidden relative text-sm whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
      >
        {/* Latest News */}
        <button
          className={`px-4 py-2 whitespace-nowrap ${
            selectedCategory.name === "Latest News"
              ? "text-[#2872AF] font-semibold"
              : "bg-gray-100"
          }`}
          onClick={() => handleCategorySelect({ id: "LATEST", name: "Latest News" })}
        >
          Latest News
        </button>

        {/* News Dropdown */}
        <div className="relative inline-flex dropdown-menu">
          <button
            className={`px-4 py-2 flex items-center whitespace-nowrap ${
              newsFrom.some((item) => isSelected(item))
                ? "text-[#2872AF] font-semibold"
                : "bg-gray-100"
            }`}
            onClick={() => setIsNewsOpen(!isNewsOpen)}
          >
            {newsFrom.some((item) => isSelected(item))
              ? selectedCategory.name
              : "News"}
            <span className="ml-2 text-[12px]">{isNewsOpen ? "▲" : "▼"}</span>
          </button>
          {isNewsOpen && (
            <ul className="fixed left-0 top-12 w-40 bg-white shadow-md z-50 border border-gray-200">
              {newsFrom.map((item) => (
                <li
                  key={item.id}
                  className={`cursor-pointer py-2 px-4 ${
                    isSelected(item)
                      ? "text-[#2872AF] font-semibold"
                      : "hover:bg-gray-200"
                  }`}
                  onClick={() => handleCategorySelect(item)}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* District Dropdown */}
        <div className="relative inline-flex dropdown-menu">
          <button
            className={`px-4 py-2 flex items-center whitespace-nowrap ${
              districtsInKerala.some((item) => isSelected(item))
                ? "text-[#2872AF] font-semibold"
                : "bg-gray-100"
            }`}
            onClick={() => setIsDistrictOpen(!isDistrictOpen)}
          >
            {districtsInKerala.some((item) => isSelected(item))
              ? selectedCategory.name
              : "District News"}
            <span className="ml-2 text-[12px]">{isDistrictOpen ? "▲" : "▼"}</span>
          </button>
          {isDistrictOpen && (
            <ul className="fixed left-0 top-12 w-40 bg-white shadow-md z-50 border border-gray-200">
              {districtsInKerala.map((item) => (
                <li
                  key={item.id}
                  className={`cursor-pointer py-2 px-4 ${
                    isSelected(item)
                      ? "text-[#2872AF] font-semibold"
                      : "hover:bg-gray-200"
                  }`}
                  onClick={() => handleCategorySelect(item)}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Dynamic Categories */}
        {categories.map((category) => (
          <button
            key={category.id}
            className={`px-4 py-2 whitespace-nowrap ${
              selectedCategory.name === category.name
                ? "text-[#2872AF] font-semibold"
                : "bg-gray-100"
            }`}
            onClick={() => handleCategorySelect({ id: category.id, name: category.name })}
          >
            {category.name}
          </button>
        ))}
      </div>
    </>
  );
};

export default SideMenuCategories;
