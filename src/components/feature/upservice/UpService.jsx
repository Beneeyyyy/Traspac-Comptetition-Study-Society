import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { FiUsers, FiBook, FiMonitor, FiCode, FiMessageSquare } from 'react-icons/fi'
import Navbar from '../../layouts/Navbar'
import Footer from '../../layouts/Footer'
import ServiceCard from './components/ServiceCard'
import CreateServiceModal from './components/CreateServiceModal'
import ServiceHeader from './components/ServiceHeader'
import ServiceDetailModal from './components/ServiceDetailModal'
import HeroSection from './components/HeroSection'

const UpService = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Form state for creating new service
  const [newService, setNewService] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Mentoring',
    showcaseImages: []
  })

  const services = [
    {
      id: 'mentoring',
      icon: FiUsers,
      title: '1-on-1 Mentoring',
      description: 'Get personalized guidance from experienced mentors',
      price: '$50',
      category: 'Mentoring',
      showcaseImages: [
        'https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&h=300&fit=crop'
      ],
      provider: {
        name: 'John Smith',
        image: 'https://i.pravatar.cc/150?img=1',
        rating: 4.8,
        totalReviews: 124,
        totalServices: 15,
        location: 'New York, USA'
      }
    },
    {
      id: 'tutoring',
      icon: FiBook,
      title: 'Private Tutoring',
      description: 'Learn at your own pace with dedicated tutors',
      price: '$40',
      category: 'Tutoring',
      showcaseImages: [
        'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&h=300&fit=crop'
      ],
      provider: {
        name: 'Sarah Johnson',
        image: 'https://i.pravatar.cc/150?img=2',
        rating: 4.9,
        totalReviews: 89,
        totalServices: 8,
        location: 'London, UK'
      }
    },
    {
      id: 'workshop',
      icon: FiMonitor,
      title: 'Live Workshops',
      description: 'Join interactive group learning sessions',
      price: '$30',
      category: 'Workshop',
      showcaseImages: [
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1552581234-26160f608093?w=500&h=300&fit=crop'
      ],
      provider: {
        name: 'Mike Chen',
        image: 'https://i.pravatar.cc/150?img=3',
        rating: 4.7,
        totalReviews: 156,
        totalServices: 12,
        location: 'Singapore'
      }
    },
    {
      id: 'review',
      icon: FiCode,
      title: 'Code Review',
      description: 'Get expert feedback on your code',
      price: '$45',
      category: 'Review',
      showcaseImages: [
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&h=300&fit=crop'
      ],
      provider: {
        name: 'Alex Kumar',
        image: 'https://i.pravatar.cc/150?img=4',
        rating: 5.0,
        totalReviews: 67,
        totalServices: 5,
        location: 'Berlin, Germany'
      }
    },
    {
      id: 'consultation',
      icon: FiMessageSquare,
      title: 'Tech Consultation',
      description: 'Professional advice for your tech projects',
      price: '$60',
      category: 'Consultation',
      showcaseImages: [
        'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=500&h=300&fit=crop'
      ],
      provider: {
        name: 'Emma Wilson',
        image: 'https://i.pravatar.cc/150?img=5',
        rating: 4.9,
        totalReviews: 203,
        totalServices: 18,
        location: 'Toronto, Canada'
      }
    }
  ]

  const categories = ['All', 'Mentoring', 'Tutoring', 'Workshop', 'Review', 'Consultation']

  const filteredServices = services.filter(service => {
    if (selectedCategory !== 'All' && service.category !== selectedCategory) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return service.title.toLowerCase().includes(query) ||
             service.description.toLowerCase().includes(query)
    }
    return true
  })

  const handleCreateService = (e) => {
    e.preventDefault()
    console.log('Creating new service:', newService)
    setIsCreateModalOpen(false)
    setNewService({
      title: '',
      description: '',
      price: '',
      category: 'Mentoring',
      showcaseImages: []
    })
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredServices.map((service) => (
                <ServiceCard 
                  key={service.id} 
                  service={service} 
                  onCardClick={setSelectedService}
                />
              ))}
            </div>
          </AnimatePresence>
        </div>

        <CreateServiceModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateService}
          newService={newService}
          setNewService={setNewService}
          categories={categories}
        />

        <ServiceDetailModal
          isOpen={!!selectedService}
          onClose={() => setSelectedService(null)}
          service={selectedService}
        />
      </main>
      <Footer />
    </div>
  )
}

export default UpService 