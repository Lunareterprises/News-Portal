"use client";
import React, { useState } from "react";
import Image from "next/image";
import ContactModal from "@/components/ContactUs/ContactModal";


const MENU_ITEMS = [{ id: 4, name: "Contact Us", link: "/" }];

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* HEADER */}
      <header className="shadow-none bg-[#F5F5F5] sticky top-0 z-10">
        <div className="py-5">
          <div className="flex justify-between items-center gap-10 sm:gap-3">
            <div className="flex justify-center items-center">
              <Image src="/images/categories/logo.png" width={120} height={100} alt="logo" />
            </div>
            <nav>
              <ul className="flex items-center gap-24">
                {MENU_ITEMS.map((item) => (
                  <li
                    key={item.id}
                    className="bg-[#2872AF] text-white px-4 py-2 cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <span className="hover:text-white hover:font-semibold transition whitespace-nowrap text-sm tracking-wide md:text-md">
                      {item.name}
                    </span>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* CONTACT MODAL */}
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Header;
