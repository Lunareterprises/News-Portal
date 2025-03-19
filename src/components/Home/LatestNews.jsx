"use client";

import { useEffect, useState } from "react";

const LatestNews = () => {
  const [news, setNews] = useState([]);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("/data/news.json");
        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, []);

  const toggleReadMore = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-full max-w-3xl mx-auto h-screen overflow-hidden mb-10">
      <h2 className="text-2xl font-semibold bg-[#2872AF] text-white py-2 px-6 w-full sticky top-0  hidden lg:block">
        Latest News
      </h2>

      <div className="h-full overflow-y-auto py-4 scrollbar-hide">
        {news.map((article) => {
          const isExpanded = expanded[article.id];
          const shortText = article.description.substring(0, 250);
          const fadedText = article.description.substring(250, 550);
          const remainingText = article.description.substring(550);

          return (
            <div key={article.id} className="mb-6 relative">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-56 object-cover"
              />
              <h3 className="text-xl font-semibold mt-3">{article.title}</h3>

              <p className="text-gray-700 text-sm mt-4 leading-relaxed relative">
                {shortText}
                {!isExpanded && (
                  <span className=" text-gray-300">
                    {fadedText}
                    <span className="absolute left-0 right-0 bottom-0 w-full  h-24 flex items-center justify-center">
                      <button
                        onClick={() => toggleReadMore(article.id)}
                        className="bg-[#2872AF] font-medium text-white px-4 py-1 cursor-pointer whitespace-nowrap"
                      >
                        Read More
                      </button>
                    </span>
                  </span>
                )}
                {isExpanded && remainingText}
              </p>

              {isExpanded && (
                
                <button
                  onClick={() => toggleReadMore(article.id)}
                  className="bg-[#ff773a] font-medium   text-white px-4 py-1 block mb-10 cursor-pointer mt-6"
                >
                  Read Less
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LatestNews;
