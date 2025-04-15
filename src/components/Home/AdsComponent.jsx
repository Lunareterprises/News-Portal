"use client";
import { getads } from "@/services/newsService";
import { useEffect, useState } from "react";
import { ads_news } from "./Ads_service";

const AdsComponent = () => {
  const [ads, setAds] = useState([]);
  const [visibleAds, setVisibleAds] = useState({});

 

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await getads();
        const data =response.data;
        setAds(data);
        // Initialize visibility state
        const adVisibility = data.reduce((acc, ad) => {
          acc[ad.ads_id] = true;
          return acc;
        }, {});
        setVisibleAds(adVisibility);

        console.log("visibleAds",visibleAds)
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
    };

    fetchAds();
  }, []);

  const closeAd = (ads_id) => {
    setVisibleAds((prev) => ({ ...prev, [ads_id]: false }));
  };




  return (
    <div className="w-full overflow-hidden mb-3">
      <div className="relative flex whitespace-nowrap ">
      {ads.map(
        (ad) =>
          visibleAds[ad.ads_id] && (
            <div
              key={ad.ads_id}
              className="relative flex-shrink-0 w-full h-72 bg-gray-800 overflow-hidden"
            >

              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}/${ad.ads_image}`}
                alt={ad.ads_name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => closeAd(ad.ads_id)}
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
