const ServiceDetailModal = ({ isOpen, onClose, service }) => {
  if (!isOpen || !service) return null;

  const {
    images,
    title,
    description,
    price,
    category,
    rating,
    totalReviews,
    totalBookings,
    provider,
    reviews = []
  } = service;

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    const schedule = e.target.schedule.value;
    const duration = parseInt(e.target.duration.value);
    const notes = e.target.notes.value;

    if (!schedule) {
      alert('Please select a schedule');
      return;
    }

    try {
      // TODO: Implement booking API call
      alert('Booking request sent successfully');
      onClose();
    } catch (error) {
      console.error('Error booking service:', error);
      alert('Failed to book service');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75">
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="w-full max-w-3xl bg-gray-900 rounded-2xl shadow-xl">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white"
          >
            ✕
          </button>

          {/* Image Gallery */}
          <div className="relative aspect-video bg-black">
            <img
              src={images[0]}
              alt={title}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="p-6">
            {/* Service Info */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">{title}</h2>
                <div className="text-xl font-bold text-white">${price}</div>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm">
                  {category}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">★</span>
                  <span className="text-white">{rating.toFixed(1)}</span>
                  <span className="text-gray-400">({totalReviews} reviews)</span>
                </div>
                <span className="text-gray-400 text-sm">
                  {totalBookings} bookings
                </span>
              </div>

              <p className="text-gray-300">{description}</p>
            </div>

            {/* Provider Info */}
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl mb-8">
              <img
                src={provider.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(provider.name)}`}
                alt={provider.name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h3 className="text-lg font-semibold text-white">{provider.name}</h3>
                <p className="text-gray-400">{provider.school?.name}</p>
                {provider.school?.province && (
                  <div className="text-gray-400 text-sm mt-1">
                    {provider.school.province}
                  </div>
                )}
              </div>
            </div>

            {/* Booking Form */}
            <form onSubmit={handleBookingSubmit} className="space-y-4 mb-8">
              <h3 className="text-lg font-semibold text-white">Book this service</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Schedule
                  </label>
                  <input
                    type="datetime-local"
                    name="schedule"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Duration (minutes)
                  </label>
                  <select
                    name="duration"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  >
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                    <option value={120}>2 hours</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Notes
                </label>
                <textarea
                  name="notes"
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  placeholder="Any specific requirements or topics you'd like to focus on..."
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
              >
                Book Now
              </button>
            </form>

            {/* Reviews */}
            {reviews.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Reviews</h3>
                <div className="space-y-4">
                  {reviews.map((review, index) => (
                    <div key={index} className="p-4 bg-white/5 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <img
                          src={review.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user.name)}`}
                          alt={review.user.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="text-white font-medium">{review.user.name}</p>
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">★</span>
                            <span className="text-white">{review.rating.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-300">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailModal; 