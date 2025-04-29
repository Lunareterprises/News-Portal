import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import { listNews } from "@/services/newsService";
import SharePopup from "./SharePopup";
import formatDate from '@/utils/formatDate'; // adjust the path based on your project structure

const Button = ({ label, className, onClick }) => (
  <button className={className} onClick={onClick}>
    {label}
  </button>
);

const RelatedNews = ({ categoryId }) => {
  const [news, setNews] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [activeShare, setActiveShare] = useState(null);

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    const fetchNews = async () => {
        try {
          setLoading(true);
          const response = await listNews({ categoryId });
          console.log('====================================');
          console.log("categoryId-->>", categoryId);
          console.log('====================================');
          console.log('============================="=======');
          console.log("response-->>", response);
          console.log('====================================');
          if (response?.result === true) {
            const data = response.data;
            if (!Array.isArray(data)) {
              console.error("Invalid news data format");
              return;
            }
            const filteredNews = data.filter(
                (article) => String(article?.category) === String(categoryId)
              );
              
            console.log("filteredNews-->>", filteredNews);
            setNews(filteredNews);
            setError(null);
          } else {
            console.error(response.message);
            setError("Failed to load related news.");
          }
        } catch (err) {
          console.error("Error fetching news:", err);
          setError("Something went wrong while fetching related news.");
        } finally {
          setLoading(false);
        }
      };
      

    if (categoryId) {
      fetchNews();
    }
  }, [categoryId]);

  const toggleReadMore = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  return (
    <div className="relative w-full mx-auto ">
      <h1 className="text-black  text-2xl font-bold text-start whitespace-nowrap">
        Related News
      </h1>

      <div className="relative flex items-center">
        {/* Previous Button */}
        <Button
          label="❮"
          className="absolute left-0 md:-left-12 text-blue-400 cursor-pointer rounded-full shadow-lg hover:text-blue-800 z-10"
          onClick={() => prevRef.current?.click()}
        />

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          pagination={{ clickable: true, el: ".custom-pagination" }}
          loop={true}
          slidesPerView={1}
          spaceBetween={20}
          breakpoints={{
            320: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          className="w-full mt-6"
        >
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
            </div>
          ) : Array.isArray(news) && news.length > 0 ? (
            news.map((article) => {
              const fallbackImage = `${process.env.NEXT_PUBLIC_API_URL}/${article.image}`;
              const shortText = article?.content
                ? article.content.replace(/<[^>]+>/g, "").substring(0, 60)
                : "";

              return (
                <SwiperSlide key={article.id} className="relative">
                  <div className="mb-4 p-2 rounded-md bg-[#F5F5F5] h-[500px]">
                    <div className="flex flex-col gap-6 items-center">
                      <div className="relative w-full h-52">
                        <Image
                          src={fallbackImage}
                          alt={article.heading}
                          layout="fill"
                          objectFit="contain"
                          className="rounded-md w-full h-full"
                          onError={(e) => {
                            e.target.src = "/default-news-image.jpg";
                          }}
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <a
                          href={`https://www.worldonetv.in/news/${article.id}`}
                          className="text-xs font-semibold text-gray-900 hover:text-[#2872AF]"
                        >
                          {article.heading}
                        </a>

                        <div className="text-gray-700 text-xs leading-relaxed">
                          <p>{shortText}...</p>
                        </div>
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
                </SwiperSlide>
              );
            })
          ) : (
            <div className="text-center text-gray-500 py-10 text-base">
              No Related News Available
            </div>
          )}
        </Swiper>

        {/* Next Button */}
        <Button
          label="❯"
          className="absolute right-0 md:-right-12 text-blue-400 cursor-pointer rounded-full shadow-lg hover:text-blue-800 z-10"
          onClick={() => nextRef.current?.click()}
        />
      </div>

      <div ref={prevRef} style={{ display: "none" }} />
      <div ref={nextRef} style={{ display: "none" }} />

      <div className="custom-pagination flex justify-center mt-4 space-x-2"></div>
    </div>
  );
};

export default RelatedNews;
