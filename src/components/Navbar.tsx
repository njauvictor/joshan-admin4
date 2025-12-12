'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="w-full border-b border-gray-200 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            {/* Using Cloudinary URL as fallback since local images might have issues */}
            <Image
              src="https://res.cloudinary.com/dcxqwes9x/image/upload/v1765514127/jr5_o33jxq.webp"
              alt="Joshan Logo"
              width={60}
              height={60}
              className="object-contain"
              priority
            />
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8 text-sm">
            <a href="#" className="text-gray-700 hover:text-primary transition font-medium">
              Features
            </a>
            <a href="#" className="text-gray-700 hover:text-primary transition font-medium">
              Schools
            </a>
            <a href="#" className="text-gray-700 hover:text-primary transition font-medium">
              Contact
            </a>
            <a href="#" className="text-gray-700 hover:text-primary transition font-medium">
              Resources
            </a>
          </div>

          {/* Desktop Button */}
          <div className="">
            <Link href="/admin">
              <button className="px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all font-semibold shadow-sm">
                Portal Login
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-700" onClick={() => setOpen(!open)}>
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden mt-4 space-y-4 pb-4 animate-fadeIn">
            <a href="#" className="block text-gray-700 hover:text-primary font-medium">
              Features
            </a>
            <a href="#" className="block text-gray-700 hover:text-primary font-medium">
              Schools
            </a>
            <a href="#" className="block text-gray-700 hover:text-primary font-medium">
              Contact
            </a>
            <a href="#" className="block text-gray-700 hover:text-primary font-medium">
              Resources
            </a>

            <Link href="/admin">
              <button className="w-full px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all font-semibold shadow-sm">
                Admin Login
              </button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
