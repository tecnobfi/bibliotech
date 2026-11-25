
const express = require('express');
const router = express.Router();
const { getCategories } = require('../controllers/category\_controller');

// GET /api/categories - Obtener lista completa de categorías
router.get('/', getCategories);
module.exports = router;