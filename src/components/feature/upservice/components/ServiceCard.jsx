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
      className="bg-gray-900 rounded-xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform"
      onClick={() => onCardClick(service)}
    >
      {/* Service Image */}
      <div className="relative h-48">
        <img
          src={images[0]}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-black/50 px-3 py-1 rounded-full">
          <span className="text-white font-medium">${price}</span>
        </div>
        <div className="absolute top-4 left-4 bg-black/50 px-3 py-1 rounded-full">
          <span className="text-white font-medium">{category}</span>
        </div>
      </div>

      {/* Service Info */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-2 truncate">
          {title}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">★</span>
            <span className="text-white font-medium">{rating.toFixed(1)}</span>
          </div>
          <span className="text-gray-400 text-sm">({totalReviews} reviews)</span>
        </div>

        {/* Provider Info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <img
              src={provider.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(provider.name)}`}
              alt={provider.name}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="text-white text-sm font-medium">{provider.name}</p>
              <p className="text-gray-400 text-xs">{provider.school?.name}</p>
            </div>
          </div>
          {provider.school?.province && (
            <div className="text-gray-400 text-xs">
              {provider.school.province}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard; 