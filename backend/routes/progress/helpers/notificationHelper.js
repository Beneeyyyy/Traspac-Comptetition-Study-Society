const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createNotification = async (userId, type, message, data = {}) => {
  try {
    await prisma.notification.create({
      data: {
        userId: parseInt(userId),
        type,
        message,
        data: data,
        isRead: false
      }
    });
    console.log(`Created ${type} notification for user ${userId}`);
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

module.exports = {
  createNotification
}; 