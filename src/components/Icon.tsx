import React from 'react'
import Image from 'next/image'

const Icon = () => {
  return (
    <div className="logo-container">
      <Image
        src="https://res.cloudinary.com/dcxqwes9x/image/upload/v1765526868/icon_aan16p.ico"
        alt="Icon"
        width={60}
        height={60}
        className="Icon-image"
        priority
      />
    </div>
  )
}

export default Icon
