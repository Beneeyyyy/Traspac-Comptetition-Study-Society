const { PrismaClient } = require('@prisma/client');
const uploadImage = require('../../../utils/uploadImage');

const prisma = new PrismaClient();

// Get all subcategories
const getAllSubcategories = async (req, res) => {
  try {
    console.log('Fetching all subcategories...');
    const subcategories = await prisma.subcategory.findMany({
      include: {
        category: true,
        materials: true,
        points: true
      }
    });
    
    console.log(`Found ${subcategories.length} subcategories`);
    res.json(subcategories);
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    res.status(500).json({ 
      error: 'Gagal mengambil data subkategori',
      details: error.message
    });
  }
};

// Get subcategory by ID
const getSubcategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Fetching subcategory with ID:', id);
    
    const subcategory = await prisma.subcategory.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true,
        materials: true,
        points: true
      }
    });
    
    if (!subcategory) {
      console.log('Subcategory not found');
      return res.status(404).json({ error: 'Subkategori tidak ditemukan' });
    }

    console.log('Subcategory found:', subcategory.name);
    res.json(subcategory);
  } catch (error) {
    console.error('Error fetching subcategory:', error);
    res.status(500).json({ 
      error: 'Gagal mengambil data subkategori',
      details: error.message
    });
  }
};

// Get subcategories by category ID
const getSubcategoriesByCategoryId = async (req, res) => {
  try {
    const { categoryId } = req.params;
    console.log('Fetching subcategories for category ID:', categoryId);

    // First verify if category exists
    const category = await prisma.category.findUnique({
      where: { id: parseInt(categoryId) }
    });

    if (!category) {
      console.log('Parent category not found');
      return res.status(404).json({ 
        error: 'Kategori tidak ditemukan',
        details: `Category with ID ${categoryId} does not exist`
      });
    }

    const subcategories = await prisma.subcategory.findMany({
      where: { categoryId: parseInt(categoryId) },
      include: {
        materials: {
          select: {
            id: true,
            title: true,
            xp_reward: true
          }
        },
        points: true,
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    const transformedSubcategories = subcategories.map(sub => ({
      id: sub.id,
      name: sub.name,
      description: sub.description,
      image: sub.image,
      categoryId: sub.categoryId,
      createdAt: sub.createdAt,
      updatedAt: sub.updatedAt,
      materialCount: sub.materials?.length || 0,
      category: sub.category,
      materials: sub.materials
    }));

    console.log(`Successfully fetched ${transformedSubcategories.length} subcategories`);
    res.json(transformedSubcategories);
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ 
      error: 'Gagal mengambil data subkategori',
      details: error.message
    });
  }
};

// Create subcategory
const createSubcategory = async (req, res) => {
  try {
    const { name, description, categoryId, image } = req.body;
    console.log('Creating subcategory:', { name, categoryId, hasImage: !!image });
    
    if (!name || !categoryId) {
      return res.status(400).json({ error: 'Nama dan kategori harus diisi' });
    }

    let imageUrl = null;
    if (image) {
      try {
        console.log('Starting image upload process...');
        imageUrl = await uploadImage(image);
        console.log('Image uploaded successfully:', imageUrl);
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError);
        return res.status(400).json({ 
          error: uploadError.message,
          details: 'Image upload failed'
        });
      }
    }

    console.log('Creating subcategory in database...');
    const subcategory = await prisma.subcategory.create({
      data: {
        name,
        description,
        image: imageUrl,
        categoryId: parseInt(categoryId)
      },
      include: {
        category: true
      }
    });

    console.log('Subcategory created successfully:', {
      id: subcategory.id,
      name: subcategory.name,
      hasImage: !!subcategory.image
    });

    res.status(201).json(subcategory);
  } catch (error) {
    console.error('Error creating subcategory:', error);
    if (error.code === 'P2003') {
      res.status(400).json({ error: 'Kategori tidak ditemukan' });
    } else {
      res.status(500).json({ 
        error: 'Gagal membuat subkategori',
        details: error.message
      });
    }
  }
};

// Update subcategory
const updateSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, categoryId, image } = req.body;
    console.log('Updating subcategory:', id, 'with image:', !!image);
    
    let imageUrl = undefined;
    if (image) {
      try {
        console.log('Starting image upload process...');
        imageUrl = await uploadImage(image);
        console.log('Image uploaded successfully:', imageUrl);
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError);
        return res.status(400).json({ 
          error: uploadError.message,
          details: 'Image upload failed'
        });
      }
    }

    const subcategory = await prisma.subcategory.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        ...(imageUrl && { image: imageUrl }),
        categoryId: categoryId ? parseInt(categoryId) : undefined
      },
      include: {
        category: true
      }
    });

    console.log('Subcategory updated successfully:', {
      id: subcategory.id,
      name: subcategory.name,
      hasImage: !!subcategory.image
    });

    res.json(subcategory);
  } catch (error) {
    console.error('Error updating subcategory:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Subkategori tidak ditemukan' });
    } else if (error.code === 'P2003') {
      res.status(400).json({ error: 'Kategori tidak ditemukan' });
    } else {
      res.status(500).json({ 
        error: 'Gagal mengupdate subkategori',
        details: error.message
      });
    }
  }
};

// Delete subcategory
const deleteSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.subcategory.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Subkategori berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Subkategori tidak ditemukan' });
    } else {
      res.status(500).json({ 
        error: 'Gagal menghapus subkategori',
        details: error.message
      });
    }
  }
};

module.exports = {
  getAllSubcategories,
  getSubcategoryById,
  getSubcategoriesByCategoryId,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory
}; 