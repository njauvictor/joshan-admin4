import React from 'react'
import Image from 'next/image'

const Logo = () => {
  return (
    <div className="logo-container">
      <Image
        src="https://res.cloudinary.com/dcxqwes9x/image/upload/v1765514127/jr5_o33jxq.webp"
        alt="Logo"
        width={60}
        height={60}
        className="logo-image"
        priority
      />

      <p className="logo-title">
        Joshan <span>School</span> Registry
      </p>
      <p className="logo-subtext">Login to your Joshan Registry Admin</p>
    </div>
  )
}

export default Logo
