import { FiArrowLeft } from 'react-icons/fi'
import Navbar from '../../../../layouts/Navbar'
import Footer from '../../../../layouts/Footer'

const ErrorState = ({ error, onBack }) => (
  <div className="min-h-screen bg-[#0A0A0B] text-white flex flex-col">
    <Navbar />
    <main className="relative flex-1">
      {/* Top Gradient */}
      <div className="absolute top-0 inset-x-0 h-[500px] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent" />
      </div>

      {/* Content Wrapper */}
      <div className="relative w-full">
        <section className="py-12 pt-20">
          <div className="container max-w-screen-2xl mx-auto px-6 lg:px-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-400 mb-4">Error Loading Data</h2>
              <p className="text-white/60 mb-6">{error}</p>
              <button 
                onClick={onBack}
                className="flex items-center gap-2 text-white/60 hover:text-white mx-auto group"
              >
                <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                <span>Go Back</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
    <Footer />
  </div>
)

export default ErrorState 