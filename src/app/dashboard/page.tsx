'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const TripMap = dynamic(() => import('@/components/map/TripMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-gray-500">Loading map...</div>
    </div>
  ),
})

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [trips, setTrips] = useState([
    {
      id: 1,
      vehicle: 'Tesla Model 3',
      category: 'Electric',
      image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&q=80',
      pickupDate: '2025-11-15',
      returnDate: '2025-11-18',
      pickupLocation: 'Downtown LA',
      returnLocation: 'Downtown LA',
      status: 'completed',
      price: 285,
      features: ['Auto', 'Electric', 'GPS', 'Insurance'],
    },
    {
      id: 2,
      vehicle: 'BMW X5',
      category: 'SUV',
      image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&q=80',
      pickupDate: '2025-12-15',
      returnDate: '2025-12-18',
      pickupLocation: 'Airport Terminal',
      returnLocation: 'Airport Terminal',
      status: 'active',
      price: 450,
      features: ['7 Seats', 'Auto', 'Premium', '4WD'],
    },
    {
      id: 3,
      vehicle: 'Honda CR-V',
      category: 'SUV',
      image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&q=80',
      pickupDate: '2025-12-22',
      returnDate: '2025-12-27',
      pickupLocation: 'Santa Monica',
      returnLocation: 'Beverly Hills',
      status: 'upcoming',
      price: 325,
      features: ['5 Seats', 'Auto', 'AC', 'Bluetooth'],
    },
    {
      id: 4,
      vehicle: 'Toyota Camry',
      category: 'Economy',
      image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&q=80',
      pickupDate: '2025-10-05',
      returnDate: '2025-10-08',
      pickupLocation: 'Hollywood',
      returnLocation: 'Hollywood',
      status: 'completed',
      price: 210,
      features: ['5 Seats', 'Auto', 'AC', 'Bluetooth'],
    },
    {
      id: 5,
      vehicle: 'Mercedes-Benz C-Class',
      category: 'Luxury',
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&q=80',
      pickupDate: '2025-11-01',
      returnDate: '2025-11-03',
      pickupLocation: 'Beverly Hills',
      returnLocation: 'Downtown LA',
      status: 'cancelled',
      price: 267,
      features: ['5 Seats', 'Auto', 'Premium', 'GPS'],
    },
  ])
  const [editingTrip, setEditingTrip] = useState<number | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [useMapSelection, setUseMapSelection] = useState(false)
  const [selectedMapLocations, setSelectedMapLocations] = useState<any[]>([])

  const stats = [
    {
      label: 'Active Bookings',
      value: '2',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: 'bg-blue-500',
      change: '+1',
    },
    {
      label: 'Upcoming Trips',
      value: '3',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      bgColor: 'bg-green-500',
      change: '+2',
    },
    {
      label: 'Total Spent',
      value: '$1,245',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: 'bg-purple-500',
      change: '+$345',
    },
    {
      label: 'Reward Points',
      value: '850',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      bgColor: 'bg-yellow-500',
      change: '+150',
    },
  ]

  const upcomingTrips = [
    {
      id: 1,
      vehicle: 'Tesla Model 3',
      category: 'Electric',
      image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&q=80',
      pickupDate: '2025-12-15',
      returnDate: '2025-12-18',
      location: 'Downtown LA',
      status: 'confirmed',
      price: '$285',
    },
    {
      id: 2,
      vehicle: 'BMW X5',
      category: 'SUV',
      image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&q=80',
      pickupDate: '2025-12-22',
      returnDate: '2025-12-27',
      location: 'Airport Terminal',
      status: 'pending',
      price: '$450',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3 }}
            className="fixed left-0 top-0 h-full w-72 bg-gray-900 text-white z-40 shadow-2xl"
          >
            <div className="p-6">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 mb-12">
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
                <span className="text-2xl font-bold">RentDrive</span>
              </Link>

              {/* Navigation */}
              <nav className="space-y-2">
                {[
                  { id: 'overview', label: 'Overview', icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  )},
                  { id: 'book-trip', label: 'Book a Trip', icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  )},
                  { id: 'my-trips', label: 'My Trips', icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  )},
                  { id: 'vehicles', label: 'Browse Vehicles', icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  )},
                  { id: 'profile', label: 'Profile', icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )},
                  { id: 'settings', label: 'Settings', icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )},
                ].map((item) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ x: 5 }}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === item.id
                        ? 'bg-white text-gray-900 font-semibold'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </motion.button>
                ))}
              </nav>
            </div>

            {/* User Profile Section */}
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-800">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80"
                  alt="User"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="font-semibold">John Doe</p>
                  <p className="text-sm text-gray-400">Premium Member</p>
                </div>
                <button className="text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                {activeTab === 'overview' && 'Dashboard Overview'}
                {activeTab === 'book-trip' && 'Book a New Trip'}
                {activeTab === 'my-trips' && 'My Trips'}
                {activeTab === 'vehicles' && 'Browse Vehicles'}
                {activeTab === 'profile' && 'My Profile'}
                {activeTab === 'settings' && 'Settings'}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <button 
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative text-gray-600 hover:text-gray-900"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">3</span>
                </button>

                {/* Notifications Dropdown */}
                <AnimatePresence>
                  {notificationsOpen && (
                    <>
                      {/* Backdrop */}
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setNotificationsOpen(false)}
                      />
                      
                      {/* Notification Panel */}
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden z-50"
                      >
                        {/* Header */}
                        <div className="bg-gray-900 text-white px-5 py-4 flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-lg">Notifications</h3>
                            <p className="text-sm text-gray-300">You have 3 unread messages</p>
                          </div>
                          <button
                            onClick={() => setNotificationsOpen(false)}
                            className="text-gray-300 hover:text-white"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-96 overflow-y-auto">
                          {/* Notification Item 1 */}
                          <div className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <div className="px-5 py-4">
                              <div className="flex items-start gap-3">
                                <div className="bg-green-100 text-green-600 rounded-full p-2 flex-shrink-0">
                                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-start justify-between mb-1">
                                    <h4 className="font-semibold text-gray-900">Booking Confirmed</h4>
                                    <span className="text-xs text-gray-500">2 min ago</span>
                                  </div>
                                  <p className="text-sm text-gray-600">Your Tesla Model 3 booking for Dec 15-18 has been confirmed.</p>
                                  <button className="mt-2 text-sm text-gray-900 font-medium hover:underline">View Details</button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Notification Item 2 */}
                          <div className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <div className="px-5 py-4">
                              <div className="flex items-start gap-3">
                                <div className="bg-blue-100 text-blue-600 rounded-full p-2 flex-shrink-0">
                                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-start justify-between mb-1">
                                    <h4 className="font-semibold text-gray-900">Pickup Reminder</h4>
                                    <span className="text-xs text-gray-500">1 hour ago</span>
                                  </div>
                                  <p className="text-sm text-gray-600">Don't forget to pick up your BMW X5 tomorrow at 10:00 AM.</p>
                                  <button className="mt-2 text-sm text-gray-900 font-medium hover:underline">Set Reminder</button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Notification Item 3 */}
                          <div className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <div className="px-5 py-4">
                              <div className="flex items-start gap-3">
                                <div className="bg-purple-100 text-purple-600 rounded-full p-2 flex-shrink-0">
                                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-start justify-between mb-1">
                                    <h4 className="font-semibold text-gray-900">Reward Points Earned</h4>
                                    <span className="text-xs text-gray-500">3 hours ago</span>
                                  </div>
                                  <p className="text-sm text-gray-600">You've earned 150 reward points from your recent trip!</p>
                                  <button className="mt-2 text-sm text-gray-900 font-medium hover:underline">View Rewards</button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Notification Item 4 */}
                          <div className="hover:bg-gray-50 transition-colors">
                            <div className="px-5 py-4">
                              <div className="flex items-start gap-3">
                                <div className="bg-yellow-100 text-yellow-600 rounded-full p-2 flex-shrink-0">
                                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-start justify-between mb-1">
                                    <h4 className="font-semibold text-gray-900">Special Offer</h4>
                                    <span className="text-xs text-gray-500">1 day ago</span>
                                  </div>
                                  <p className="text-sm text-gray-600">Get 20% off on luxury vehicles this weekend. Limited time offer!</p>
                                  <button className="mt-2 text-sm text-gray-900 font-medium hover:underline">View Offer</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
                          <button className="w-full text-center text-sm font-medium text-gray-900 hover:text-gray-700">
                            Mark all as read
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className={`${stat.bgColor} text-white p-2 rounded-md`}>
                          {stat.icon}
                        </div>
                        <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">{stat.change}</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg p-6 text-white"
                  >
                    <h3 className="text-lg font-bold mb-2">Ready for Your Next Adventure?</h3>
                    <p className="text-gray-300 text-sm mb-4">Book your next trip and earn double reward points this month!</p>
                    <button
                      onClick={() => setActiveTab('book-trip')}
                      className="bg-white text-gray-900 px-5 py-2 rounded-md text-sm font-semibold hover:bg-gray-100 transition-all"
                    >
                      Book Now
                    </button>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
                  >
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Membership Benefits</h3>
                    <ul className="space-y-2">
                      {['Free cancellation up to 24hrs', 'Priority customer support', 'Exclusive discounts', 'Earn reward points'].map((benefit) => (
                        <li key={benefit} className="flex items-center gap-2 text-sm text-gray-700">
                          <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>

                {/* Upcoming Trips */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Upcoming Trips</h2>
                    <button
                      onClick={() => setActiveTab('my-trips')}
                      className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                    >
                      View All →
                    </button>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {upcomingTrips.map((trip) => (
                      <div
                        key={trip.id}
                        className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="flex">
                          <img
                            src={trip.image}
                            alt={trip.vehicle}
                            className="w-32 h-32 object-cover"
                          />
                          <div className="p-4 flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-base font-bold text-gray-900">{trip.vehicle}</h3>
                                <p className="text-xs text-gray-600">{trip.category}</p>
                              </div>
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                trip.status === 'confirmed' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                              }`}>
                                {trip.status.toUpperCase()}
                              </span>
                            </div>
                            <div className="space-y-1 text-xs text-gray-600 mb-3">
                              <p className="flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {trip.pickupDate} - {trip.returnDate}
                              </p>
                              <p className="flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                </svg>
                                {trip.location}
                              </p>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-lg font-bold text-gray-900">{trip.price}</p>
                              <button className="px-3 py-1 bg-gray-900 text-white rounded text-xs font-medium hover:bg-gray-800 transition-all">
                                Details
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {activeTab === 'book-trip' && (
              <motion.div
                key="book-trip"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="max-w-5xl mx-auto space-y-4">
                  {/* Booking Form */}
                  <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-gray-900">Rental Details</h2>
                      <button
                        type="button"
                        onClick={() => setUseMapSelection(!useMapSelection)}
                        className={`px-4 py-2 rounded-md font-medium transition-all ${
                          useMapSelection
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                          </svg>
                          {useMapSelection ? 'Use Dropdown' : 'Use Map'}
                        </span>
                      </button>
                    </div>

                    {useMapSelection ? (
                      <TripMap onLocationsChange={setSelectedMapLocations} />
                    ) : (
                      <form className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Pickup Location
                            </label>
                            <select className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent">
                              <option value="">Select location</option>
                              <option value="colombo">Colombo</option>
                              <option value="kandy">Kandy</option>
                              <option value="galle">Galle</option>
                              <option value="jaffna">Jaffna</option>
                              <option value="negombo">Negombo</option>
                              <option value="anuradhapura">Anuradhapura</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Return Location
                            </label>
                            <select className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent">
                              <option value="">Select location</option>
                              <option value="colombo">Colombo</option>
                              <option value="kandy">Kandy</option>
                              <option value="galle">Galle</option>
                              <option value="jaffna">Jaffna</option>
                              <option value="negombo">Negombo</option>
                              <option value="anuradhapura">Anuradhapura</option>
                            </select>
                          </div>
                        </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Pickup Date
                          </label>
                          <input
                            type="date"
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Pickup Time
                          </label>
                          <input
                            type="time"
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Return Date
                          </label>
                          <input
                            type="date"
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Return Time
                          </label>
                          <input
                            type="time"
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                          />
                        </div>
                      </div>
                    </form>
                    )}
                  </div>

                  {/* Vehicle Selection */}
                  <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Select Your Vehicle</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          id: 1,
                          name: 'Toyota Camry',
                          category: 'Economy',
                          image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&q=80',
                          price: 35,
                          features: ['5 Seats', 'Auto', 'AC', 'Bluetooth'],
                        },
                        {
                          id: 2,
                          name: 'BMW 5 Series',
                          category: 'Luxury',
                          image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&q=80',
                          price: 89,
                          features: ['5 Seats', 'Auto', 'Premium', 'GPS'],
                        },
                        {
                          id: 3,
                          name: 'Honda CR-V',
                          category: 'SUV',
                          image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&q=80',
                          price: 65,
                          features: ['7 Seats', 'Auto', 'AC', '4WD'],
                        },
                        {
                          id: 4,
                          name: 'Vespa Scooter',
                          category: 'Scooter',
                          image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400&q=80',
                          price: 15,
                          features: ['1 Seat', 'Manual', 'Helmet', 'Storage'],
                        },
                      ].map((vehicle) => (
                        <div
                          key={vehicle.id}
                          className="border-2 border-gray-200 rounded-lg p-4 hover:border-gray-900 cursor-pointer transition-all"
                        >
                          <div className="flex gap-4">
                            <img
                              src={vehicle.image}
                              alt={vehicle.name}
                              className="w-24 h-20 object-cover rounded"
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="font-bold text-gray-900">{vehicle.name}</h3>
                                  <p className="text-sm text-gray-600">{vehicle.category}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xl font-bold text-gray-900">${vehicle.price}</p>
                                  <p className="text-sm text-gray-600">/day</p>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {vehicle.features.map((feature) => (
                                  <span
                                    key={feature}
                                    className="px-2 py-0.5 bg-gray-100 text-gray-700 text-sm rounded"
                                  >
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Additional Options */}
                  <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Options</h2>
                    <div className="space-y-3">
                      {[
                        { id: 'insurance', label: 'Full Insurance Coverage', price: 15 },
                        { id: 'gps', label: 'GPS Navigation System', price: 5 },
                        { id: 'child-seat', label: 'Child Safety Seat', price: 8 },
                        { id: 'wifi', label: 'Mobile WiFi Hotspot', price: 10 },
                      ].map((option) => (
                        <label
                          key={option.id}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                            />
                            <span className="text-gray-700">{option.label}</span>
                          </div>
                          <span className="font-semibold text-gray-900">+${option.price}/day</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Booking Summary */}
                  <div className="bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg p-5 text-white">
                    <h2 className="text-xl font-bold mb-4">Booking Summary</h2>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Vehicle Rental (3 days)</span>
                        <span className="font-semibold">$105.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Additional Options</span>
                        <span className="font-semibold">$0.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Taxes & Fees</span>
                        <span className="font-semibold">$12.60</span>
                      </div>
                      <div className="border-t border-gray-600 pt-2 mt-2">
                        <div className="flex justify-between">
                          <span className="font-bold text-lg">Total Amount</span>
                          <span className="font-bold text-2xl">$117.60</span>
                        </div>
                      </div>
                    </div>
                    <button className="w-full bg-white text-gray-900 py-3 rounded-md font-bold hover:bg-gray-100 transition-all">
                      Proceed to Payment
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'my-trips' && (
              <motion.div
                key="my-trips"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="max-w-6xl mx-auto">
                  {/* Filter Tabs */}
                  <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 mb-4">
                    <div className="flex gap-3">
                      {['all', 'active', 'upcoming', 'completed', 'cancelled'].map((filter) => (
                        <button
                          key={filter}
                          className={`px-4 py-2 rounded-md font-medium transition-all ${
                            filter === 'all'
                              ? 'bg-gray-900 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Trips Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {trips.map((trip) => (
                      <div
                        key={trip.id}
                        className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
                      >
                        {/* Vehicle Image */}
                        <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                          <img
                            src={trip.image}
                            alt={trip.vehicle}
                            className="w-full h-full object-cover"
                          />
                          <span
                            className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${
                              trip.status === 'completed'
                                ? 'bg-green-100 text-green-700'
                                : trip.status === 'active'
                                ? 'bg-blue-100 text-blue-700'
                                : trip.status === 'upcoming'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                          </span>
                        </div>

                        {/* Trip Details */}
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-bold text-lg text-gray-900">{trip.vehicle}</h3>
                              <p className="text-sm text-gray-600">{trip.category}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-gray-900">${trip.price}</p>
                              <p className="text-xs text-gray-500">Total cost</p>
                            </div>
                          </div>

                          {/* Trip Info */}
                          <div className="space-y-2 mb-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>{trip.pickupDate} to {trip.returnDate}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span>{trip.pickupLocation} → {trip.returnLocation}</span>
                            </div>
                          </div>

                          {/* Features */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {trip.features.map((feature) => (
                              <span
                                key={feature}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 pt-3 border-t border-gray-100">
                            {(trip.status === 'upcoming' || trip.status === 'active') && (
                              <>
                                <button
                                  onClick={() => setEditingTrip(trip.id)}
                                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-blue-600 border border-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  <span className="text-sm font-medium">Edit</span>
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(trip.id)}
                                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 border border-red-600 hover:bg-red-50 rounded-md transition-colors"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  <span className="text-sm font-medium">Cancel</span>
                                </button>
                              </>
                            )}
                            <button
                              className={`${(trip.status === 'upcoming' || trip.status === 'active') ? 'flex-1' : 'w-full'} px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors`}
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Edit Trip Modal */}
                <AnimatePresence>
                  {editingTrip && (
                    <>
                      <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-50"
                        onClick={() => setEditingTrip(null)}
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                      >
                        <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                          <div className="sticky top-0 bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
                            <h3 className="text-xl font-bold">Edit Trip</h3>
                            <button
                              onClick={() => setEditingTrip(null)}
                              className="text-gray-300 hover:text-white"
                            >
                              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          <div className="p-6">
                            <form className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Pickup Date
                                  </label>
                                  <input
                                    type="date"
                                    defaultValue={trips.find(t => t.id === editingTrip)?.pickupDate}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Return Date
                                  </label>
                                  <input
                                    type="date"
                                    defaultValue={trips.find(t => t.id === editingTrip)?.returnDate}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Pickup Location
                                </label>
                                <select
                                  defaultValue={trips.find(t => t.id === editingTrip)?.pickupLocation}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                >
                                  <option value="Downtown LA">Downtown LA</option>
                                  <option value="Airport Terminal">Airport Terminal</option>
                                  <option value="Santa Monica">Santa Monica</option>
                                  <option value="Beverly Hills">Beverly Hills</option>
                                  <option value="Hollywood">Hollywood</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Return Location
                                </label>
                                <select
                                  defaultValue={trips.find(t => t.id === editingTrip)?.returnLocation}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                >
                                  <option value="Downtown LA">Downtown LA</option>
                                  <option value="Airport Terminal">Airport Terminal</option>
                                  <option value="Santa Monica">Santa Monica</option>
                                  <option value="Beverly Hills">Beverly Hills</option>
                                  <option value="Hollywood">Hollywood</option>
                                </select>
                              </div>
                              <div className="flex gap-3 pt-4">
                                <button
                                  type="button"
                                  onClick={() => setEditingTrip(null)}
                                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    setEditingTrip(null)
                                  }}
                                  className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-md font-medium hover:bg-gray-800 transition-colors"
                                >
                                  Save Changes
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>

                {/* Delete Confirmation Modal */}
                <AnimatePresence>
                  {deleteConfirm && (
                    <>
                      <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-50"
                        onClick={() => setDeleteConfirm(null)}
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                      >
                        <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
                          <div className="p-6">
                            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                              Cancel Trip?
                            </h3>
                            <p className="text-gray-600 text-center mb-6">
                              Are you sure you want to cancel this trip? This action cannot be undone and cancellation fees may apply.
                            </p>
                            <div className="flex gap-3">
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors"
                              >
                                Keep Trip
                              </button>
                              <button
                                onClick={() => {
                                  setTrips(trips.filter(t => t.id !== deleteConfirm))
                                  setDeleteConfirm(null)
                                }}
                                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors"
                              >
                                Cancel Trip
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-4xl mx-auto"
              >
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h2>
                  <div className="flex items-center gap-6 mb-8">
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80"
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">John Doe</h3>
                      <p className="text-gray-600">john.doe@example.com</p>
                      <span className="inline-block mt-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                        Premium Member
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Member Since</p>
                      <p className="text-lg font-semibold text-gray-900">January 2024</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
                      <p className="text-lg font-semibold text-gray-900">12 Trips</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Reward Points</p>
                      <p className="text-lg font-semibold text-gray-900">850 Points</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Phone Number</p>
                      <p className="text-lg font-semibold text-gray-900">+1 (555) 123-4567</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-4xl mx-auto space-y-4"
              >
                {/* Profile Picture Upload */}
                <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Profile Picture</h2>
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <img
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80"
                        alt="Profile"
                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                      />
                      <button className="absolute bottom-0 right-0 bg-gray-900 text-white p-1.5 rounded-full hover:bg-gray-800 transition-all">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-2">Upload a new profile picture</p>
                      <div className="flex gap-2">
                        <label className="cursor-pointer">
                          <input type="file" accept="image/*" className="hidden" />
                          <span className="inline-block px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800 transition-all">
                            Choose File
                          </span>
                        </label>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-all">
                          Remove
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF. Max size 2MB.</p>
                    </div>
                  </div>
                </div>

                {/* Profile Settings */}
                <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Profile Settings</h2>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          defaultValue="John"
                          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          defaultValue="Doe"
                          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        defaultValue="john.doe@example.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        defaultValue="+1 (555) 123-4567"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        defaultValue="1990-01-01"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <textarea
                        rows={2}
                        defaultValue="123 Main Street, Apt 4B"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="px-5 py-2 bg-gray-900 text-white text-sm rounded-md font-medium hover:bg-gray-800 transition-all"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>

                {/* Password Settings */}
                <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Change Password</h2>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter current password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter new password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Min 8 characters with uppercase, lowercase, number and special character.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="px-5 py-2 bg-gray-900 text-white text-sm rounded-md font-medium hover:bg-gray-800 transition-all"
                      >
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>

                {/* Notification Settings */}
                <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Notification Preferences</h2>
                  <div className="space-y-3">
                    {[
                      { id: 'email-bookings', label: 'Email notifications for bookings', checked: true },
                      { id: 'email-promotions', label: 'Promotional emails and offers', checked: true },
                      { id: 'sms-reminders', label: 'SMS reminders for upcoming trips', checked: false },
                      { id: 'push-notifications', label: 'Push notifications', checked: true },
                    ].map((pref) => (
                      <label key={pref.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked={pref.checked}
                          className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                        />
                        <span className="text-sm text-gray-700">{pref.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-white rounded-lg shadow-sm p-5 border-2 border-red-200">
                  <h2 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <button className="px-5 py-2 bg-red-600 text-white text-sm rounded-md font-medium hover:bg-red-700 transition-all">
                    Delete Account
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
