"use client";

import { useEffect, useRef, useState } from "react";
import { FaWhatsapp, FaInstagram, FaFacebook, FaEnvelope, FaLink } from "react-icons/fa";

const SharePopup = ({ url, headline, onClose }) => {
  const popupRef = useRef();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(headline)}%20${url}`,
    instagram: `https://www.instagram.com/?url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    gmail: `mailto:?subject=${encodeURIComponent(headline)}&body=${encodeURIComponent(url)}`,
  };

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      onClose(); // Optional: close after a short delay
    }, 1500);
  };

  return (
    <div className="absolute right-0 top-8 z-50 bg-white shadow-md rounded p-3 w-48" ref={popupRef}>
      <p className="text-xs text-gray-500 mb-2">Share via:</p>
      <div className="flex flex-row space-x-6 text-2xl relative">
        <a href={shareLinks.whatsapp} target="_blank" className="flex items-center gap-2 text-green-500 cursor-pointer">
          <FaWhatsapp /> 
        </a>
        <a href={shareLinks.instagram} target="_blank" className="flex items-center gap-2 text-pink-500 cursor-pointer">
          <FaInstagram /> 
        </a>
        <a href={shareLinks.facebook} target="_blank" className="flex items-center gap-2 text-blue-600 cursor-pointer">
          <FaFacebook /> 
        </a>
        {/* <a href={shareLinks.gmail} className="flex items-center gap-2 text-red-600">
          <FaEnvelope /> Gmail
        </a> */}
        <button
          onClick={copyLink}
          className="flex items-center gap-2 text-gray-700 relative cursor-pointer"
        >
          <FaLink /> 
          {copied && (
            <span className="absolute -top-6 left-0 text-xs bg-black text-white px-2 py-1 rounded">
              Link copied!
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default SharePopup;
