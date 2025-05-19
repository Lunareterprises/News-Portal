import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getGallery } from "@/services/newsService";

function Gallery() {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await getGallery();
        if (res.result === true && Array.isArray(res.data)) {
          setImages(res.data); // remove `.slice(0, 5)` if you want autoplay to work
        } else {
          throw new Error(res.message || "Failed to load images");
        }
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  return (
    <div className="relative mb-20">
      <h2 className="text-start text-lg lg:text-2xl font-semibold mb-4">Gallery</h2>

      {error ? (
        <p className="text-red-500">{error}</p>
      ) : loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="relative">
          {/* Buttons */}
          <button ref={prevRef} className="absolute left-0 lg:-left-16 top-1/2 transform -translate-y-1/2 text-blue-600 p-3 rounded-full z-10">
            <FaChevronLeft size={20} />
          </button>
          <button ref={nextRef} className="absolute right-0 lg:-right-16 top-1/2 transform -translate-y-1/2 text-blue-600 p-3 rounded-full z-10">
            <FaChevronRight size={20} />
          </button>

          {/* Swiper */}
          <Swiper
            onInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
              swiper.navigation.init();
              swiper.navigation.update();
            }}
            modules={[Navigation, Autoplay]}
            spaceBetween={10}
            loop={images.length > 1}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            breakpoints={{
              320: {
                slidesPerView: 1,
              },
              640: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 3,
              },
              1024: {
                slidesPerView: 4,
              },
              1280: {
                slidesPerView: 5,
              },
            }}
            className="w-full mx-auto"
          >

            {images.map((img) => (
              <SwiperSlide key={img.g_id}>
                <div className="relative rounded-xl overflow-hidden">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}/${img.g_file}`}
                    alt={`Gallery ${img.g_id}`}
                    className="w-full h-64 object-cover"
                    
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
}

export default Gallery;
