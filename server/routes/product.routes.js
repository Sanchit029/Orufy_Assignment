const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  togglePublish
} = require('../controllers/product.controller');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// All routes are protected
router.use(protect);

router.route('/')
  .get(getAllProducts)
  .post(upload.array('images', 10), createProduct);

router.route('/:id')
  .get(getProduct)
  .put(upload.array('images', 10), updateProduct)
  .delete(deleteProduct);

router.patch('/:id/publish', togglePublish);

module.exports = router;
