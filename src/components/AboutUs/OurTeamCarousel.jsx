"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Slider = dynamic(() => import("react-slick"), { ssr: false });

// Custom Previous Button
const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-2 md:left-[-30px] top-1/2 transform -translate-y-1/2 z-10 bg-gray-200 text-gray-900 p-2 md:px-4 md:py-2 rounded-full hover:bg-gray-300"
  >
    ❮
  </button>
);

// Custom Next Button
const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-2 md:right-[-30px] top-1/2 transform -translate-y-1/2 z-10 bg-gray-200 text-gray-900 p-2 md:px-4 md:py-2 rounded-full hover:bg-gray-300"
  >
    ❯
  </button>
);

function OurTeamCarousel() {
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    fetch("/data/team.json")
      .then((response) => response.json())
      .then((data) => setTeamMembers(data))
      .catch((error) => console.error("Error fetching team data:", error));
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 4 } },
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } }
    ]
  };

  return (
    <div className="relative w-full mt-6 px-4">
      <h2 className="text-center font-bold text-2xl md:text-3xl mb-6">OUR TEAM</h2>
      <div className="relative">
        <Slider {...settings}>
          {teamMembers.map((member, index) => (
            <div key={index} className="px-2">
              <div className="  overflow-hidden text-start">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-52 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg md:text-xl font-semibold">{member.name}</h3>
                  <p className="text-sm md:text-base text-gray-600">{member.role}</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default OurTeamCarousel;
