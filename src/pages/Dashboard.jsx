import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import BookingDashboard from '../components/feature/upservice/components/BookingDashboard';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings'); // bookings, services, profile

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <div className="flex items-center gap-4">
            <img
              src={user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || '')}`}
              alt={user?.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <div className="text-white font-medium">{user?.name}</div>
              <div className="text-sm text-gray-400">{user?.email}</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-800">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              activeTab === 'bookings'
                ? 'text-blue-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Bookings
            {activeTab === 'bookings' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              activeTab === 'services'
                ? 'text-blue-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            My Services
            {activeTab === 'services' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              activeTab === 'profile'
                ? 'text-blue-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Profile
            {activeTab === 'profile' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'bookings' && (
          <BookingDashboard userRole={user?.role} />
        )}
        {activeTab === 'services' && (
          <div className="text-center py-8 text-gray-400">
            Services management coming soon...
          </div>
        )}
        {activeTab === 'profile' && (
          <div className="text-center py-8 text-gray-400">
            Profile management coming soon...
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 