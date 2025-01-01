const express = require('express');
const router = express.Router();
const {
  getAllSubcategories,
  getSubcategoryById,
  getSubcategoriesByCategoryId,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory
} = require('../controllers/subcategoryController');

// Subcastegory routes
router.get('/', getAllSubcategories);
router.get('/:id', getSubcategoryById);
router.get('/category/:categoryId', getSubcategoriesByCategoryId);
router.post('/', createSubcategory);
router.put('/:id', updateSubcategory);
router.delete('/:id', deleteSubcategory);

module.exports = router; 