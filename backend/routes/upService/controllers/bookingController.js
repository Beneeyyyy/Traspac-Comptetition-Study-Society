const prisma = require('../../../../config/prisma');
const { uploadImage } = require('../../../../utils/uploadImage');

// Get user's bookings
const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await prisma.serviceBooking.findMany({
      where: {
        userId
      },
      include: {
        service: {
          include: {
            provider: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        },
        payment: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
};

// Get provider's bookings
const getProviderBookings = async (req, res) => {
  try {
    const providerId = req.user.id;
    const bookings = await prisma.serviceBooking.findMany({
      where: {
        service: {
          providerId
        }
      },
      include: {
        service: true,
        payment: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching provider bookings:', error);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
};

// Create booking
const createBooking = async (req, res) => {
  try {
    console.log('Creating booking with data:', req.body);
    console.log('User:', req.user);

    const { serviceId, schedule, duration, notes } = req.body;
    const userId = req.user.id;

    // Get service details for price calculation
    const service = await prisma.service.findUnique({
      where: { id: parseInt(serviceId) }
    });

    console.log('Found service:', service);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Calculate total amount
    const amount = service.price * (duration / 60); // price per hour * duration in hours

    // Create booking with payment record
    const booking = await prisma.serviceBooking.create({
      data: {
        serviceId: parseInt(serviceId),
        userId,
        schedule: new Date(schedule),
        duration: parseInt(duration),
        notes,
        status: 'pending',
        payment: {
          create: {
            amount,
            status: 'pending'
          }
        }
      },
      include: {
        service: true,
        payment: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Failed to create booking' });
  }
};

// Upload payment proof
const uploadPaymentProof = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { paymentMethod } = req.body;
    const paymentProof = req.file;

    if (!paymentProof) {
      return res.status(400).json({ message: 'Payment proof is required' });
    }

    // Upload payment proof to cloud storage
    const uploadedImage = await uploadImage(paymentProof.buffer);

    // Update payment record
    const payment = await prisma.payment.update({
      where: {
        bookingId: parseInt(bookingId)
      },
      data: {
        proofImage: uploadedImage,
        method: paymentMethod,
        status: 'waiting_verification'
      }
    });

    // Update booking status
    await prisma.serviceBooking.update({
      where: {
        id: parseInt(bookingId)
      },
      data: {
        status: 'waiting_verification'
      }
    });

    res.json(payment);
  } catch (error) {
    console.error('Error uploading payment proof:', error);
    res.status(500).json({ message: 'Failed to upload payment proof' });
  }
};

// Verify payment (admin only)
const verifyPayment = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Update payment status
    const payment = await prisma.payment.update({
      where: {
        bookingId: parseInt(bookingId)
      },
      data: {
        status: status === 'accepted' ? 'completed' : 'failed'
      }
    });

    // Update booking status
    await prisma.serviceBooking.update({
      where: {
        id: parseInt(bookingId)
      },
      data: {
        status: status === 'accepted' ? 'accepted' : 'cancelled'
      }
    });

    res.json(payment);
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Failed to verify payment' });
  }
};

// Update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    // Validate status transition
    const booking = await prisma.serviceBooking.findUnique({
      where: { id: parseInt(bookingId) },
      include: {
        service: true
      }
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user has permission
    const isProvider = booking.service.providerId === userId;
    const isCustomer = booking.userId === userId;

    if (!isProvider && !isCustomer) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Validate status transitions
    const validTransitions = {
      provider: {
        pending: ['accepted', 'cancelled'],
        accepted: ['ongoing'],
        ongoing: []
      },
      customer: {
        ongoing: ['completed']
      }
    };

    const allowedTransitions = isProvider 
      ? validTransitions.provider[booking.status] || []
      : validTransitions.customer[booking.status] || [];

    if (!allowedTransitions.includes(status)) {
      return res.status(400).json({ 
        message: `Cannot transition from ${booking.status} to ${status}`
      });
    }

    // Update booking status
    const updatedBooking = await prisma.serviceBooking.update({
      where: {
        id: parseInt(bookingId)
      },
      data: {
        status
      },
      include: {
        service: true,
        payment: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });

    res.json(updatedBooking);
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Failed to update booking status' });
  }
};

// Get booking details
const getBookingDetails = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    const booking = await prisma.serviceBooking.findUnique({
      where: {
        id: parseInt(bookingId)
      },
      include: {
        service: {
          include: {
            provider: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        },
        payment: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user has permission to view
    const isProvider = booking.service.provider.id === userId;
    const isCustomer = booking.userId === userId;

    if (!isProvider && !isCustomer) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking details:', error);
    res.status(500).json({ message: 'Failed to fetch booking details' });
  }
};

module.exports = {
  getUserBookings,
  getProviderBookings,
  createBooking,
  uploadPaymentProof,
  verifyPayment,
  updateBookingStatus,
  getBookingDetails
}; 