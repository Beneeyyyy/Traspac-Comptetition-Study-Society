import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { FiCalendar, FiMapPin, FiClock, FiDollarSign, FiX, FiMessageCircle, FiShare2, FiStar } from 'react-icons/fi'

const ServiceDetailModal = ({ isOpen, onClose, service }) => {
  const [activeTab, setActiveTab] = useState('overview')
  if (!service) return null

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'faq', label: 'FAQ' },
    { id: 'schedule', label: 'Schedule' }
  ]

  const reviews = [
    {
      id: 1,
      user: { name: 'Alex Thompson', image: 'https://i.pravatar.cc/150?img=11' },
      rating: 5,
      date: '2 weeks ago',
      comment: 'Excellent service! The mentor was very knowledgeable and helped me understand complex concepts easily.'
    },
    {
      id: 2,
      user: { name: 'Maria Garcia', image: 'https://i.pravatar.cc/150?img=12' },
      rating: 4,
      date: '1 month ago',
      comment: 'Very professional and patient. Would definitely recommend!'
    }
  ]

  const faqs = [
    {
      question: "What should I prepare before the session?",
      answer: "Please have your development environment set up and prepare any specific questions you'd like to discuss."
    },
    {
      question: "Can I reschedule my session?",
      answer: "Yes, you can reschedule up to 24 hours before the scheduled session."
    },
    {
      question: "What is your refund policy?",
      answer: "Full refund available if cancelled 24 hours before the session."
    }
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative"
          >
            {/* Close and Share Buttons */}
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <button
                onClick={() => {/* Share functionality */}}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 transition-colors text-white/70 hover:text-white"
              >
                <FiShare2 className="text-xl" />
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 transition-colors text-white/70 hover:text-white"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            {/* Image Gallery */}
            <div className="relative h-80">
              <div className="absolute inset-0">
                <div className="flex h-full snap-x snap-mandatory overflow-x-auto">
                  {service.showcaseImages.map((image, index) => (
                    <div key={index} className="flex-none w-full h-full snap-center">
                      <img
                        src={image}
                        alt={`${service.title} showcase ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                {service.showcaseImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {service.showcaseImages.map((_, index) => (
                      <div
                        key={index}
                        className="w-2 h-2 rounded-full bg-white/50"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6">
              {/* Service Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">{service.title}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${
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
                    <span className="text-white/60">
                      {service.provider.rating} ({service.provider.totalReviews} reviews)
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">{service.price}</p>
                </div>
              </div>

              {/* Provider Info */}
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl mb-6">
                <img
                  src={service.provider.image}
                  alt={service.provider.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{service.provider.name}</h3>
                  <div className="flex items-center gap-2 text-white/60">
                    <FiMapPin className="text-blue-400" />
                    <span>{service.provider.location}</span>
                  </div>
                  <p className="text-sm text-white/40 mt-1">
                    {service.provider.totalServices} services completed
                  </p>
                </div>
                <button className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors">
                  <FiMessageCircle className="text-xl" />
                </button>
              </div>

              {/* Tabs Navigation */}
              <div className="flex gap-4 border-b border-white/10 mb-6">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                      activeTab === tab.id ? 'text-blue-400' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="space-y-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">About This Service</h3>
                      <p className="text-white/60 leading-relaxed">{service.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
                        <FiClock className="text-xl text-blue-400" />
                        <div>
                          <p className="text-sm text-white/40">Duration</p>
                          <p className="text-white font-medium">1 Hour Session</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
                        <FiDollarSign className="text-xl text-blue-400" />
                        <div>
                          <p className="text-sm text-white/40">Category</p>
                          <p className="text-white font-medium">{service.category}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Requirements</h3>
                      <ul className="list-disc list-inside text-white/60 space-y-2">
                        <li>Basic understanding of programming concepts</li>
                        <li>Computer with stable internet connection</li>
                        <li>Development environment setup</li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">Reviews</h3>
                      <div className="flex items-center gap-2">
                        <FiStar className="text-yellow-400" />
                        <span className="text-white font-medium">{service.provider.rating}</span>
                        <span className="text-white/60">({service.provider.totalReviews} reviews)</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {reviews.map(review => (
                        <div key={review.id} className="p-4 bg-white/5 rounded-xl">
                          <div className="flex items-center gap-3 mb-3">
                            <img
                              src={review.user.image}
                              alt={review.user.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <h4 className="font-medium text-white">{review.user.name}</h4>
                              <p className="text-sm text-white/40">{review.date}</p>
                            </div>
                            <div className="ml-auto flex items-center">
                              {[...Array(review.rating)].map((_, i) => (
                                <FiStar key={i} className="text-yellow-400 w-4 h-4" />
                              ))}
                            </div>
                          </div>
                          <p className="text-white/60">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'faq' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white">Frequently Asked Questions</h3>
                    <div className="space-y-4">
                      {faqs.map((faq, index) => (
                        <div key={index} className="p-4 bg-white/5 rounded-xl">
                          <h4 className="font-medium text-white mb-2">{faq.question}</h4>
                          <p className="text-white/60">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'schedule' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Book a Session</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-white/60 mb-2">Select Date</label>
                        <input
                          type="date"
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white/60 mb-2">Preferred Time</label>
                        <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white">
                          <option value="morning">Morning (9AM - 12PM)</option>
                          <option value="afternoon">Afternoon (1PM - 5PM)</option>
                          <option value="evening">Evening (6PM - 9PM)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-white/60 mb-2">Additional Notes</label>
                      <textarea
                        rows={4}
                        placeholder="Any specific topics or questions you'd like to discuss?"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-6 mt-6 border-t border-white/10">
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
                >
                  Close
                </button>
                <button className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  Book Now
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ServiceDetailModal 