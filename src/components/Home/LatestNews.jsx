"use client";

import { useEffect, useState } from "react";
import { ads_news } from "./Ads_service";

const LatestNews = () => {
  const [news, setNews] = useState([]);
  const [ads, setAds] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [loadedImages, setLoadedImages] = useState({});

  const [hiddenAds, setHiddenAds] = useState({});
  const handleCloseAd = (index) => {
    setHiddenAds((prev) => ({ ...prev, [index]: true }));
  };

  const base_url = "https://lunarsenterprises.com:8000/";

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
    const fetchAds = async () => {
      try {
        const response = await ads_news();
        const data = response.data.map((ad) => ({
          ...ad,
          fullImageUrl:`${process.env.NEXT_PUBLIC_API_URL}/${ad.ads_image}`.trim(), // Trim to avoid extra spaces
        }));
        setAds(data);
      } catch (error) {
        console.error("Error fetching ads:", error);
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

        ctx.font = `${img.width / 20}px Arial`;
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(-Math.PI / 6); // Rotate by -30 degrees
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
        resolve(imageSrc);
      };

      img.src = imageSrc;
    });
  };

  useEffect(() => {
    news.forEach((article) => {
      if (article.image && !loadedImages[`news-${article.id}`]) {
        addWatermark(article.image, article.id);
      }
    });
  }, [news]);

  const toggleReadMore = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-full max-w-3xl mx-auto h-screen overflow-hidden mb-10">
      <h2 className="text-2xl font-semibold bg-[#2872AF] text-white py-2 px-6 w-full sticky top-0 hidden lg:block">
        Latest News
      </h2>

      <div className="h-full overflow-y-auto py-4 scrollbar-hide">
        {news.map((article, index) => {
          const isExpanded = expanded[article.id];
          const shortText = article.description.substring(0, 250);
          const fadedText = article.description.substring(250, 550);
          const remainingText = article.description.substring(550);
          const imageKey = `news-${article.id}`;

          return (
            <div key={article.id} className="mb-6 relative">
              <div className="relative">
                <img
                  src={loadedImages[imageKey] || article.image}
                  alt={article.title}
                  className="w-full h-56 object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mt-3">{article.title}</h3>

              <p className="text-gray-700 text-sm mt-4 leading-relaxed relative">
                {shortText}
                {!isExpanded && (
                  <span className="text-gray-300">
                    {fadedText}
                    <span className="absolute left-0 right-0 bottom-0 w-full h-24 flex items-center justify-center">
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
                    src={ads[index % ads.length]?.fullImageUrl}
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
