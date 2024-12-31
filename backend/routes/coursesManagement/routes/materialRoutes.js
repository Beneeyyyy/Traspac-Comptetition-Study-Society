const express = require('express');
const router = express.Router();
const {
  getAllMaterials,
  getMaterialById,
  getMaterialsBySubcategoryId,
  createMaterial,
  updateMaterial,
  deleteMaterial
} = require('../controllers/materialController');

// Material routes
router.get('/', getAllMaterials);
router.get('/:id', getMaterialById);
router.get('/subcategory/:subcategoryId', getMaterialsBySubcategoryId);
router.post('/', createMaterial);
router.put('/:id', updateMaterial);
router.delete('/:id', deleteMaterial);

module.exports = router; 