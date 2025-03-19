"use client"
import { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; 

function Carousel_component() {
    const [news, setNews] = useState([]);
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
  return (
    <div>
        {news.length > 0 && (
        <Carousel
            autoPlay
            infiniteLoop
            showThumbs={false}
            showStatus={false}
            showIndicators={false}
            showArrows={false}
            className="mb-4"
        >
            {news.slice(0, 5).map((article) => (
            <div key={article.id}>
                <img
                src={article.image_article}
                alt={article.title}
                className="w-full h-48 lg:h-64 object-cover"
                />

                <p className="absolute bottom-0 left-0 w-full bg-black  text-white text-sm font-semibold p-3">
                {article.title}
                </p>
            </div>
            ))}
        </Carousel>
        )}
    </div>
  )
}

export default Carousel_component