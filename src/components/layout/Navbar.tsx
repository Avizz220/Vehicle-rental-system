'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setIsScrolled(window.scrollY > 0)
    })
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-white'
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <svg
              className="w-8 h-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 17h14v-2a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2z" />
              <path d="M9 13V8a3 3 0 0 1 6 0v5" />
              <circle cx="7" cy="17" r="2" />
              <circle cx="17" cy="17" r="2" />
            </svg>
            <span className="text-2xl font-bold text-gray-900">RentDrive</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => {
                const vehiclesSection = document.getElementById('vehicles-section')
                vehiclesSection?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Vehicles
            </button>
            <button
              onClick={() => {
                const feedbacksSection = document.getElementById('feedbacks-section')
                feedbacksSection?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Feedbacks
            </button>
            <button
              onClick={() => {
                const contactSection = document.getElementById('contact-section')
                contactSection?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Contact
            </button>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <Link
              href="/signin"
              className="text-gray-900 font-medium hover:text-gray-700 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Sign Up
            </Link>
            <button className="text-gray-900">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
