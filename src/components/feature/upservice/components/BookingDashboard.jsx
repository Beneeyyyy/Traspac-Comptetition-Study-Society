import { useState, useEffect } from 'react';
import { FiClock, FiCheck, FiX, FiLoader, FiDollarSign } from 'react-icons/fi';
import axios from 'axios';

const BookingDashboard = ({ userRole }) => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');

  // Fetch bookings based on role and status
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Different endpoint based on role
        const endpoint = userRole === 'provider' 
          ? '/api/bookings/provider'
          : '/api/bookings/user';
        
        const response = await axios.get(endpoint);
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError('Failed to load bookings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [userRole]);

  // Handle booking status update
  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await axios.put(`/api/bookings/${bookingId}/status`, {
        status: newStatus
      });

      // Update local state
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: newStatus }
          : booking
      ));
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Failed to update booking status');
    }
  };

  // Filter bookings based on active tab
  const filteredBookings = bookings.filter(booking => {
    switch (activeTab) {
      case 'pending':
        return ['pending', 'waiting_verification'].includes(booking.status);
      case 'active':
        return ['accepted', 'ongoing'].includes(booking.status);
      case 'completed':
        return booking.status === 'completed';
      case 'cancelled':
        return booking.status === 'cancelled';
      default:
        return true;
    }
  });

  // Render status badge
  const StatusBadge = ({ status }) => {
    const styles = {
      pending: 'bg-yellow-500/10 text-yellow-500',
      waiting_verification: 'bg-blue-500/10 text-blue-500',
      accepted: 'bg-green-500/10 text-green-500',
      ongoing: 'bg-purple-500/10 text-purple-500',
      completed: 'bg-green-500/10 text-green-500',
      cancelled: 'bg-red-500/10 text-red-500'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm ${styles[status] || styles.pending}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  // Render action buttons based on role and status
  const renderActions = (booking) => {
    if (userRole === 'provider') {
      switch (booking.status) {
        case 'pending':
          return (
            <div className="flex gap-2">
              <button
                onClick={() => handleStatusUpdate(booking.id, 'accepted')}
                className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Accept
              </button>
              <button
                onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Reject
              </button>
            </div>
          );
        case 'accepted':
          return (
            <button
              onClick={() => handleStatusUpdate(booking.id, 'ongoing')}
              className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Start Service
            </button>
          );
        default:
          return null;
      }
    } else {
      // Customer actions
      if (booking.status === 'ongoing') {
        return (
          <button
            onClick={() => handleStatusUpdate(booking.id, 'completed')}
            className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Complete
          </button>
        );
      }
      return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FiLoader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-gray-800">
        {['pending', 'active', 'completed', 'cancelled'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              activeTab === tab
                ? 'text-blue-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
            )}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map(booking => (
          <div
            key={booking.id}
            className="bg-gray-900 rounded-xl p-6 border border-gray-800"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {booking.service.title}
                </h3>
                <StatusBadge status={booking.status} />
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400 mb-1">Amount</div>
                <div className="text-lg font-bold text-white">
                  Rp {booking.payment.amount.toLocaleString('id-ID')}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <div className="text-gray-400 mb-1">Schedule</div>
                <div className="text-white">
                  {new Date(booking.schedule).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Duration</div>
                <div className="text-white">{booking.duration} minutes</div>
              </div>
            </div>

            {booking.notes && (
              <div className="mb-4">
                <div className="text-sm text-gray-400 mb-1">Notes</div>
                <div className="text-white">{booking.notes}</div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={userRole === 'provider' 
                    ? booking.user.image 
                    : booking.service.provider.image}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="text-white font-medium">
                    {userRole === 'provider' 
                      ? booking.user.name 
                      : booking.service.provider.name}
                  </div>
                  <div className="text-sm text-gray-400">
                    {userRole === 'provider' ? 'Customer' : 'Provider'}
                  </div>
                </div>
              </div>
              {renderActions(booking)}
            </div>
          </div>
        ))}

        {filteredBookings.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No {activeTab} bookings found
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDashboard; 