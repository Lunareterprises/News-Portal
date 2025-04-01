import React from 'react'
import Header from '../commonUI/Header/Header'
import OurTeamCarousel from './OurTeamCarousel'
import History from './History'
import Background from './Background'
import VisionMission from './VisionMission'
import Footer from '../commonUI/Footer/Footer'

function AboutUsIndex() {
  return (
    <div>
      <div className='px-4  md:px-10 lg:px-20 xl:px-32'>
          <Header />
          <div className='text-[#1F1F1F] flex flex-col gap-3'>
              <h1 className=' text-center font-bold text-2xl'>ABOUT US</h1>
              <p ><span className='text-[#0C8CE9] text-lg'>Introduction:</span>  In today’s fast-paced digital world, staying informed is more important than ever. Our news portal is dedicated to delivering accurate, timely, and engaging news that keeps you updated on the latest happenings across the globe. Whether it’s breaking news, in-depth analysis, or trending stories, we strive to provide a seamless and informative experience for our readers. With a user-friendly interface and a commitment to journalistic integrity, our platform ensures that you stay ahead with credible and insightful news coverage.</p>
          </div>
          <OurTeamCarousel />
          <History />
          <Background />
          <VisionMission />
          
      </div>
      <Footer />
    </div>
  )
}

export default AboutUsIndex