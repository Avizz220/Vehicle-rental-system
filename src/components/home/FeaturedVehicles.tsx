'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export const FeaturedVehicles = () => {
  const vehicles = [
    {
      id: 1,
      name: 'Tesla Model 3',
      category: 'Electric',
      image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80',
      price: 89,
      features: ['Auto', 'Electric', '5 Seats'],
    },
    {
      id: 2,
      name: 'BMW X5',
      category: 'Luxury SUV',
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
      price: 129,
      features: ['Auto', 'Premium', '7 Seats'],
    },
    {
      id: 3,
      name: 'Mercedes C-Class',
      category: 'Luxury Sedan',
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80',
      price: 99,
      features: ['Auto', 'Luxury', '5 Seats'],
    },
    {
      id: 4,
      name: 'Toyota RAV4',
      category: 'SUV',
      image: 'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=800&q=80',
      price: 69,
      features: ['Auto', 'Hybrid', '5 Seats'],
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Featured Vehicles
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose from our premium selection of vehicles
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {vehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-black text-white px-3 py-1 rounded-full text-sm font-semibold">
                  ${vehicle.price}/day
                </div>
              </div>
              <div className="p-6">
                <div className="text-sm text-gray-500 mb-1">{vehicle.category}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {vehicle.name}
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {vehicle.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                <button className="w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                  Book Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
