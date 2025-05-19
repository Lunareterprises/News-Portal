"use client";
import { useEffect, useRef } from "react";

export default function AdBanner() {
  const adRef = useRef(null);

  useEffect(() => {
    try {
      if (window && adRef.current) {
        // Only push if the ins tag hasn't been initialized yet
        if (!adRef.current.getAttribute("data-adsbygoogle-status")) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      }
    } catch (e) {
      console.error("Adsense error:", e);
    }
  }, []);

  return (
    <ins
      ref={adRef}
      className="adsbygoogle"
      style={{ display: "block", minHeight: "100px" }}
      data-ad-client="ca-pub-5296998056401590"
      data-ad-slot="2226315840"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
}
