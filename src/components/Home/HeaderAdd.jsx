import React from 'react'
import WhatsappWidget from './WhatsappWidget'

function HeaderAdd() {
  return (
    <div className='bg-[#02082c] flex flex-col md:flex-row justify-around px-4 py-4 mb-3 gap-4 items-center lg:sticky top-24 z-20'>
      <div className='text-white flex flex-col justify-center items-center w-full md:w-1/4'>
        <p className='font-normal text-[12px] md:text-sm'>Run Your</p>
        <h3 className='font-bold text-base md:text-xl'>ADS</h3>
      </div>
      <hr className="border-white border md:border-l md:h-16 w-full md:w-auto" />
      <div className='w-full flex flex-col md:flex-row text-sm leading-normal text-center md:text-start justify-center items-center gap-3 md:gap-10 px-0 md:px-10'>
        <p className='text-white text-[12px] md:text-sm '>
          Please contact our representative via phone to share your advertisement details. Once submitted, it will be published on our website to ensure maximum visibility and public engagement.
        </p>
        <WhatsappWidget className="text-[#02082c] whitespace-nowrap cursor-pointer" />
      </div>
    </div>
  )
}

export default HeaderAdd
