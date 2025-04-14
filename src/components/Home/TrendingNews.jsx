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

  useEffect(() => {
    const fetchNews = async () => {
   
      try {
          const response = await listNews();
          const data = response.data;
        
        // Filter news items to only include those with "displayOn": "trending-news" or "both"
        const filteredNews = data.filter(
          (article) => article.displayOn === "trending-news" || article.displayOn === "both"
        );
        
        setNews(filteredNews);
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
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        // Rotate the canvas for diagonal watermark
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(-Math.PI / 6); // Rotate by -30 degrees
        ctx.fillText("World One", 0, 0);
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
        console.log("Loading image for watermarking:", imageSrc);
        resolve(imageSrc); // Fall back to original image
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

  return (
    <div className="w-full max-w-3xl mx-auto h-screen overflow-auto scrollbar-hide  mb-10">
      
      <AdsComponent />

      <div className="hidden lg:block">
        <Carousel_component />
      </div>

      <h2 className="text-2xl font-semibold bg-[#2872AF] text-white py-2 px-6 w-full sticky top-0 hidden lg:block z-10">
        Trending & Breaking News
      </h2>

      {/* News List */}
      <div className="h-full overflow-y-auto py-4 scrollbar-hide">
        {news.map((article) => {
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
              <img
                src={loadedImages[imageKey] || `${process.env.NEXT_PUBLIC_API_URL}/${article.image}`}
                alt= {article.heading}
                className="w-full h-56 object-cover"
              />
              <h3 className="text-xl font-semibold mt-3"> {article.heading}</h3>
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

              {/* <p className="text-gray-700 text-sm mt-4 leading-relaxed relative">
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
              </p> */}

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