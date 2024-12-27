import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiUsers, FiBook, FiMonitor, FiCode, FiMessageSquare, FiCalendar } from 'react-icons/fi'
import Navbar from '../../layouts/Navbar'
import Footer from '../../layouts/Footer'

const UpService = () => {
  const [selectedService, setSelectedService] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const services = [
    {
      id: 'mentoring',
      icon: FiUsers,
      title: '1-on-1 Mentoring',
      description: 'Get personalized guidance from experienced mentors',
      price: '$50/hour'
    },
    {
      id: 'tutoring',
      icon: FiBook,
      title: 'Private Tutoring',
      description: 'Learn at your own pace with dedicated tutors',
      price: '$40/hour'
    },
    {
      id: 'workshop',
      icon: FiMonitor,
      title: 'Live Workshops',
      description: 'Join interactive group learning sessions',
      price: '$30/person'
    },
    {
      id: 'review',
      icon: FiCode,
      title: 'Code Review',
      description: 'Get expert feedback on your code',
      price: '$45/review'
    },
    {
      id: 'consultation',
      icon: FiMessageSquare,
      title: 'Tech Consultation',
      description: 'Professional advice for your tech projects',
      price: '$60/hour'
    }
  ]

  const getServiceButtonClass = (serviceId) => {
    const baseClass = "relative p-6 rounded-xl border transition-colors text-left group"
    const activeClass = "bg-blue-500/10 border-blue-500/50"
    const inactiveClass = "bg-white/[0.02] border-white/10 hover:bg-white/[0.05]"
    return `${baseClass} ${selectedService?.id === serviceId ? activeClass : inactiveClass}`
  }

  const getIconContainerClass = (serviceId) => {
    const baseClass = "w-12 h-12 rounded-lg flex items-center justify-center"
    const activeClass = "bg-blue-500/20"
    const inactiveClass = "bg-white/5"
    return `${baseClass} ${selectedService?.id === serviceId ? activeClass : inactiveClass}`
  }

  const getIconClass = (serviceId) => {
    const baseClass = "text-2xl"
    const activeClass = "text-blue-400"
    const inactiveClass = "text-white/60"
    return `${baseClass} ${selectedService?.id === serviceId ? activeClass : inactiveClass}`
  }

  const getTitleClass = (serviceId) => {
    const baseClass = "font-medium"
    const activeClass = "text-blue-400"
    const inactiveClass = "text-white"
    return `${baseClass} ${selectedService?.id === serviceId ? activeClass : inactiveClass}`
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white flex flex-col">
      <Navbar />
      
      <main className="relative flex-1">
        <div className="absolute top-0 inset-x-0 h-[500px] pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent" />
        </div>

        <div className="relative w-full">
          <section className="py-12 pt-20">
            <div className="container max-w-screen-xl mx-auto px-6">
              <div className="mb-12">
                <h1 className="text-4xl font-bold text-white mb-4">Up Services</h1>
                <p className="text-lg text-white/60 max-w-2xl">Get expert help and guidance from our community of professionals.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {services.map((service) => (
                  <motion.button
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className={getServiceButtonClass(service.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className={getIconContainerClass(service.id)}>
                        <service.icon className={getIconClass(service.id)} />
                      </div>
                      <div>
                        <h3 className={getTitleClass(service.id)}>{service.title}</h3>
                        <p className="text-sm text-white/40">{service.price}</p>
                      </div>
                    </div>
                    <p className="text-sm text-white/40">{service.description}</p>
                  </motion.button>
                ))}
              </div>

              {selectedService && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/[0.02] border border-white/10 rounded-xl p-8"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <selectedService.icon className="text-3xl text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-white">{selectedService.title}</h2>
                      <p className="text-white/60">{selectedService.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">Name</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your name"
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">Email</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Your email"
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-2">Message</label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Describe what you need help with"
                        rows={4}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-2">Preferred Schedule</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['Morning', 'Afternoon', 'Evening', 'Flexible'].map((time) => (
                          <button
                            key={time}
                            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                          >
                            <FiCalendar />
                            <span>{time}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-white/5">
                      <button className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                        Request Service
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default UpService 