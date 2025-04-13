"use client";
import { useEffect, useState } from "react";
import { ads_news } from "./Ads_service";

const AdsComponent = () => {
  const [ads, setAds] = useState([]);
  const [visibleAds, setVisibleAds] = useState({});

  const base_url = "https://lunarsenterprises.com:8000/";

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await ads_news();
        const data = response.data;
        setAds(data);

        // Initialize visibility state
        const adVisibility = data.reduce((acc, ad) => {
          acc[ad.id] = true;
          return acc;
        }, {});
        setVisibleAds(adVisibility);
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
    };

    fetchAds();
  }, []);

  const closeAd = (id) => {
    setVisibleAds((prev) => ({ ...prev, [id]: false }));
  };




  return (
    <div className="w-full overflow-hidden mb-3">
      <div className="relative flex whitespace-nowrap ">
        {ads.map(
          (ad) =>
            visibleAds[ad.id] && (
              <div
                key={ad.id}
                className="relative flex-shrink-0  w-full   h-72 bg-gray-800  overflow-hidden"
              >
                <img
                  src={base_url + ad.ads_image}
                  
                  alt={ad.ads_name}
                  className="w-full h-full object-cover "
                />
                <button
                  onClick={() => closeAd(ad.id)}
                  className="absolute top-2 right-2 bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold"
                >
                  ✕
                </button>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default AdsComponent;
