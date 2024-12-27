const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const uploadImage = require('../../utils/uploadImage');

const prisma = new PrismaClient();

// Get all materials
router.get('/', async (req, res) => {
  try {
    const materials = await prisma.material.findMany({
      include: {
        Subcategory: {
          include: {
            Category: true
          }
        },
        Point: true
      }
    });
    res.json(materials);
  } catch (error) {
    console.error('Error fetching materials:', error);
    res.status(500).json({ error: 'Gagal mengambil data materi' });
  }
});

// Create material
router.post('/', async (req, res) => {
  try {
    const { title, content, image, pointValue, subcategoryId } = req.body;
    
    if (!title || !content || !subcategoryId) {
      return res.status(400).json({ error: 'Judul, konten, dan subkategori harus diisi' });
    }

    // Upload image to Cloudinary if provided
    let imageUrl = null;
    if (image) {
      try {
        imageUrl = await uploadImage(image);
      } catch (uploadError) {
        return res.status(400).json({ error: uploadError.message });
      }
    }

    const material = await prisma.material.create({
      data: {
        title,
        content,
        image: imageUrl,
        pointValue: pointValue ? parseInt(pointValue) : 0,
        subcategoryId: parseInt(subcategoryId)
      },
      include: {
        Subcategory: {
          include: {
            Category: true
          }
        }
      }
    });

    res.status(201).json(material);
  } catch (error) {
    console.error('Error creating material:', error);
    if (error.code === 'P2003') {
      res.status(400).json({ error: 'Subkategori tidak ditemukan' });
    } else {
      res.status(500).json({ error: 'Gagal membuat materi' });
    }
  }
});

// Get material by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const material = await prisma.material.findUnique({
      where: { id: parseInt(id) },
      include: {
        Subcategory: {
          include: {
            Category: true
          }
        },
        Point: true
      }
    });
    
    if (!material) {
      return res.status(404).json({ error: 'Materi tidak ditemukan' });
    }

    res.json(material);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data materi' });
  }
});

// Get materials by subcategory ID
router.get('/subcategory/:subcategoryId', async (req, res) => {
  try {
    const { subcategoryId } = req.params;
    const materials = await prisma.material.findMany({
      where: { subcategoryId: parseInt(subcategoryId) },
      include: {
        Subcategory: {
          include: {
            Category: true
          }
        },
        Point: true
      }
    });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data materi' });
  }
});

// Update material
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, image, pointValue, subcategoryId } = req.body;
    
    // Upload image to Cloudinary if provided
    let imageUrl = null;
    if (image) {
      try {
        imageUrl = await uploadImage(image);
      } catch (uploadError) {
        return res.status(400).json({ error: uploadError.message });
      }
    }

    const material = await prisma.material.update({
      where: { id: parseInt(id) },
      data: {
        title,
        content,
        ...(imageUrl && { image: imageUrl }),
        pointValue: pointValue ? parseInt(pointValue) : undefined,
        subcategoryId: subcategoryId ? parseInt(subcategoryId) : undefined
      },
      include: {
        Subcategory: {
          include: {
            Category: true
          }
        }
      }
    });

    res.json(material);
  } catch (error) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Materi tidak ditemukan' });
    } else if (error.code === 'P2003') {
      res.status(400).json({ error: 'Subkategori tidak ditemukan' });
    } else {
      res.status(500).json({ error: 'Gagal mengupdate materi' });
    }
  }
});

// Delete material
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.material.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Materi berhasil dihapus' });
  } catch (error) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Materi tidak ditemukan' });
    } else {
      res.status(500).json({ error: 'Gagal menghapus materi' });
    }
  }
});

module.exports = router; 