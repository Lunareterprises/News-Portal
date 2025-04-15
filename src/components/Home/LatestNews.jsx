"use client";

import { getads, listNews } from "@/services/newsService";
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";

// const LatestNews = ({news}) => {
const LatestNews = () => {
  const [news, setNews] = useState([]);
  const [ads, setAds] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [loadedImages, setLoadedImages] = useState({});

  const [hiddenAds, setHiddenAds] = useState({});
  const [newsError, setNewsError] = useState(null);  // Track news fetch errors

  const handleCloseAd = (index) => {
    setHiddenAds((prev) => ({ ...prev, [index]: true }));
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await listNews();
        if (response?.data) {
          const filteredNews = response.data.filter(
            (article) =>
              article.displayOn === "latest-news" || article.displayOn === "both"
          );
          setNews(filteredNews);
        } else {
          throw new Error("News data is empty or malformed");
        }
      } catch (error) {
        console.error("Error fetching news:", error);
        setNewsError("Failed to load news. Please try again later.");
      }
    };
    const fetchAds = async () => {
      try {
        const response = await getads();
        if (response?.data) {
          setAds(response.data);
        } else {
          throw new Error("Ads data is empty or malformed");
        }
      } catch (error) {
        console.error("Error fetching ads:", error);
        setNewsError("Failed to load ads. Please try again later.");
      }
    };

    fetchNews();
    fetchAds();
  }, []);

  const addWatermark = (imageSrc, id) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);
        ctx.font = `${img.width / 15}px Arial`;
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(-Math.PI / 6);
        ctx.fillText("World One", 0, 0);
        ctx.restore();

        const watermarkedImage = canvas.toDataURL("image/jpeg");
        setLoadedImages((prev) => ({
          ...prev,
          [`news-${id}`]: watermarkedImage,
        }));
        resolve(watermarkedImage);
      };

      img.onerror = () => {
        console.error("Error loading image for watermarking");
        resolve(imageSrc); // Fallback to the original image
      };

      img.src = imageSrc;
    });
  };

  useEffect(() => {
    if (Array.isArray(news)) {
      news.forEach((article) => {
        if (
          `${process.env.NEXT_PUBLIC_API_URL}/${article.image}` &&
          !loadedImages[`news-${article.id}`]
        ) {
          addWatermark(
            `${process.env.NEXT_PUBLIC_API_URL}/${article.image}`,
            article.id
          );
        }
      });
    }
  }, [news]);

  const toggleReadMore = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const sliceHtmlByTextLength = (html, start, end) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    const slicedText = text.substring(start, end);

    if (!slicedText) return "";

    const index = text.indexOf(slicedText);
    if (index === -1) return "";

    const cleanedHtml = DOMPurify.sanitize(tempDiv.innerHTML, {
      ALLOWED_ATTR: ['style', 'class', 'id'],
      ALLOWED_TAGS: ['*', 'b', 'i', 'u', 'a', 'img', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em'],
    });

    const span = document.createElement("span");
    span.innerHTML = cleanedHtml;
    return span.innerHTML;
  };

 

  return (
    <div className="w-full max-w-3xl mx-auto h-screen overflow-hidden mb-10">
      <h2 className="text-2xl font-semibold bg-[#2872AF] text-white py-2 px-6 w-full sticky top-0 hidden lg:block">
        Latest News
      </h2>
      {newsError && (
        <div className="text-red-600 bg-red-100 p-4 my-4 rounded">
          {newsError}
        </div>
      )}
      <div className="h-full overflow-y-auto py-4 scrollbar-hide">
        {Array.isArray(news) &&
          news.map((article, index) => {
            const isExpanded = expanded[article.id];
            const rawContent = article.content || "";

            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = rawContent;
            const plainText = tempDiv.textContent || tempDiv.innerText || "";
            const shortText = plainText.substring(0, 250);
            const showReadMore = plainText.length > 250;
            
            const imageKey = `news-${article.id}`;

            return (
              <div key={article.id} className="mb-6 relative">
                <div className="relative">
                  <img
                    src={loadedImages[imageKey] || `${process.env.NEXT_PUBLIC_API_URL}/${article.image}`}
                    alt={article.title}
                    className="w-full h-56 object-cover"
                    onError={(e) => e.target.src = '/path/to/fallback-image.jpg'} // Error fallback image
                  />
                </div>
                <h3 className="text-xl font-semibold mt-3">{article.heading}</h3>

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
                          ALLOWED_ATTR: ['style', 'class', 'id'],
                          ALLOWED_TAGS: ['*', 'b', 'i', 'u', 'a', 'img', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em'],
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

                {index % 2 === 1 && ads.length > 0 && !hiddenAds[index] && (
                  <div className="my-6 w-full relative flex justify-center">
                    <button
                      onClick={() => handleCloseAd(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 text-sm flex items-center justify-center z-10"
                      aria-label="Close ad"
                    >
                      ✕
                    </button>
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}/${ads[index % ads.length]?.ads_image}`}
                      alt={ads[index % ads.length]?.ads_name || "Advertisement"}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default LatestNews;
