import { useState } from 'react';
import { FiX, FiChevronLeft, FiChevronRight, FiUpload, FiCheck } from 'react-icons/fi';
import axios from 'axios';

const ServiceDetailModal = ({ isOpen, onClose, service }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bookingStep, setBookingStep] = useState('form'); // form, payment, confirmation
  const [bookingData, setBookingData] = useState(null);
  const [paymentProof, setPaymentProof] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  if (!isOpen || !service) return null;

  const {
    images = [],
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

  // Fallback image jika tidak ada gambar
  const defaultImage = "https://placehold.co/600x400/000000/FFFFFF/png?text=No+Image";

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const formData = {
        serviceId: service.id,
        schedule: e.target.schedule.value,
        duration: parseInt(e.target.duration.value),
        notes: e.target.notes.value
      };

      const response = await axios.post('/api/bookings', formData);
      setBookingData(response.data);
      setBookingStep('payment');
    } catch (error) {
      console.error('Error creating booking:', error);
      setError(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentProofUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('File too large. Maximum size is 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed');
      return;
    }

    setPaymentProof(file);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!paymentProof) {
      setError('Please upload payment proof');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('paymentProof', paymentProof);
      formData.append('paymentMethod', e.target.paymentMethod.value);

      await axios.post(
        `/api/bookings/${bookingData.id}/payment-proof`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setBookingStep('confirmation');
    } catch (error) {
      console.error('Error uploading payment proof:', error);
      setError(error.response?.data?.message || 'Failed to upload payment proof');
    } finally {
      setIsLoading(false);
    }
  };

  const renderBookingForm = () => (
    <form onSubmit={handleBookingSubmit} className="space-y-4">
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
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Duration (minutes)
          </label>
          <select
            name="duration"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
            required
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
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50"
      >
        {isLoading ? 'Processing...' : 'Continue to Payment'}
      </button>
    </form>
  );

  const renderPaymentForm = () => (
    <form onSubmit={handlePaymentSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Payment Details</h3>
      
      <div className="bg-gray-800 p-4 rounded-lg">
        <div className="text-sm text-gray-400 mb-1">Total Amount</div>
        <div className="text-2xl font-bold text-white">
          Rp {bookingData.payment.amount.toLocaleString('id-ID')}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-1">
          Payment Method
        </label>
        <select
          name="paymentMethod"
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
          required
        >
          <option value="bank_transfer">Bank Transfer</option>
          <option value="e_wallet">E-Wallet</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-1">
          Payment Proof
        </label>
        <div className="relative border-2 border-dashed border-gray-700 rounded-lg p-4 hover:border-blue-500 transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handlePaymentProofUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center justify-center text-gray-400">
            <FiUpload className="w-8 h-8 mb-2" />
            <div className="text-sm">
              {paymentProof ? paymentProof.name : 'Click or drag to upload payment proof'}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={isLoading || !paymentProof}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50"
      >
        {isLoading ? 'Processing...' : 'Submit Payment'}
      </button>
    </form>
  );

  const renderConfirmation = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <FiCheck className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">
        Payment Submitted Successfully
      </h3>
      <p className="text-gray-400 mb-6">
        Your payment is being verified. We'll notify you once it's confirmed.
      </p>
      <button
        onClick={onClose}
        className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
      >
        Close
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75">
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="w-full max-w-3xl bg-gray-900 rounded-2xl shadow-xl">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white"
          >
            <FiX className="w-6 h-6" />
          </button>

          {/* Image Carousel */}
          <div className="relative aspect-video rounded-t-2xl overflow-hidden bg-black">
            <img
              src={images[currentImageIndex] || defaultImage}
              alt={`${title} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-contain"
              onError={(e) => {
                console.error('Image failed to load:', {
                  url: images[currentImageIndex],
                  fallback: defaultImage
                });
                e.target.src = defaultImage;
              }}
            />
            
            {/* Navigation Arrows - hanya tampil jika ada lebih dari 1 gambar */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full transition-colors"
                >
                  <FiChevronLeft className="w-6 h-6" />
                </button>
                
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full transition-colors"
                >
                  <FiChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Dot Navigation */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex 
                        ? 'bg-white scale-125' 
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Service Info - selalu tampil */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
              <div className="inline-block bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-sm">
                {category}
              </div>

              <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
                <div className="flex items-center">
                  <span className="text-yellow-500 mr-1">★</span>
                  <span>{rating?.toFixed(1) || '0.0'}</span>
                  <span className="ml-1">({totalReviews || 0} reviews)</span>
                </div>
                <div>{totalBookings || 0} bookings</div>
              </div>

              <p className="text-gray-300 mt-4">{description}</p>

              <div className="mt-4">
                <div className="text-sm text-gray-400 mb-1">Price</div>
                <div className="text-2xl font-bold text-white">
                  Rp {parseInt(price).toLocaleString('id-ID')}
                </div>
              </div>
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

            {/* Dynamic Content based on booking step */}
            {bookingStep === 'form' && renderBookingForm()}
            {bookingStep === 'payment' && renderPaymentForm()}
            {bookingStep === 'confirmation' && renderConfirmation()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailModal; 