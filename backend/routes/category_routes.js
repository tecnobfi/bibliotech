const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category_controller');
const { verifyToken } = require('../middleware/auth_middleware');
const { validateCategoryCreate } = require('../middleware/validation_middleware');

router.get('/', verifyToken, categoryController.getAll);
router.post('/', verifyToken, validateCategoryCreate, categoryController.create);

module.exports = router;
