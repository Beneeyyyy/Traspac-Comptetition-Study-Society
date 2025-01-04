const { PrismaClient } = require('@prisma/client');
const uploadImage = require('../../../utils/uploadImage');

const prisma = new PrismaClient();

// Get all services with optional filters
const getServices = async (req, res) => {
  try {
    const { category, search } = req.query;
    
    const where = {};
    if (category && category !== 'All') {
      where.category = category;
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const services = await prisma.service.findMany({
      where,
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            image: true,
            school: {
              select: {
                name: true,
                province: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(services);
  } catch (error) {
    console.error('Error getting services:', error);
    res.status(500).json({ message: 'Failed to get services', error: error.message });
  }
};

// Get service by ID
const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const service = await prisma.service.findUnique({
      where: { id: parseInt(id) },
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            image: true,
            school: {
              select: {
                name: true,
                province: true
              }
            }
          }
        },
        reviews: {
          include: {
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
        }
      }
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    console.error('Error getting service:', error);
    res.status(500).json({ message: 'Failed to get service', error: error.message });
  }
};

// Create new service
const createService = async (req, res) => {
  try {
    const { title, description, price, category, images } = req.body;
    const providerId = req.user.id;

    // Upload images if provided
    let uploadedImages = [];
    if (images && images.length > 0) {
      uploadedImages = await Promise.all(
        images.map(image => uploadImage(image))
      );
    }

    const service = await prisma.service.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        category,
        images: uploadedImages,
        providerId,
        rating: 0,
        totalReviews: 0,
        totalBookings: 0
      },
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            image: true,
            school: {
              select: {
                name: true,
                province: true
              }
            }
          }
        }
      }
    });

    res.status(201).json(service);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ message: 'Failed to create service', error: error.message });
  }
};

// Update service
const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, category, images } = req.body;
    const userId = req.user.id;

    // Check if user owns the service
    const existingService = await prisma.service.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingService) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (existingService.providerId !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this service' });
    }

    // Upload new images if provided
    let uploadedImages = existingService.images;
    if (images && images.length > 0) {
      const newImages = await Promise.all(
        images.map(image => uploadImage(image))
      );
      uploadedImages = [...uploadedImages, ...newImages];
    }

    const service = await prisma.service.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        price: parseFloat(price),
        category,
        images: uploadedImages
      },
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            image: true,
            school: {
              select: {
                name: true,
                province: true
              }
            }
          }
        }
      }
    });

    res.json(service);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ message: 'Failed to update service', error: error.message });
  }
};

// Delete service
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if user owns the service
    const service = await prisma.service.findUnique({
      where: { id: parseInt(id) }
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (service.providerId !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this service' });
    }

    // Delete related bookings and reviews first
    await prisma.serviceBooking.deleteMany({
      where: { serviceId: parseInt(id) }
    });

    await prisma.serviceReview.deleteMany({
      where: { serviceId: parseInt(id) }
    });

    // Delete the service
    await prisma.service.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ message: 'Failed to delete service', error: error.message });
  }
};

// Book a service
const bookService = async (req, res) => {
  try {
    const { id } = req.params;
    const { schedule, duration, notes } = req.body;
    const userId = req.user.id;

    // Check if service exists
    const service = await prisma.service.findUnique({
      where: { id: parseInt(id) }
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Create booking
    const booking = await prisma.serviceBooking.create({
      data: {
        serviceId: parseInt(id),
        userId,
        schedule: new Date(schedule),
        duration: parseInt(duration),
        notes,
        status: 'PENDING'
      }
    });

    // Update service booking count
    await prisma.service.update({
      where: { id: parseInt(id) },
      data: {
        totalBookings: {
          increment: 1
        }
      }
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error('Error booking service:', error);
    res.status(500).json({ message: 'Failed to book service', error: error.message });
  }
};

// Add review
const addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    // Check if service exists
    const service = await prisma.service.findUnique({
      where: { id: parseInt(id) }
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check if user has booked and completed this service
    const booking = await prisma.serviceBooking.findFirst({
      where: {
        serviceId: parseInt(id),
        userId,
        status: 'COMPLETED'
      }
    });

    if (!booking) {
      return res.status(403).json({ message: 'You must complete the service before reviewing' });
    }

    // Create review
    const review = await prisma.serviceReview.create({
      data: {
        serviceId: parseInt(id),
        userId,
        rating: parseFloat(rating),
        comment
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });

    // Update service rating and review count
    const reviews = await prisma.serviceReview.findMany({
      where: { serviceId: parseInt(id) }
    });

    const averageRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;

    await prisma.service.update({
      where: { id: parseInt(id) },
      data: {
        rating: averageRating,
        totalReviews: reviews.length
      }
    });

    res.status(201).json(review);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Failed to add review', error: error.message });
  }
};

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  bookService,
  addReview
}; 