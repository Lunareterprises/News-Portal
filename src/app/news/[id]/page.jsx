"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DOMPurify from "dompurify";
import { getads, listNewsByCategory } from "@/services/newsService";
import Header from "@/components/commonUI/Header/Header";
import HeaderAdd from "@/components/Home/HeaderAdd";
import Footer from "@/components/commonUI/Footer/Footer";

const ArticlePage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ads, setAds] = useState([]);
  const [watermarkedImage, setWatermarkedImage] = useState(null);

  const fetchArticle = async () => {
    try {
      const response = await listNewsByCategory();
      if (response?.result === true) {
        const numericId = Number(id);
        const filtered = response.data.find((item) => item.id === numericId);
        setArticle(filtered);
        if (filtered?.image) {
          addWatermark(`${process.env.NEXT_PUBLIC_API_URL}/${filtered.image}`);
        }
      }
    } catch (error) {
      console.error("Error loading article:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAds = async () => {
    try {
      const response = await getads();
      if (response?.result === true) {
        setAds(response.data);
      } else {
        console.log("Ads data is empty or malformed");
      }
    } catch (error) {
      console.error("Error fetching ads:", error);
    }
  };

  const addWatermark = (imageSrc) => {
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
      ctx.textAlign = "start";
      ctx.textBaseline = "top";

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(-Math.PI / 0); // Diagonal watermark
      ctx.fillText("World One", 0, 0);
      ctx.restore();

      const watermarked = canvas.toDataURL("image/jpeg");
      setWatermarkedImage(watermarked);
    };

    img.onerror = () => {
      console.error("Failed to load image for watermarking.");
      setWatermarkedImage(imageSrc); // fallback
    };

    img.src = imageSrc;
  };

  useEffect(() => {
    if (id) fetchArticle();
    fetchAds();
  }, [id]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!article) return <div className="p-10 text-center">Article not found</div>;

  return (
    <>
        <div className="px-4 py-10 md:px-20 lg:px-40">
      <Header />
      <HeaderAdd />

      <div className="container mx-auto p-4 md:p-10 flex flex-col lg:flex-row gap-8">
        {/* Right side - Main Article */}
        <main className="w-full lg:w-3/4">
          <h1 className="text-lg md:text-2xl font-bold text-center  mb-4">{article.heading}</h1>
          {watermarkedImage && (
            <img
              src={watermarkedImage}
              alt={article.heading}
              className="w-full h-auto md:h-96 mb-4 object-contain"
            />
          )}
          <div
            className="prose w-full"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(article.content),
            }}
          />
        </main>

        {/* Left side - Ads */}
        <aside className="w-full lg:w-1/4 space-y-4">
          <h2 className="text-lg font-semibold mb-2 text-center">Sponsored Ads</h2>
          {ads.length > 0 ? (
            ads.map((ad) => (
              <div key={ad.ads_id} className="rounded-lg p-3 shadow-md bg-white">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}/${ad.ads_image}`}
                  alt={ad.ads_name}
                  className="w-full h-auto mb-4 object-none"
                />
                <p className="text-xs mt-2 text-center">
                  To advertise here{" "}
                  <a
                    href={`https://wa.me/919846528787`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold "
                  >
                    Contact
                  </a>
                </p>
              </div>
            ))
          ) : (
            <p>No ads available</p>
          )}
        </aside>
      </div>
    </div>
    <Footer />
    </>

  );
};

export default ArticlePage;
