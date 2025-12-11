import { ArrowRight, Shield } from 'lucide-react'
import Link from 'next/link'

const Hero = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col items-center justify-center px-4 md:px-12">
      {/* Centered Navigation */}
      <nav className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <p className="text-3xl font-extrabold text-primary">
              Joshan <span className="text-secondary">Registry</span>
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Features
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Schools
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Contact
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Resources
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/admin">
              <button className="cursor-pointer px-6 py-2.5 bg-primary text-white rounded-xl hover:shadow-lg hover:shadow-blue-200 transition-all duration-300 font-medium">
                Admin Login
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Centered Hero Content */}
      <div className="flex-1 flex items-center justify-center w-full">
        <div className="max-w-4xl text-center mx-auto px-4">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/20 text-primary  mx-auto">
            <Shield className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Trusted by 500+ Schools Nationwide</span>
          </div>

          <h1 className="text-primary text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6 mt-6">
            Modern School Management <br />
            <span className="text-secondary mt-2"> Made Simple & Efficient</span>
          </h1>

          <p className=" text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
            Streamline student enrollment, academic tracking, and administrative tasks with our
            all-in-one School Registry and Management Information System. Designed for educators, by
            educators.
          </p>

          {/* Centered CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/admin">
              <button className="cursor-pointer group px-6 py-3 bg-primary text-white rounded-xl hover:shadow-xl hover:shadow-blue-200 transition-all duration-300 flex items-center justify-center w-full sm:w-auto">
                <span className="font-semibold">Admin Login</span>
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="/admin">
              <button className="cursor-pointer flex px-6 py-3 border-2 border-secondary text-gray-700 rounded-xl hover:border-blue-400 hover:text-blue-600 transition-all duration-300 font-semibold w-full sm:w-auto">
                Contact Us
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
