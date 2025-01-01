const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const notificationController = {
  // Get user notifications
  getUserNotifications: async (req, res) => {
    try {
      const { userId } = req.params;
      const { limit = 10, offset = 0, unreadOnly = false } = req.query;

      const notifications = await prisma.notification.findMany({
        where: {
          userId: parseInt(userId),
          ...(unreadOnly ? { isRead: false } : {})
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: parseInt(limit),
        skip: parseInt(offset)
      });

      // Get total count
      const totalCount = await prisma.notification.count({
        where: {
          userId: parseInt(userId),
          ...(unreadOnly ? { isRead: false } : {})
        }
      });

      res.json({
        success: true,
        data: {
          notifications,
          totalCount,
          hasMore: totalCount > (parseInt(offset) + notifications.length)
        }
      });
    } catch (error) {
      console.error('Error in getUserNotifications:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get notifications',
        message: error.message
      });
    }
  },

  // Mark notifications as read
  markAsRead: async (req, res) => {
    try {
      const { userId } = req.params;
      const { notificationIds } = req.body;

      await prisma.notification.updateMany({
        where: {
          userId: parseInt(userId),
          id: { in: notificationIds.map(id => parseInt(id)) }
        },
        data: {
          isRead: true
        }
      });

      res.json({
        success: true,
        message: 'Notifications marked as read'
      });
    } catch (error) {
      console.error('Error in markAsRead:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to mark notifications as read',
        message: error.message
      });
    }
  },

  // Get unread count
  getUnreadCount: async (req, res) => {
    try {
      const { userId } = req.params;

      const count = await prisma.notification.count({
        where: {
          userId: parseInt(userId),
          isRead: false
        }
      });

      res.json({
        success: true,
        data: { count }
      });
    } catch (error) {
      console.error('Error in getUnreadCount:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get unread count',
        message: error.message
      });
    }
  }
};

module.exports = notificationController; 