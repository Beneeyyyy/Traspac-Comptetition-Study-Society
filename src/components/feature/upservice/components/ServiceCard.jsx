import { motion } from 'framer-motion'

const ServiceCard = ({ service, onCardClick }) => {
  return (
    <motion.div
      onClick={() => onCardClick(service)}
      className="relative p-4 rounded-xl border bg-white/[0.02] border-white/10 hover:bg-white/[0.05] transition-colors cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Showcase Images */}
      {service.showcaseImages && service.showcaseImages.length > 0 && (
        <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden">
          <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
            {service.showcaseImages.map((image, index) => (
              <div key={index} className="relative flex-none w-full h-40 snap-center">
                <img
                  src={image}
                  alt={`${service.title} showcase ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
          {service.showcaseImages.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {service.showcaseImages.map((_, index) => (
                <div
                  key={index}
                  className="w-1 h-1 rounded-full bg-white/50"
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Service Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
          <service.icon className="text-xl text-white/60" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-white text-base truncate">{service.title}</h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(service.provider.rating)
                      ? 'text-yellow-400'
                      : 'text-gray-500'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-white/60 text-xs">
              {service.provider.rating} ({service.provider.totalReviews})
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-base font-semibold text-white">{service.price}</p>
        </div>
      </div>

      {/* Provider Info */}
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/5">
        <img
          src={service.provider.image}
          alt={service.provider.name}
          className="w-8 h-8 rounded-full object-cover"
        />
        <div className="min-w-0">
          <h4 className="font-medium text-white text-sm truncate">{service.provider.name}</h4>
          <p className="text-xs text-white/40 truncate">{service.provider.location}</p>
        </div>
      </div>

      {/* Service Description */}
      <p className="text-xs text-white/60 mb-3 line-clamp-2">{service.description}</p>

      {/* Service Stats */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-white/5 rounded-lg p-2">
          <p className="text-xs text-white/40">Total Services</p>
          <p className="text-sm font-semibold text-white">{service.provider.totalServices}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-2">
          <p className="text-xs text-white/40">Category</p>
          <p className="text-sm font-semibold text-white">{service.category}</p>
        </div>
      </div>

      {/* Action Button */}
      <button className="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-xs font-medium">
        Contact Provider
      </button>
    </motion.div>
  )
}

export default ServiceCard 