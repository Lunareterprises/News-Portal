"use client";
import { useEffect, useState } from "react";
import Carousel_component from "./Carousel_component";
import AdsComponent from "./AdsComponent";
import { listNews } from "@/services/newsService";
import DOMPurify from "dompurify";
import SharePopup from "./SharePopup";
import Image from "next/image";
import formatDate from '@/utils/formatDate'; // adjust the path based on your project structure

const TrendingNews = ({ height  }) => {
  const [expanded, setExpanded] = useState({});
  const [news, setNews] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeShare, setActiveShare] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);

        const response = await listNews({ categoryId: "" });
        const data = response.data;

        if (response?.result === true) {
          if (!Array.isArray(data)) {
            console.log("Invalid news data format");
            return;
          }

          const filteredNews = data.filter(
            (article) =>
              article?.displayOn === "trending-news" ||
              article?.displayOn === "both"
          );
          setNews(filteredNews);
          setError(null);
        } else {
          console.log(response.message);
        }
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Something went wrong while fetching news.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const toggleReadMore = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
     <div
        className="w-full mx-auto overflow-auto scrollbar-hide mb-10"
        style={{ height }}
     >
      <AdsComponent />

      <div className="hidden lg:block">
        <Carousel_component />
      </div>

      <h2 className="text-2xl font-semibold bg-[#2872AF] text-white py-2 px-6 w-full sticky top-0 hidden lg:block z-10">
        Trending News
      </h2>

      {error && (
        <div className="text-red-600 bg-red-100 p-4 my-4 rounded">{error}</div>
      )}

      <div className="h-full overflow-y-auto py-4 scrollbar-hide">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
          </div>
        ) : Array.isArray(news) && news.length > 0 ? (
          news.map((article) => {
            const isExpanded = expanded[article.id];
            const rawContent = article.content || "";
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = rawContent;
            const plainText = tempDiv.textContent || tempDiv.innerText || "";
            const shortText = plainText.substring(0, 30);
            const fallbackImage = `${process.env.NEXT_PUBLIC_API_URL}/${article.image}`;

            return (
              <div
                key={article.id}
                className="mb-4 p-2 border border-gray-200 rounded-md shadow-sm bg-white"
              >
                <div className="flex flex-row gap-6 items-start">
                  <Image 
                    width={100}
                    height={100}
                    src={fallbackImage}
                    alt={article.heading}
                    className="w-28 h-28 object-contain rounded-md"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default-news-image.jpg";
                    }}
                  />

                  <div className="flex flex-col gap-2">
                    <a
                      href={`https://www.worldonetv.in/news/${article.id}`}
                      className="text-xs font-semibold text-gray-900 hover:text-[#2872AF]"
                    >
                      {article.heading}
                    </a>

                    <div className="text-gray-700 text-xs leading-relaxed relative w-full">
                    <p>{shortText}...</p>
                    </div>

                    {isExpanded && (
                      <button
                        onClick={() => toggleReadMore(article.id)}
                        className="bg-[#ff773a] font-medium text-white px-4 py-1 mt-2"
                      >
                        Read Less
                      </button>
                    )}
                  </div>
                </div>

                <div className="relative group flex justify-between items-center mt-3">
                  <p className="flex items-center gap-2 text-[#787878] text-xs">
                    <Image
                      src="/images/categories/Group56.png"
                      width={18}
                      height={18}
                      alt="time"
                    />
                    {formatDate(article.updated_at)}
                  </p>

                  <button
                    onClick={() =>
                      setActiveShare((prev) =>
                        prev === article.id ? null : article.id
                      )
                    }
                    className="ml-4 px-3 py-1 rounded cursor-pointer"
                  >
                    <Image
                      src="/images/categories/Vector.png"
                      width={15}
                      height={25}
                      alt="news share"
                    />
                  </button>

                  <div className="absolute whitespace-nowrap bottom-full mb-1 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded">
                    Share this News
                  </div>

                  {activeShare === article.id && (
                    <SharePopup
                      url={`https://www.worldonetv.in/news/${article.id}`}
                      headline={article.heading}
                      onClose={() => setActiveShare(null)}
                    />
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-500 py-10 text-base">
            No Trending News Available
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendingNews;
