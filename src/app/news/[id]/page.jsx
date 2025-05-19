"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import DOMPurify from "dompurify";
import { getads, listNewsByCategory } from "@/services/newsService";
import Header from "@/components/commonUI/Header/Header";
import HeaderAdd from "@/components/Home/HeaderAdd";
import Footer from "@/components/commonUI/Footer/Footer";
import Head from 'next/head';
import TrendingNews from "@/components/Home/TrendingNews";
import YouTubeCarousel from "@/components/Home/YouTubeCarousel";
import SharePopup from "@/components/Home/SharePopup";
// import Image from "next/image";
import NextImage from "next/image";

import RelatedNews from "@/components/Home/RelatedNews";
import Gallery from "@/components/Home/Gallery";
import formatDate from '@/utils/formatDate';

const ArticlePage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ads, setAds] = useState([]);
  const [activeShare, setActiveShare] = useState(null);
  const [mainHeight, setMainHeight] = useState(null);

  const mainRef = useRef(null);

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
      // setWatermarkedImage(watermarked);
    };

    img.onerror = () => {
      console.error("Failed to load image for watermarking.");
      // setWatermarkedImage(imageSrc); // fallback
    };

    img.src = imageSrc;
  };

  useEffect(() => {
    if (id) fetchArticle();
    fetchAds();
  }, [id]);

  useEffect(() => {
    if (!mainRef.current) return;
  
    const timeoutId = setTimeout(() => {
      const height = mainRef.current?.getBoundingClientRect().height;
      setMainHeight(height);
    }, 500); // wait 500ms for fonts/images/layout
  
    return () => clearTimeout(timeoutId);
  }, [article]);
  
  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!article) return <div className="p-10 text-center">Article not found</div>;
  console.log('====================================');
  
  console.log('====================================');
  return (
    <>
      <Head>
        <title>{article.heading}</title>
        <meta property="og:title" content={article.heading} />
        <meta property="og:description" content={article.shortDescription || 'Read the latest news'} />
        <meta property="og:image" content={`${process.env.NEXT_PUBLIC_API_URL}/${article.image}`} />
        <meta property="og:url" content={`https://www.worldonetv.in/news/${article.id}`} />
        <meta property="og:type" content="article" />
      </Head>

      <div className="px-4 py-10 md:px-20 lg:px-40">
        <Header />
        <HeaderAdd />

        <div className="container mx-auto flex flex-col lg:flex-row gap-8">
          {/* Main Article */}
          <main ref={mainRef} className="w-full lg:w-3/4  p-4 rounded-md">
            <h1 className="text-lg md:text-2xl font-bold text-center mb-4">{article.heading}</h1>

            {article.image && (
              <NextImage
                width={100}
                height={100}
                src={`${process.env.NEXT_PUBLIC_API_URL}/${article.image}`}
                alt={article.heading}
                className="w-full h-auto md:h-96 object-contain"
                unoptimized
              />
            )}

            <div className="relative flex justify-between items-center">
              <p className="flex justify-end items-center gap-3 mt-3">
              <NextImage src="/images/categories/Group56.png" width={18} height={50} alt="time" unoptimized />

                <span className="text-[#787878]">{formatDate(article.updated_at)}</span>
              </p>
              <div className="group">
                <button
                  onClick={() =>
                    setActiveShare((prev) => (prev === article.id ? null : article.id))
                  }
                  className="ml-4 mt-2 px-3 py-1 rounded cursor-pointer"
                >
                  <NextImage src="/images/categories/Vector.png" width={18} height={50} alt="share" unoptimized/>
                </button>
                <div className="absolute whitespace-nowrap bottom-full mb-1 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded">
                  Share this News
                </div>
              </div>

              {activeShare === article.id && (
                <SharePopup
                  url={`https://www.worldonetv.in/news/${article.id}`}
                  headline={article.heading}
                  onClose={() => setActiveShare(null)}
                />
              )}
            </div>

            <div
              className="prose w-full mt-6"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(article.content),
              }}
            />
          </main>

          {/* Sidebar */}
          <aside className="w-full lg:w-1/2 space-y-4 p-4  overflow-y-auto">
            {mainHeight ? (
              <TrendingNews height={`${mainHeight}px`} />
            ) : (
              <div>Loading Trending News...</div>
            )}
          </aside>

        </div>

        <RelatedNews categoryId={article.category} />
        <YouTubeCarousel />
        <Gallery />
      </div>

      <Footer />
    </>

  );
};

export default ArticlePage;
