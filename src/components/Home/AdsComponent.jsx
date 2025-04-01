"use client";
import { useEffect, useState } from "react";

const AdsComponent = () => {
  const [ads, setAds] = useState([]);
  const [visibleAds, setVisibleAds] = useState({});

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch("/data/ads.json");
        if (!response.ok) throw new Error("Failed to load ads");
        const data = await response.json();
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
                  src={ad.image}
                  alt={ad.title}
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
