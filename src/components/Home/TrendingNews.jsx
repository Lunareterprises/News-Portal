"use client";
import { useEffect, useState } from "react";
import Carousel_component from "./Carousel_component";
import AdsComponent from "./AdsComponent";
import { listNews } from "@/services/newsService";
import DOMPurify from "dompurify";

const TrendingNews = () => {
  const [expanded, setExpanded] = useState({});
  const [news, setNews] = useState([]);
  const [loadedImages, setLoadedImages] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {


        const dataNews={
          categoryId:""
        }

        const response = await listNews(dataNews);
        const data = response.data;

        if (!Array.isArray(data)) throw new Error("Invalid news data format");

        const filteredNews = data.filter(
          (article) =>
            article.displayOn === "trending-news" ||
            article.displayOn === "both"
        );
console.log('kfjnjbdknlsm',news);

        setNews(filteredNews);
        setError(null); // Clear any previous error
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Failed to load news. Please try again later.");
      }
    };

    fetchNews();
  }, []);

  const addWatermark = (imageSrc, id) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";

      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          canvas.width = img.width;
          canvas.height = img.height;

          ctx.drawImage(img, 0, 0);

          ctx.font = `${img.width / 20}px Arial`;
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
        } catch (e) {
          console.error("Error applying watermark:", e);
          resolve(imageSrc); // Fallback
        }
      };

      img.onerror = (e) => {
        console.error("Failed to load image for watermarking:", imageSrc, e);
        resolve(imageSrc);
      };

      img.src = imageSrc;
    });
  };

  useEffect(() => {
    if (Array.isArray(news)) {
      news.forEach((article) => {
        const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/${article.image}`;
        const imageKey = `news-${article.id}`;
        if (article.image && !loadedImages[imageKey]) {
          addWatermark(imageUrl, article.id).catch((err) =>
            console.error("Watermark error:", err)
          );
        }
      });
    }
  }, [news]);

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

      {/* Show error if fetch failed */}
      {error && (
        <div className="text-red-600 bg-red-100 p-4 my-4 rounded">
          {error}
        </div>
      )}

      <div className="h-full overflow-y-auto py-4 scrollbar-hide">
       
       
      {Array.isArray(news) && news.length > 0 ? (
  news.map((article) => {
    const isExpanded = expanded[article.id];
    const rawContent = article.content || "";

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = rawContent;
    const plainText = tempDiv.textContent || tempDiv.innerText || "";
    const shortText = plainText.substring(0, 250);
    const showReadMore = plainText.length > 250;

    const imageKey = `news-${article.id}`;
    const fallbackImage = `${process.env.NEXT_PUBLIC_API_URL}/${article.image}`;

    return (
      <div key={article.id} className="mb-6 relative">
        <img
          src={loadedImages[imageKey] || fallbackImage}
          alt={article.heading}
          className="w-full h-56 object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/default-news-image.jpg"; // fallback image
            console.warn("Image failed to load:", fallbackImage);
          }}
        />
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
                  ALLOWED_ATTR: ["style", "class", "id"],
                  ALLOWED_TAGS: ["*", "b", "i", "u", "a", "img", "p", "h1", "h2", "h3", "h4", "h5", "h6", "strong", "em"],
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
      </div>
    );
  })
) : (
  <div className="text-center text-gray-500 py-10 text-lg">
    No Trending News Available
  </div>
)}



      </div>
    </div>
  );
};

export default TrendingNews;
