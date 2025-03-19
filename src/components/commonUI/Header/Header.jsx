"use client"
import React, { useState }  from 'react';
import Image from 'next/image';

const MENU_ITEMS = [
   { id: 4, name: 'Contact Us', link: '/'} 
];



const Header = () => {
  return (
    <header className=" shadow-none  bg-[#F5F5F5] sticky top-0 z-10 ">
      <div className="   py-5 ">
        <div className="  flex justify-between items-center gap-10 sm:gap-3">
          <div className='flex justify-center items-center '>
            <Image src="/images/categories/logo.png" width={120} height={100} alt='logo'/>
          </div>
          <nav>
            <ul className="flex items-center gap-24 ">
              {MENU_ITEMS.map((item) => (
                <li key={item.id} className='bg-[#2872AF] text-white px-4 py-2'>
                  <a href={item.link} className=" hover:text-[#2872AF] hover:font-semibold transition whitespace-nowrap text-sm md:text-lg">
                    {item.name}
                  </a>
                </li>
              ))}            
            </ul>
          </nav>  
        </div>
      </div>
    </header>
  );
};

export default Header;
