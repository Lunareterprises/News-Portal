"use client";
import { useEffect, useState } from "react";
import Carousel_component from "./Carousel_component";
import AdsComponent from "./AdsComponent";
import { listNews } from "@/services/newsService";
import DOMPurify from "dompurify";
import SharePopup from "./SharePopup";
import { FiShare2 } from "react-icons/fi";

const TrendingNews = () => {
  const [expanded, setExpanded] = useState({});
  const [news, setNews] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeShare, setActiveShare] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);

        const dataNews = {
          categoryId: "",
        };

        const response = await listNews(dataNews);
        const data = response.data;
        if (response?.result === true) {
          if (!Array.isArray(data)) console.log("Invalid news data format");

          const filteredNews = data.filter(
            (article) =>
              article?.displayOn === "trending-news" ||
              article?.displayOn === "both"
          );
          setNews(filteredNews);
          setError(null); // Clear any previous error
        } else {
          console.log(response.message);
        }
      } catch (err) {
        console.error("Error fetching news:", err);
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
    <div className="w-full max-w-3xl mx-auto h-screen overflow-auto scrollbar-hide mb-10">
      <AdsComponent />

      <div className="hidden lg:block">
        <Carousel_component />
      </div>

      <h2 className="text-2xl font-semibold bg-[#2872AF] text-white py-2 px-6 w-full sticky top-0 hidden lg:block z-10">
        Trending & Breaking News
      </h2>

      {error && (
        <div className="text-red-600 bg-red-100 p-4 my-4 rounded">{error}</div>
      )}

      <div className="h-full overflow-y-auto py-4 scrollbar-hide">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
          </div>
        ) : Array.isArray(news) && news?.length > 0 ? (
          news.map((article) => {
            const isExpanded = expanded[article.id];
            const rawContent = article.content || "";

            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = rawContent;
            const plainText = tempDiv.textContent || tempDiv.innerText || "";
            const shortText = plainText.substring(0, 250);
            const showReadMore = plainText?.length > 250;

            const fallbackImage = `${process.env.NEXT_PUBLIC_API_URL}/${article.image}`;

            return (
              <div key={article.id} className="mb-6 relative">
                <img
                  src={fallbackImage}
                  alt={article.heading}
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-news-image.jpg"; // fallback image
                    console.warn("Image failed to load:", fallbackImage);
                  }}
                />
                <h3 className="text-xl font-semibold mt-3">
                  {article.heading}
                </h3>

                <div className="text-gray-700 text-sm mt-4 leading-relaxed relative">
                  {!isExpanded ? (
                    <>
                      <p>{shortText}...</p>
                      {showReadMore && (
                        <div className="absolute left-0 right-0 bottom-0 w-full h-24 flex items-center justify-center bg-gradient-to-t from-white via-white/80 to-transparent">
                          <button
                            onClick={() => toggleReadMore(article.id)}
                            className="bg-[#2872AF] font-medium text-white px-4 py-1 cursor-pointer whitespace-nowrap"
                          >
                            Read More
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(rawContent, {
                          ALLOWED_ATTR: ["style", "class", "id"],
                          ALLOWED_TAGS: [
                            "*",
                            "b",
                            "i",
                            "u",
                            "a",
                            "img",
                            "p",
                            "h1",
                            "h2",
                            "h3",
                            "h4",
                            "h5",
                            "h6",
                            "strong",
                            "em",
                          ],
                        }),
                      }}
                    />
                  )}
                </div>

                {isExpanded && (
                  <button
                    onClick={() => toggleReadMore(article.id)}
                    className="bg-[#ff773a] font-medium text-white px-4 py-1 block mb-10 cursor-pointer mt-6"
                  >
                    Read Less
                  </button>
                )}

                <div className="relative group flex justify-end">
                  <button
                    onClick={() =>
                      setActiveShare((prev) => (prev === article.id ? null : article.id))
                    }
                    className="ml-4 mt-2 px-3 py-1 rounded cursor-pointer"
                  >
                    <FiShare2 />
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
