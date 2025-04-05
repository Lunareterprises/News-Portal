"use client";
import { useEffect, useState } from "react";
import Carousel_component from "./Carousel_component";
import AdsComponent from "./AdsComponent";

const TrendingNews = () => {
  const [expanded, setExpanded] = useState({});
  const [news, setNews] = useState([]);
  const [loadedImages, setLoadedImages] = useState({});

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

  const addWatermark = (imageSrc, id) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        // Set canvas dimensions to match the image
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the original image
        ctx.drawImage(img, 0, 0);
        
        // Add watermark text
        ctx.font = `${img.width / 20}px Arial`;
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        // Rotate the canvas for diagonal watermark
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(-Math.PI / 6); // Rotate by -30 degrees
        ctx.fillText("YourSite.com", 0, 0);
        ctx.restore();
        
        // Convert to data URL
        const watermarkedImage = canvas.toDataURL("image/jpeg");
        setLoadedImages(prev => ({
          ...prev,
          [`news-${id}`]: watermarkedImage
        }));
        resolve(watermarkedImage);
      };
      
      img.onerror = () => {
        console.error("Error loading image for watermarking");
        resolve(imageSrc); // Fall back to original image
      };
      
      img.src = imageSrc;
    });
  };

  useEffect(() => {
    // Process only news images
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
      
      <AdsComponent />

      <div className="hidden lg:block">
        <Carousel_component />
      </div>

      <h2 className="text-2xl font-semibold bg-[#2872AF] text-white py-2 px-6 w-full sticky top-0 hidden lg:block">
        Trending & Breaking News
      </h2>

      {/* News List */}
      <div className="h-full overflow-y-auto py-4 scrollbar-hide">
        {news.map((article) => {
          const isExpanded = expanded[article.id];
          const shortText = article.description.substring(0, 250);
          const fadedText = article.description.substring(250, 550);
          const remainingText = article.description.substring(550);
          const imageKey = `news-${article.id}`;

          return (
            <div key={article.id} className="mb-6 relative">
              <img
                src={loadedImages[imageKey] || article.image}
                alt={article.title}
                className="w-full h-56 object-cover"
              />
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrendingNews;