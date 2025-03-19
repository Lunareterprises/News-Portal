"use client"
import React, { useState }  from 'react';
import Image from 'next/image';

// import {  FaBars, FaTimes } from 'react-icons/fa';

const MENU_ITEMS = [
   { id: 4, name: 'Contact Us', link: '/'} 
];



const Header = () => {
  // const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <header className="shadow-none  z-40 relative">
      <div className="   py-5 ">
        <div className="container flex justify-between items-center gap-10 sm:gap-3">
          {/* <a href="#" className="font-bold  sm:text-lg text-gray-900 bg-white px-24 py-2">
            LOGO MARK
          </a> */}

          <div className='flex justify-center items-center '>
            <Image src="/images/categories/logo.png" width={120} height={100} alt='logo'/>
          </div>
     


          {/* <button
            className="text-gray-950 text-2xl sm:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button> */}

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

      {/* {mobileMenuOpen && (
        <div className="sm:hidden bg-white  p-4 absolute w-full left-0 top-16 z-50">
          <ul className="flex flex-col gap-4 text-black ">
            {MENU_ITEMS.map((item) => (
              <li key={item.id}>
                <a href={item.link} className="block p-2 hover:text-yellow-800 rounded">
                  {item.name}
                </a>
              </li>
            ))}
            
            
          </ul>
        </div>
      )} */}


    </header>
  );
};

export default Header;
