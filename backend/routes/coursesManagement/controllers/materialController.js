const { PrismaClient } = require('@prisma/client');
const uploadImage = require('../../../utils/uploadImage');

const prisma = new PrismaClient();

// Get all materials
const getAllMaterials = async (req, res) => {
  try {
    console.log('Fetching all materials...');
    const materials = await prisma.material.findMany({
      include: {
        subcategory: {
          include: {
            category: true
          }
        },
        points: true
      }
    });
    
    console.log(`Found ${materials.length} materials`);
    
    const transformedMaterials = materials.map(material => ({
      id: material.id,
      title: material.title,
      content: material.content,
      point_value: material.point_value,
      image: material.image,
      subcategoryId: material.subcategoryId,
      createdAt: material.createdAt,
      updatedAt: material.updatedAt,
      subcategory: material.subcategory,
      totalPoints: material.points?.reduce((sum, point) => sum + point.value, 0) || 0
    }));

    res.json(transformedMaterials);
  } catch (error) {
    console.error('Error fetching materials:', error);
    res.status(500).json({ 
      error: 'Gagal mengambil data materi',
      details: error.message 
    });
  }
};

// Get material by ID
const getMaterialById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Fetching material with ID:', id);
    
    const material = await prisma.material.findUnique({
      where: { id: parseInt(id) },
      include: {
        subcategory: {
          include: {
            category: true
          }
        },
        stages: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    });
    
    if (!material) {
      console.log('Material not found');
      return res.status(404).json({ error: 'Materi tidak ditemukan' });
    }

    console.log('Raw material data:', {
      id: material.id,
      title: material.title,
      glossary: material.glossary
    });

    // Transform stages into learning steps
    const learningSteps = material.stages.map((stage, index) => ({
      id: stage.id,
      title: stage.title,
      description: stage.description,
      status: index === 0 ? "current" : "locked",
      xp_reward: stage.xp_reward || 25 + (index * 10),
      color: ["blue", "purple", "emerald", "yellow"][index % 4],
      time: `${15 + (index * 5)}-${20 + (index * 5)} menit`,
      opacity: index > 0 ? `opacity-${40 - (index * 10)}` : ""
    }));

    const transformedMaterial = {
      id: material.id,
      title: material.title,
      level: "Level 1 - Fundamental",
      category: material.subcategory.category.name,
      description: material.description,
      total_xp: material.xp_reward,
      total_stages: material.stages.length,
      estimated_time: material.estimated_time || "90 Menit",
      stages: learningSteps,
      glossary: material.glossary ? material.glossary.map(item => [item.term, item.definition]) : []
    };

    console.log('Transformed material:', {
      id: transformedMaterial.id,
      title: transformedMaterial.title,
      glossary: transformedMaterial.glossary
    });

    res.json(transformedMaterial);
  } catch (error) {
    console.error('Error fetching material:', error);
    res.status(500).json({ 
      error: 'Gagal mengambil data materi',
      details: error.message
    });
  }
};

// Get materials by subcategory ID
const getMaterialsBySubcategoryId = async (req, res) => {
  try {
    const { subcategoryId } = req.params;
    console.log('Fetching materials for subcategory ID:', subcategoryId);

    const materials = await prisma.material.findMany({
      where: { subcategoryId: parseInt(subcategoryId) },
      include: {
        subcategory: {
          include: {
            category: true
          }
        },
        points: true
      }
    });

    const transformedMaterials = materials.map(material => ({
      id: material.id,
      title: material.title,
      content: material.content,
      point_value: material.point_value,
      image: material.image,
      subcategoryId: material.subcategoryId,
      createdAt: material.createdAt,
      updatedAt: material.updatedAt,
      subcategory: material.subcategory,
      totalPoints: material.points?.reduce((sum, point) => sum + point.value, 0) || 0
    }));

    console.log(`Found ${materials.length} materials for subcategory ${subcategoryId}`);
    res.json(transformedMaterials);
  } catch (error) {
    console.error('Error fetching materials:', error);
    res.status(500).json({ 
      error: 'Gagal mengambil data materi',
      details: error.message
    });
  }
};

// Create matearial
const createMaterial = async (req, res) => {
  try {
    const { title, content, image, point_value, subcategoryId } = req.body;
    console.log('Creating material:', { 
      title, 
      content: content.substring(0, 50) + '...', 
      subcategoryId, 
      point_value,
      hasImage: !!image 
    });
    
    if (!title || !content || !subcategoryId) {
      return res.status(400).json({ error: 'Judul, konten, dan subkategori harus diisi' });
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

    console.log('Creating material in database with data:', {
      title,
      contentLength: content.length,
      hasImage: !!imageUrl,
      point_value,
      subcategoryId
    });

    // First create the material
    const material = await prisma.material.create({
      data: {
        title,
        content,
        image: imageUrl,
        point_value: point_value ? parseInt(point_value) : 0,
        subcategoryId: parseInt(subcategoryId)
      }
    });

    // Then fetch the created material with its relations
    const materialWithRelations = await prisma.material.findUnique({
      where: { id: material.id },
      include: {
        subcategory: {
          include: {
            category: true
          }
        }
      }
    });

    console.log('Material created successfully:', {
      id: material.id,
      title: material.title,
      hasImage: !!material.image
    });

    res.status(201).json(materialWithRelations);
  } catch (error) {
    console.error('Error creating material:', error);
    if (error.code === 'P2003') {
      res.status(400).json({ error: 'Subkategori tidak ditemukan' });
    } else {
      res.status(500).json({ 
        error: 'Gagal membuat materi',
        details: error.message
      });
    }
  }
};

// Update material
const updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, image, point_value, subcategoryId } = req.body;
    console.log('Updating material:', id, {
      title,
      content: content?.substring(0, 50) + '...',
      point_value,
      subcategoryId,
      hasImage: !!image
    });
    
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

    const material = await prisma.material.update({
      where: { id: parseInt(id) },
      data: {
        title,
        content,
        ...(imageUrl && { image: imageUrl }),
        point_value: point_value ? parseInt(point_value) : undefined,
        subcategoryId: subcategoryId ? parseInt(subcategoryId) : undefined
      },
      include: {
        subcategory: {
          include: {
            category: true
          }
        }
      }
    });

    console.log('Material updated successfully:', {
      id: material.id,
      title: material.title,
      hasImage: !!material.image
    });

    res.json(material);
  } catch (error) {
    console.error('Error updating material:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Materi tidak ditemukan' });
    } else if (error.code === 'P2003') {
      res.status(400).json({ error: 'Subkategori tidak ditemukan' });
    } else {
      res.status(500).json({ 
        error: 'Gagal mengupdate materi',
        details: error.message
      });
    }
  }
};

// Delete material
const deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.material.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Materi berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting material:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Materi tidak ditemukan' });
    } else {
      res.status(500).json({ 
        error: 'Gagal menghapus materi',
        details: error.message
      });
    }
  }
};

module.exports = {
  getAllMaterials,
  getMaterialById,
  getMaterialsBySubcategoryId,
  createMaterial,
  updateMaterial,
  deleteMaterial
}; 