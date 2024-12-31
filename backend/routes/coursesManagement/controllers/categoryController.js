const { PrismaClient } = require('@prisma/client');
const uploadImage = require('../../../utils/uploadImage');

const prisma = new PrismaClient();

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    console.log('Fetching categories from database...')
    const categories = await prisma.category.findMany({
      include: {
        subcategories: {
          include: {
            materials: true
          }
        },
        points: {
          select: {
            value: true
          }
        }
      }
    });
    
    console.log('Categories fetched:', categories.length)
    
    if (!categories || categories.length === 0) {
      return res.json([]);
    }

    const transformedCategories = categories.map(category => {
      const totalMaterials = category.subcategories.reduce((acc, sub) => 
        acc + (sub.materials?.length || 0), 0);

      const totalPoints = category.subcategories.reduce((acc, sub) => {
        const subPoints = sub.materials?.reduce((sum, mat) => 
          sum + (mat?.point_value || 0), 0) || 0;
        return acc + subPoints;
      }, 0);

      const earnedPoints = category.points?.reduce((acc, point) => 
        acc + (point?.value || 0), 0) || 0;

      return {
        id: category.id,
        name: category.name,
        description: category.description,
        image: category.image,
        _count: {
          materials: totalMaterials
        },
        _sum: {
          points: totalPoints,
          earnedPoints: earnedPoints
        },
        subcategories: category.subcategories.map(sub => ({
          id: sub.id,
          name: sub.name,
          description: sub.description,
          image: sub.image,
          materials: sub.materials.map(mat => ({
            id: mat.id,
            title: mat.title,
            content: mat.content,
            point_value: mat.point_value,
            image: mat.image
          }))
        }))
      };
    });

    res.json(transformedCategories);
  } catch (error) {
    console.error('Error in getAllCategories:', error);
    res.status(500).json({ 
      error: 'Gagal mengambil data kategori',
      details: error.message 
    });
  }
};

// Get category by ID
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Attempting to fetch category with ID:', id);

    const categoryId = parseInt(id);
    if (isNaN(categoryId)) {
      console.log('Invalid category ID:', id);
      return res.status(400).json({ 
        error: 'ID kategori tidak valid',
        details: 'ID harus berupa angka'
      });
    }

    console.log('Looking up category in database...');
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        subcategories: {
          include: {
            materials: true
          }
        }
      }
    });

    if (!category) {
      console.log('Category not found');
      return res.status(404).json({ 
        error: 'Kategori tidak ditemukan',
        details: `Category with ID ${id} does not exist`
      });
    }

    const transformedCategory = {
      id: category.id,
      name: category.name,
      description: category.description,
      image: category.image,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      _count: {
        materials: category.subcategories.reduce((acc, sub) => 
          acc + (sub.materials?.length || 0), 0)
      },
      subcategories: category.subcategories.map(sub => ({
        id: sub.id,
        name: sub.name,
        description: sub.description,
        image: sub.image,
        categoryId: sub.categoryId,
        createdAt: sub.createdAt,
        updatedAt: sub.updatedAt,
        materialCount: sub.materials?.length || 0,
        materials: sub.materials.map(mat => ({
          id: mat.id,
          title: mat.title,
          content: mat.content,
          point_value: mat.point_value,
          image: mat.image
        }))
      }))
    };

    console.log('Successfully transformed category data');
    res.json(transformedCategory);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Gagal mengambil data kategori' });
  }
};

// Create category
const createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    console.log('Creating category with image:', image ? 'Image present' : 'No image');
    
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

    console.log('Creating category in database with image URL:', imageUrl);
    const category = await prisma.category.create({
      data: {
        name,
        description,
        image: imageUrl
      },
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
        createdAt: true,
        updatedAt: true
      }
    });

    console.log('Category created successfully:', {
      id: category.id,
      name: category.name,
      hasImage: !!category.image,
      imageUrl: category.image
    });

    res.json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ 
      error: 'Gagal membuat kategori',
      details: error.message
    });
  }
};

// Update category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image } = req.body;
    console.log('Updating category:', id, 'with image:', image ? 'Image present' : 'No image');

    let imageUrl = undefined;
    if (image) {
      try {
        imageUrl = await uploadImage(image);
        console.log('Image uploaded successfully:', imageUrl);
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError);
        return res.status(400).json({ error: uploadError.message });
      }
    }

    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        ...(imageUrl && { image: imageUrl })
      },
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
        createdAt: true,
        updatedAt: true
      }
    });

    console.log('Category updated:', {
      id: category.id,
      name: category.name,
      hasImage: !!category.image
    });

    res.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Kategori tidak ditemukan' });
    } else {
      res.status(500).json({ error: 'Gagal mengupdate kategori' });
    }
  }
};

// Delete category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.category.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Kategori berhasil dihapus' });
  } catch (error) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Kategori tidak ditemukan' });
    } else {
      res.status(500).json({ error: 'Gagal menghapus kategori' });
    }
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
}; 