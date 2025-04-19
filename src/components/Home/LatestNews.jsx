"use client";

import { getads } from "@/services/newsService";
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { useRouter } from "next/navigation";
import { FiShare2 } from "react-icons/fi";
import SharePopup from "./SharePopup";

const LatestNews = ({ news, newsError, loading }) => {
  // const LatestNews = () => {
  //   const [news, setNews] = useState([]);
  const [ads, setAds] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [loadedImages, setLoadedImages] = useState({});
  const [hiddenAds, setHiddenAds] = useState({});
  // const [newsErrornews, setNewsErrornews] = useState(null); // Track news fetch errors
  const [activeShare, setActiveShare] = useState(null);
  
  const router = useRouter();
  const handleCloseAd = (index) => {
    setHiddenAds((prev) => ({ ...prev, [index]: true }));
  };

  useEffect(() => {
    // const fetchNews = async () => {
    //   try {
    //     const response = await listNews();
    //     if (response?.data) {
    //       const filteredNews = response.data.filter(
    //         (article) =>
    //           article.displayOn === "latest-news" || article.displayOn === "both"
    //       );
    //       setNews(filteredNews);
    //     } else {
    //       throw new Error("News data is empty or malformed");
    //     }
    //   } catch (error) {
    //     console.error("Error fetching news:", error);
    //     setNewsError("Failed to load news. Please try again later.");
    //   }
    // };
    const fetchAds = async () => {
      try {
        const response = await getads();
        if (response?.result===true) {
          setAds(response.data);
        } else {
          console.log("Ads data is empty or malformed");
        }
      } catch (error) {
        console.error("Error fetching ads:", error);
        // setNewsErrornews("Failed to load ads. Please try again later.");
      }
    };

    // fetchNews();
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
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.textAlign = "top";
        ctx.textBaseline = "top";

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(-Math.PI / 0); // (This is actually rotating by infinity — did you mean -Math.PI / 4?)
        ctx.fillText("World One", 0, 30); // Move watermark slightly downward
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
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
          </div>
        ) : Array.isArray(news) && news?.length > 0 ? (
          news.map((article, index) => {
            const isExpanded = expanded[article.id];
            const rawContent = article.content || "";

            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = rawContent;
            const plainText = tempDiv.textContent || tempDiv.innerText || "";
            const shortText = plainText.substring(0, 250);
            const showReadMore = plainText?.length > 250;

            const imageKey = `news-${article.id}`;

            return (
              <div key={article?.id} className="mb-6 relative">
                <div className="relative">
                  <img
                    src={
                      loadedImages[imageKey] ||
                      `${process.env.NEXT_PUBLIC_API_URL}/${article?.image}`
                    }
                    alt={article?.title}
                    className="w-full h-auto object-cover"
                    onError={(e) =>
                      (e.target.src = "/path/to/fallback-image.jpg")
                    }
                  />
                </div>
                <h3 className="text-xl font-semibold mt-3">
                  {article?.heading}
                </h3>

                <div className="text-gray-700 text-sm mt-4 leading-relaxed relative">
                  {!isExpanded ? (
                    <>
                      <p>{shortText}...</p>
                      {showReadMore && (
                        <div className="absolute left-0 right-0 bottom-0 w-full h-24 flex items-center justify-center bg-gradient-to-t from-white via-white/80 to-transparent">
                          <button
                            onClick={() => toggleReadMore(article?.id)}
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



                {index % 3 === 1 && ads?.length > 0 && !hiddenAds[index] && (
                  <div className="my-6 w-full relative flex justify-center">
                    <button
                      onClick={() => handleCloseAd(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 text-sm flex items-center justify-center z-10"
                      aria-label="Close ad"
                    >
                      ✕
                    </button>
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}/${
                        ads[index % ads?.length]?.ads_image
                      }`}
                      alt={ads[index % ads?.length]?.ads_name || "Advertisement"}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-500 py-10">
            No News Available
          </div>
        )}
      </div>
    </div>
  );
};

export default LatestNews;
