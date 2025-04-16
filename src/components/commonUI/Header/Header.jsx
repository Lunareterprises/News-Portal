"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiMenu, FiX } from "react-icons/fi"; // Icons for hamburger menu
import ContactModal from "@/components/ContactUs/ContactModal";

const MENU_ITEMS = [
  { id: 1, name: "Home", link: "/" },
  { id: 2, name: "About Us", link: "/AboutUs" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* HEADER */}
      <header className="shadow-none bg-[#F5F5F5] sticky top-0 z-20 w-full">
        <div className="py-5 px-6 flex justify-between items-center">
          {/* Logo */}
          <div className="flex justify-center items-center">
            <Image
              src="/images/categories/logo.png"
              width={120}
              height={100}
              alt="Company Logo"
              className="h-auto w-auto"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex">
            <ul className="flex items-center gap-10">
              {MENU_ITEMS.map((item) => (
                <li key={item.id} className="px-4 py-2 cursor-pointer">
                  <Link href={item.link} className="hover:text-[#2872AF] transition text-sm tracking-wide md:text-base">
                    {item.name}
                  </Link>
                </li>
              ))}
              <li
                className="bg-[#2872AF] text-white px-4 py-2 cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              >
                <span className="hover:text-white hover:font-semibold transition text-sm tracking-wide md:text-base">
                  Contact Us
                </span>
              </li>
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[#2872AF] text-2xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Mobile Navigation (Dropdown) */}
        <div
          className={`${
            isOpen ? "block" : "hidden"
          } md:hidden absolute top-16 left-0 w-full bg-[#F5F5F5] shadow-md`}
        >
          <ul className="flex flex-col items-center py-4">
            {MENU_ITEMS.map((item) => (
              <li key={item.id} className="py-2">
                <Link
                  href={item.link}
                  className="text-[#2872AF] hover:text-[#004B87] text-lg font-medium"
                  onClick={() => setIsOpen(false)} // Close menu on click
                >
                  {item.name}
                </Link>
              </li>
            ))}
            <li
              className="bg-[#2872AF] text-white px-6 py-2 cursor-pointer mt-2"
              onClick={() => {
                setIsModalOpen(true);
                setIsOpen(false);
              }}
            >
              <span className="hover:text-white hover:font-semibold transition text-lg">
                Contact Us
              </span>
            </li>
          </ul>
        </div>
      </header>

      {/* CONTACT MODAL */}
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Header;
