'use client'
import React from 'react'

const WhatsappWidget = ({
  phone = '919846528787',
  message = 'Hi, I want to run an ad. Let me know more about your services.',
  label = 'WhatsApp Us',
  className = '',
}) => {
  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message.trim())
    const phoneNumber = phone.replace(/\D/g, '') // remove non-digits just in case
    const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`
    window.open(whatsappURL, '_blank')
  }

  return (
    <button
      onClick={handleClick}
      className={`bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded ${className}`}
    >
      {label}
    </button>
  )
}

export default WhatsappWidget
