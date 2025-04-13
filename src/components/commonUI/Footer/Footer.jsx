import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaEnvelope, FaPhone } from 'react-icons/fa';

const footerLinks = [
  { title: 'Menu', link: '/' },
  { title: 'About Us', link: '/' },
  { title: 'Contact Us', link: '/' },
  { title: 'Main Dishes', link: '/' },
];



const Footer = () => (
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
          In today’s fast-paced digital world, staying informed is more important than ever. Our news portal is dedicated to delivering accurate, timely, and engaging news that keeps you updated on the latest happenings across the globe.
        </p>
      </div>

      {/* Right Section - Navigation, Address, Social Links */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        
        {/* Navigation Links */}
        <div className="py-4 ">
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
        <div className="py-4  flex flex-col gap-3">
          <h1 className="text-base font-semibold mb-3 whitespace-nowrap">ADDRESS</h1>
          <p className="text-sm leading-relaxed">
            World One 617/A
            Pazhanjiyoorkonam Pattoor p.o  
            Padanilam Nooranad Alappuzha pin- 690529
          </p>
          {/* Email */}
          <p className="flex text-sm items-center gap-3">
              <FaEnvelope className="text-sm md:text-base" /> worldonetv1@gmail.com
            </p>

            {/* Phone Numbers */}
            <div className="flex  items-start gap-3">
              <FaPhone className="text-sm md:text-base " />
              <div className="flex flex-col gap-1 text-sm">
                <p className='whitespace-nowrap'>+91 9846528787,</p>
                <p className='whitespace-nowrap'>+91 9497528787,</p>
              </div>
            </div>
        </div>

        {/* Social Links */}
        <div className="py-4 ">
          <h1 className="text-base font-semibold mb-3 whitespace-nowrap">SOCIAL LINKS</h1>
          <div className="flex flex-col gap-4">
            
            

            {/* Social Icons */}
            <div className="flex gap-3">
              <a href="#" aria-label="Facebook" className="text-xl hover:text-primary p-3 bg-[#222222]">
                <FaFacebookF />
              </a>
              <a href="#" aria-label="Instagram" className="text-xl hover:text-primary p-3 bg-[#222222]">
                <FaInstagram />
              </a>
              <a href="#" aria-label="Twitter" className="text-xl hover:text-primary p-3 bg-[#222222]">
                <FaTwitter />
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
