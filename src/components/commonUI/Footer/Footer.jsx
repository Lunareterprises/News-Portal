
"use client";
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  FaFacebookF, FaTwitter, FaInstagram, FaEnvelope,
  FaPhone, FaLinkedinIn, FaLink
} from 'react-icons/fa';
import { SiWhatsapp, SiX } from 'react-icons/si'; // For WhatsApp and X (Twitter)

const Footer = () => {
  const [footerData, setFooterData] = useState({
    address: "",
    email: "",
    phone1: "",
    phone2: "",

    socialLinks: [],
  });

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const response = await axios.get(
          "https://lunarsenterprises.com:8000/worldone/admin/footer"
        );
        const data = response.data.data[0];

        const socialLinks = (data.f_social_links || "")
          .split(",")
          .filter(link => link.trim() !== "")
          .map((link) => {
            const trimmedLink = link.trim().toLowerCase();
            let icon = FaLink;

            if (trimmedLink.includes("facebook")) {
              icon = FaFacebookF;
            } else if (trimmedLink.includes("instagram")) {
              icon = FaInstagram;
            } else if (trimmedLink.includes("wa.me")) {
              icon = SiWhatsapp;
            } else if (trimmedLink.includes("x.com") || trimmedLink.includes("twitter")) {
              icon = SiX;
            } else if (trimmedLink.includes("linkedin")) {
              icon = FaLinkedinIn;
            }

            return {
              link: trimmedLink,
              icon,
            };
          });

        setFooterData({
          address: data.f_address,
          email: data.f_email,
          phone1: data.f_contact1,
          phone2: data.f_contact2,
          socialLinks,
        });
      } catch (error) {
        console.error("Error loading footer:", error);
      }
    };

    fetchFooter();
  }, []);

  const footerLinks = [
    { title: "Home", link: "/" },
    { title: "About", link: "/" },
    { title: "Contact", link: "/" },
    { title: "Privacy Policy", link: "/" },
  ];

  return (
    <footer className="text-white bg-[#1F1F1F] mt-28 w-full py-10">
      <div className="mx-auto px-4 lg:px-32 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2">

        {/* Left Section - Logo & Description */}
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold mb-3">
            <a href="#">
              <img src="/images/categories/logo.png" alt="Logo" className="w-56" />
            </a>
          </h2>
          <p className="text-gray-300 text-sm w-full md:w-3/4">
            In today’s fast-paced digital world, staying informed is more important than ever.
            Our news portal is dedicated to delivering accurate, timely, and engaging news that keeps
            you updated on the latest happenings across the globe.
          </p>
        </div>

        {/* Right Section */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

          {/* Navigation */}
          <div className="py-4">
            <h1 className="text-md font-semibold mb-3 whitespace-nowrap">NAVIGATION</h1>
            <ul className="flex flex-col gap-3">
              {footerLinks.map(({ title, link }) => (
                <li key={title} className="cursor-pointer hover:text-primary hover:translate-x-1 duration-300 text-gray-200">
                  <a href={link} className="text-sm">{title}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Address Section */}
          <div className="py-4 flex flex-col gap-3">
            <h1 className="text-base font-semibold mb-3 whitespace-nowrap">ADDRESS</h1>
            <p className="text-sm leading-relaxed">
            
              {footerData.address}
            </p>

            {/* Email */}
            <p className="flex text-sm items-center gap-3">
              <FaEnvelope className="text-sm md:text-base" /> {footerData.email}
            </p>

            {/* Phone */}
            <div className="flex items-start gap-3">
              <FaPhone className="text-sm md:text-base" />
              <div className="flex flex-col gap-1 text-sm">
                <p className='whitespace-nowrap'> {footerData.phone1}</p>
                <p className='whitespace-nowrap'> {footerData.phone2}</p>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="py-4">
            <h1 className="text-base font-semibold mb-3 whitespace-nowrap">SOCIAL LINKS</h1>
            <div className="flex gap-3 flex-wrap">
              {footerData.socialLinks.map((item, index) => {
                const Icon = item.icon;
                return (
                  <a
                    key={index}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Social"
                    className="text-xl hover:text-primary p-3 bg-[#222222] rounded"
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
