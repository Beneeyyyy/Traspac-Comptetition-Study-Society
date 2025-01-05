const ServiceCard = ({ service, onCardClick }) => {
  const {
    images,
    title,
    description,
    price,
    category,
    rating,
    totalReviews,
    provider
  } = service;

  return (
    <div 
      className="group bg-gray-900 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/20"
      onClick={() => onCardClick(service)}
    >
      {/* Service Image */}
      <div className="relative h-48">
        <img
          src={images[0]}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent opacity-60"></div>
        <div className="absolute top-4 right-4 bg-blue-500 px-4 py-2 rounded-lg shadow-lg transform transition-transform duration-300 group-hover:-translate-y-1">
          <span className="text-white font-semibold">Rp{price.toLocaleString()}</span>
        </div>
        <div className="absolute top-4 left-4 bg-gray-900/80 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-white text-sm font-medium">{category}</span>
        </div>
      </div>

      {/* Service Info */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2 truncate group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2 group-hover:text-gray-300 transition-colors">
          {description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-lg">
            <span className="text-yellow-500">★</span>
            <span className="text-yellow-500 font-semibold">{rating.toFixed(1)}</span>
          </div>
          <span className="text-gray-400 text-sm">({totalReviews.toLocaleString()} reviews)</span>
        </div>

        {/* Provider Info */}
        <div className="flex items-center justify-between border-t border-gray-800 pt-4 mt-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={provider.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(provider.name)}&background=random`}
                alt={provider.name}
                className="w-10 h-10 rounded-full border-2 border-blue-500/50"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
            </div>
            <div>
              <p className="text-white text-sm font-semibold group-hover:text-blue-400 transition-colors">{provider.name}</p>
              <p className="text-gray-400 text-xs">{provider.school?.name}</p>
            </div>
          </div>
          {provider.school?.province && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-gray-400 text-xs">{provider.school.province}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard; 