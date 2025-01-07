const ServiceCard = ({ service, onCardClick }) => {
  const {
    images = [],
    title,
    description,
    price,
    category,
    rating,
    totalReviews,
    provider
  } = service;

  // Fallback image jika tidak ada gambar
  const defaultImage = "https://placehold.co/600x400/000000/FFFFFF/png?text=No+Image";

  // Validasi dan logging untuk debugging
  console.log('Service data:', {
    id: service.id,
    title,
    hasImages: images && images.length > 0,
    imagesArray: images,
    firstImage: images?.[0],
    isFirstImageString: typeof images?.[0] === 'string',
    imageType: images?.[0] ? typeof images[0] : 'undefined'
  });

  const imageUrl = images?.[0];
  console.log('Image URL to display:', {
    url: imageUrl || 'Using default image',
    isValidUrl: imageUrl?.startsWith('http') || imageUrl?.startsWith('data:image'),
  });

  return (
    <div 
      className="group relative bg-gradient-to-t from-blue-950 via-black to-black/80 backdrop-blur-sm rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10 border border-white/5 h-[440px] flex flex-col"
      onClick={() => onCardClick(service)}
    >
      {/* Service Image Container */}
      <div className="relative h-52">
        <img
          src={imageUrl || defaultImage}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            console.error('Image failed to load:', {
              attemptedUrl: imageUrl,
              fallbackUrl: defaultImage,
              error: e.error
            });
            e.target.src = defaultImage;
          }}
        />
        {/* Gradient overlay untuk memastikan kontras */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40"></div>
        
        {/* Category - dipindah ke bawah untuk kontras lebih baik */}
        <div className="absolute bottom-4 left-4">
          <div className="bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10 group-hover:border-white/20 transition-colors">
            <span className="text-white text-sm font-medium">{category}</span>
          </div>
        </div>

        {/* Price - dengan efek glass morphism yang elegan */}
        <div className="absolute top-4 right-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-xl rounded-xl group-hover:blur-2xl transition-all"></div>
            <div className="relative bg-black/50 backdrop-blur-md border border-white/10 group-hover:border-white/20 px-4 py-2 rounded-xl transition-all duration-300 group-hover:-translate-y-1">
              <div className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-bold">
                Rp{price.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Info - dengan flex grow untuk konsistensi */}
      <div className="relative flex-grow flex flex-col p-5 bg-gradient-to-br from-black via-black/95 to-black/90">
        {/* Title & Description */}
        <div className="space-y-2 mb-4">
          <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 truncate group-hover:from-blue-400 group-hover:to-purple-400 transition-all">
            {title}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-2 group-hover:text-gray-300 transition-colors">
            {description}
          </p>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center gap-3 mb-4">
          {/* Rating */}
          <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-yellow-500/10">
            <span className="text-yellow-500">★</span>
            <span className="text-white font-semibold">{rating.toFixed(1)}</span>
          </div>
          <span className="text-gray-500 text-sm group-hover:text-gray-400">
            {totalReviews.toLocaleString()} reviews
          </span>
          {/* Location */}
          {provider.school?.province && (
            <div className="flex items-center gap-1.5 ml-auto">
              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"></div>
              <span className="text-gray-400 text-xs">{provider.school.province}</span>
            </div>
          )}
        </div>

        {/* Provider Info - dengan margin-top auto untuk posisi konsisten */}
        <div className="flex items-center gap-3 pt-3 mt-auto border-t border-white/5">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur"></div>
            <img
              src={provider.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(provider.name)}&background=random`}
              alt={provider.name}
              className="relative w-9 h-9 rounded-full border border-white/10 group-hover:border-white/20 transition-colors"
            />
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-gradient-to-r from-green-400 to-green-500 rounded-full border-2 border-black"></div>
          </div>
          <div>
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 text-sm font-semibold group-hover:from-blue-400 group-hover:to-purple-400 transition-all">
              {provider.name}
            </p>
            <p className="text-gray-500 text-xs group-hover:text-gray-400">{provider.school?.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard; 