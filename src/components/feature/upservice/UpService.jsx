import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import Footer from '../../layouts/Footer'
import ServiceCard from './components/ServiceCard'
import CreateServiceModal from './components/CreateServiceModal'
import ServiceHeader from './components/ServiceHeader'
import ServiceDetailModal from './components/ServiceDetailModal'
import HeroSection from './components/HeroSection'
import LoadingSpinner from '../../common/LoadingSpinner'

const UpService = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedService, setSelectedService] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', 'Mentoring', 'Tutoring', 'Workshop', 'Review', 'Consultation']

  useEffect(() => {
    fetchServices()
  }, [searchQuery, selectedCategory])

  const fetchServices = async () => {
    try {
      const params = new URLSearchParams()
      if (selectedCategory !== 'All') params.append('category', selectedCategory)
      if (searchQuery) params.append('search', searchQuery)

      const response = await fetch(`http://localhost:3000/api/services?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch services')
      const data = await response.json()
      setServices(data)
    } catch (error) {
      console.error('Error fetching services:', error)
      alert('Failed to fetch services')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateService = async (serviceData) => {
    try {
      const response = await fetch('http://localhost:3000/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(serviceData),
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to create service');
      const newService = await response.json();
      setServices(prev => [newService, ...prev]);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating service:', error);
      alert('Failed to create service');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <main className="flex-1 relative">
        {/* Static Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[35vw] h-[35vw] bg-gradient-to-r from-blue-500/[0.03] to-purple-500/[0.03] rounded-full blur-[60px]"></div>
          <div className="absolute bottom-1/3 right-1/4 w-[25vw] h-[25vw] bg-gradient-to-r from-purple-500/[0.03] to-pink-500/[0.03] rounded-full blur-[50px]"></div>
          <div className="absolute top-1/2 left-1/3 w-[30vw] h-[30vw] bg-gradient-to-r from-pink-500/[0.03] to-blue-500/[0.03] rounded-full blur-[55px]"></div>
        </div>

        <HeroSection />

        <div className="container max-w-7xl mx-auto px-4 relative pb-12">
          <ServiceHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
            onCreateClick={() => setIsCreateModalOpen(true)}
          />

          <AnimatePresence mode="wait">
            {loading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {services.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onCardClick={setSelectedService}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        <CreateServiceModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateService}
        />

        {selectedService && (
          <ServiceDetailModal
            isOpen={!!selectedService}
            onClose={() => setSelectedService(null)}
            service={selectedService}
          />
        )}
      </main>
      <Footer />
    </div>
  )
}

export default UpService 