const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const uploadImage = require('../../utils/uploadImage');

const prisma = new PrismaClient();

// Get all subcategories
router.get('/', async (req, res) => {
  try {
    const subcategories = await prisma.subcategory.findMany({
      include: {
        Category: true,
        Material: true,
        Point: true
      }
    });
    res.json(subcategories);
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    res.status(500).json({ error: 'Gagal mengambil data subkategori' });
  }
});

// Create subcategory
router.post('/', async (req, res) => {
  try {
    const { name, description, categoryId, image } = req.body;
    
    if (!name || !categoryId) {
      return res.status(400).json({ error: 'Nama dan kategori harus diisi' });
    }

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

    console.log('Creating subcategory in database with image URL:', imageUrl);
    const subcategory = await prisma.subcategory.create({
      data: {
        name,
        description,
        image: imageUrl,
        categoryId: parseInt(categoryId)
      },
      include: {
        Category: true
      }
    });

    console.log('Subcategory created successfully:', {
      id: subcategory.id,
      name: subcategory.name,
      hasImage: !!subcategory.image,
      imageUrl: subcategory.image
    });

    res.status(201).json(subcategory);
  } catch (error) {
    console.error('Error creating subcategory:', error);
    if (error.code === 'P2003') {
      res.status(400).json({ error: 'Kategori tidak ditemukan' });
    } else {
      res.status(500).json({ error: 'Gagal membuat subkategori' });
    }
  }
});

// Get subcategory by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const subcategory = await prisma.subcategory.findUnique({
      where: { id: parseInt(id) },
      include: {
        Category: true,
        Material: true,
        Point: true
      }
    });
    
    if (!subcategory) {
      return res.status(404).json({ error: 'Subkategori tidak ditemukan' });
    }

    res.json(subcategory);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data subkategori' });
  }
});

// Get subcategories by category ID
router.get('/category/:categoryId', async (req, res) => {
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
        Material: {
          select: {
            id: true,
            title: true,
            pointValue: true
          }
        },
        Point: true,
        Category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // Transform data untuk konsistensi
    const transformedSubcategories = subcategories.map(sub => ({
      id: sub.id,
      name: sub.name,
      description: sub.description,
      image: sub.image,
      categoryId: sub.categoryId,
      createdAt: sub.createdAt,
      updatedAt: sub.updatedAt,
      materialCount: sub.Material?.length || 0,
      Category: sub.Category,
      Material: sub.Material
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
});

// Update subcategory
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, categoryId, image } = req.body;
    console.log('Updating subcategory:', id, 'with image:', image ? 'Image present' : 'No image');
    
    // Upload image if provided
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
        ...(imageUrl && { image: imageUrl }), // Only update image if new one is uploaded
        categoryId: categoryId ? parseInt(categoryId) : undefined
      },
      include: {
        Category: true
      }
    });

    console.log('Subcategory updated successfully:', {
      id: subcategory.id,
      name: subcategory.name,
      hasImage: !!subcategory.image,
      imageUrl: subcategory.image
    });

    res.json(subcategory);
  } catch (error) {
    console.error('Error updating subcategory:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Subkategori tidak ditemukan' });
    } else if (error.code === 'P2003') {
      res.status(400).json({ error: 'Kategori tidak ditemukan' });
    } else {
      res.status(500).json({ error: 'Gagal mengupdate subkategori' });
    }
  }
});

// Delete subcategory
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.subcategory.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Subkategori berhasil dihapus' });
  } catch (error) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Subkategori tidak ditemukan' });
    } else {
      res.status(500).json({ error: 'Gagal menghapus subkategori' });
    }
  }
});

module.exports = router; 