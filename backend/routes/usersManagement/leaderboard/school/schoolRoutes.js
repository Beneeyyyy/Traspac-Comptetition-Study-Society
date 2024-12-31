const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Get all schools with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      province,
      city,
      level,
      type
    } = req.query;

    const skip = (page - 1) * limit;

    // Build filter object
    const where = {
      AND: [
        {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { npsn: { contains: search, mode: 'insensitive' } }
          ]
        },
        ...(province ? [{ province }] : []),
        ...(city ? [{ city }] : []),
        ...(level ? [{ level }] : []),
        ...(type ? [{ type }] : [])
      ]
    };

    // Get total count for pagination
    const total = await prisma.school.count({ where });

    // Get schools with pagination
    const schools = await prisma.school.findMany({
      where,
      skip: parseInt(skip),
      take: parseInt(limit),
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { students: true }
        }
      }
    });

    res.json({
      schools,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching schools:', error);
    res.status(500).json({ error: 'Gagal mengambil data sekolah' });
  }
});

// Create new school
router.post('/', async (req, res) => {
  try {
    const {
      npsn,
      name,
      address,
      city,
      province,
      postalCode,
      level,
      type
    } = req.body;

    // Validasi input
    if (!name || !level || !type) {
      return res.status(400).json({ 
        error: 'Nama sekolah, jenjang, dan tipe sekolah harus diisi' 
      });
    }

    // Generate NPSN jika tidak ada
    const finalNpsn = npsn || `TEMP-${Date.now()}`;

    // Check if NPSN already exists
    const existingSchool = await prisma.school.findUnique({
      where: { npsn: finalNpsn }
    });

    if (existingSchool) {
      return res.status(400).json({ error: 'NPSN sudah terdaftar' });
    }

    const school = await prisma.school.create({
      data: {
        npsn: finalNpsn,
        name,
        address: address || 'Alamat belum diisi',
        city: city || 'Kota belum diisi',
        province: province || 'Provinsi belum diisi',
        postalCode: postalCode || '',
        level,
        type,
        status: 'active'
      }
    });

    res.status(201).json(school);
  } catch (error) {
    console.error('Error creating school:', error);
    res.status(500).json({ error: 'Gagal membuat data sekolah' });
  }
});

// Get school by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const school = await prisma.school.findUnique({
      where: { 
        id: parseInt(id)
      },
      include: {
        _count: {
          select: { students: true }
        }
      }
    });

    if (!school) {
      return res.status(404).json({ error: 'Sekolah tidak ditemukan' });
    }

    res.json(school);
  } catch (error) {
    console.error('Error fetching school:', error);
    res.status(500).json({ error: 'Gagal mengambil data sekolah' });
  }
});

// Update school
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      npsn,
      name,
      address,
      city,
      province,
      postalCode,
      level,
      type,
      status
    } = req.body;

    // Validasi input
    if (!name || !level || !type) {
      return res.status(400).json({ 
        error: 'Nama sekolah, jenjang, dan tipe sekolah harus diisi' 
      });
    }

    // Check if NPSN already exists for different school
    if (npsn) {
      const existingSchool = await prisma.school.findFirst({
        where: {
          npsn,
          NOT: { id: parseInt(id) }
        }
      });

      if (existingSchool) {
        return res.status(400).json({ error: 'NPSN sudah digunakan oleh sekolah lain' });
      }
    }

    const school = await prisma.school.update({
      where: { id: parseInt(id) },
      data: {
        npsn,
        name,
        address,
        city,
        province,
        postalCode,
        level,
        type,
        status
      }
    });

    res.json(school);
  } catch (error) {
    console.error('Error updating school:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Sekolah tidak ditemukan' });
    } else {
      res.status(500).json({ error: 'Gagal mengupdate data sekolah' });
    }
  }
});

// Delete school
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if school has students
    const school = await prisma.school.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: { students: true }
        }
      }
    });

    if (!school) {
      return res.status(404).json({ error: 'Sekolah tidak ditemukan' });
    }

    if (school._count.students > 0) {
      return res.status(400).json({
        error: 'Tidak dapat menghapus sekolah yang masih memiliki siswa terdaftar'
      });
    }

    await prisma.school.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Sekolah berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting school:', error);
    res.status(500).json({ error: 'Gagal menghapus sekolah' });
  }
});

module.exports = router; 