'use client'

import { motion } from 'framer-motion'

export const VehicleCategories = () => {
  const categories = [
    {
      id: 1,
      name: 'Economy',
      description: 'Perfect for city driving and daily commutes',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80',
      price: 35,
      badge: 'Popular',
    },
    {
      id: 2,
      name: 'Luxury',
      description: 'Premium vehicles for special occasions',
      image: 'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=800&q=80',
      price: 89,
      badge: null,
    },
    {
      id: 3,
      name: 'SUV',
      description: 'Spacious and versatile for family trips',
      image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80',
      price: 65,
      badge: null,
    },
    {
      id: 4,
      name: 'Scooter',
      description: 'Convenient and affordable for quick trips',
      image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80',
      price: 15,
      badge: 'Popular',
    },
  ]

  return (
    <section id="vehicles-section" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Popular Vehicle Categories
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Choose from our diverse fleet of vehicles, each category designed to meet specific travel needs
            <br />
            and preferences.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer group"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {category.badge && (
                  <div className="absolute top-4 right-4 bg-black text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {category.badge}
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Starting from</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${category.price}
                      <span className="text-sm text-gray-500 font-normal">/day</span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
