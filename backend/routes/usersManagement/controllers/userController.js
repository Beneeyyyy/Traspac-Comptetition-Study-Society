const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        image: true,
        schoolId: true,
        bio: true,
        interests: true,
        currentGoal: true,
        totalPoints: true,
        level: true,
        rank: true,
        createdAt: true,
        updatedAt: true
      }
    });

    const transformedUsers = users.map(user => ({
      ...user,
      image: user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0D8ABC&color=fff`
    }));

    res.json(transformedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        image: true,
        schoolId: true,
        bio: true,
        interests: true,
        currentGoal: true,
        totalPoints: true,
        level: true,
        rank: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const transformedUser = {
      ...user,
      image: user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0D8ABC&color=fff`
    };

    res.json(transformedUser);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    // Remove sensitive fields
    delete updateData.password;
    delete updateData.email;
    
    if (updateData.schoolId) {
      updateData.schoolId = parseInt(updateData.schoolId);
    }

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        image: true,
        schoolId: true,
        bio: true,
        interests: true,
        currentGoal: true,
        totalPoints: true,
        level: true,
        rank: true,
        createdAt: true,
        updatedAt: true
      }
    });

    const transformedUser = {
      ...user,
      image: user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0D8ABC&color=fff`
    };

    res.json(transformedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.status(500).json({ error: 'Failed to update user' });
    }
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.status(500).json({ error: 'Failed to delete user' });
    }
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
}; 