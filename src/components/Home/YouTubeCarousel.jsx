import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FaRegPlayCircle } from 'react-icons/fa';
import { getYoutubeVdos } from '@/services/newsService';

const YouTubeCarousel = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await getYoutubeVdos();
        console.log('====================================');
        console.log("res--->>",res);
        console.log('====================================');
        if (!res.result || !Array.isArray(res.data)) {
          throw new Error(res.message || 'Invalid response format');
        }

        // Map the API format to the format used in rendering
        const formattedVideos = res.data.map((item) => ({
          url: item.y_link,
          title: item.y_title,
        }));

        setVideos(formattedVideos);
      } catch (err) {
        console.error("Error fetching videos:", err);
        setError(err.message || 'Failed to load videos.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const getVideoId = (url) => {
    try {
      if (url.includes('youtu.be/')) return url.split('youtu.be/')[1].split('?')[0];
      if (url.includes('watch?v=')) return url.split('watch?v=')[1].split('&')[0];
      return null;
    } catch {
      return null;
    }
  };

  const renderContent = () => {
    if (loading) return <p className="text-center text-gray-500">Loading videos...</p>;
    if (error) return <p className="text-center text-red-500">Error: {error}</p>;
    if (!videos.length) return <p className="text-center text-gray-500">No videos available.</p>;

    return (
      <Swiper
        spaceBetween={20}
        loop
        navigation
        pagination={{ clickable: true }}
        modules={[Navigation, Pagination]}
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
        className="w-full pb-12"
      >
        {videos.map((video, index) => {
          const videoId = getVideoId(video.url);
          const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

          return (
            <SwiperSlide key={index}>
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full group"
              >
                <div className="relative w-full h-100 rounded-xl overflow-hidden shadow-lg transition-all duration-300">
                  <div className="relative pb-[60%]">
                    <img
                      src={thumbnail}
                      alt={video.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute left-0 right-0 p-10 bg-gradient-to-t from-black via-black to-transparent -bottom-44">
                      <FaRegPlayCircle className="w-8 h-8 text-white mb-3 drop-shadow-lg transition-transform duration-300 group-hover:scale-125" />
                      <p className="text-white text-xs sm:text-sm md:text-base  font-semibold leading-tight">
                        {video.title}
                      </p>
                    </div>
                  </div>
                </div>
              </a>
            </SwiperSlide>
          );
        })}
      </Swiper>
    );
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 text-start">Videos</h2>
      {renderContent()}
    </section>
  );
};

export default YouTubeCarousel;
