const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const uploadImage = require('../../utils/uploadImage');

const prisma = new PrismaClient();

// Get all categories with stats
router.get('/', async (req, res) => {
  try {
    console.log('Fetching categories from database...')
    const categories = await prisma.category.findMany({
      include: {
        Subcategory: {
          include: {
            Material: {
              select: {
                id: true,
                title: true,
                pointValue: true
              }
            }
          }
        },
        Point: {
          select: {
            value: true
          }
        }
      }
    });
    
    console.log('Categories fetched:', categories.length)
    
    if (categories.length === 0) {
      return res.json([{
        id: 1,
        name: "Sample Category",
        description: "This is a sample category",
        _count: { materials: 0 },
        _sum: { materials: { pointValue: 0 } }
      }]);
    }

    // Transform data untuk include total materials dan points
    const transformedCategories = categories.map(category => {
      // Hitung total materials dari semua subcategory
      const totalMaterials = category.Subcategory.reduce((acc, sub) => 
        acc + (sub.Material?.length || 0), 0);

      // Hitung total points dari materials
      const totalPoints = category.Subcategory.reduce((acc, sub) => {
        const subPoints = sub.Material?.reduce((sum, mat) => 
          sum + (mat?.pointValue || 0), 0) || 0;
        return acc + subPoints;
      }, 0);

      // Hitung points yang sudah didapat
      const earnedPoints = category.Point.reduce((acc, point) => 
        acc + (point.value || 0), 0);

      return {
        id: category.id,
        name: category.name,
        description: category.description,
        image: category.image,
        _count: {
          materials: totalMaterials
        },
        _sum: {
          materials: {
            pointValue: totalPoints
          },
          earnedPoints: earnedPoints
        },
        subcategories: category.Subcategory.map(sub => ({
          id: sub.id,
          name: sub.name,
          description: sub.description,
          materials: sub.Material
        }))
      };
    });

    res.json(transformedCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Gagal mengambil data kategori' });
  }
});

// Get category by id with subcategories and materials
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Attempting to fetch category with ID:', id);

    // Validate ID
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
        Subcategory: {
          include: {
            Material: {
              select: {
                id: true,
                title: true,
                pointValue: true
              }
            }
          }
        }
      }
    });

    console.log('Database query completed. Category found:', !!category);

    if (!category) {
      console.log('Category not found');
      return res.status(404).json({ 
        error: 'Kategori tidak ditemukan',
        details: `Category with ID ${id} does not exist`
      });
    }

    // Transform data untuk konsistensi
    console.log('Transforming category data...');
    const transformedCategory = {
      id: category.id,
      name: category.name,
      description: category.description,
      image: category.image,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      _count: {
        materials: category.Subcategory.reduce((acc, sub) => 
          acc + (sub.Material?.length || 0), 0)
      },
      Subcategory: category.Subcategory.map(sub => ({
        id: sub.id,
        name: sub.name,
        description: sub.description,
        categoryId: sub.categoryId,
        createdAt: sub.createdAt,
        updatedAt: sub.updatedAt,
        materialCount: sub.Material?.length || 0,
        Material: sub.Material
      }))
    };

    console.log('Successfully transformed category data with image:', !!transformedCategory.image);
    res.json(transformedCategory);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Gagal mengambil data kategori' });
  }
});

// Create category
router.post('/', async (req, res) => {
  try {
    const { name, description, image } = req.body;
    console.log('Creating category with image:', image ? 'Image present' : 'No image');
    
    // Upload image if provided
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
});

// Update category
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image } = req.body;
    console.log('Updating category:', id, 'with image:', image ? 'Image present' : 'No image');

    // Upload image if provided
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
        ...(imageUrl && { image: imageUrl }) // Only update image if new one is uploaded
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
});

// Delete category
router.delete('/:id', async (req, res) => {
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
});

module.exports = router; 