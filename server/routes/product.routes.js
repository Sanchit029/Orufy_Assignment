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
const { upload } = require('../config/gridfs.config');
const { getFileStream, getFileInfo } = require('../config/gridfs.config');

// Public route for image retrieval (must be before protect middleware)
router.get('/image/:fileId', async (req, res) => {
  try {
    const fileInfo = await getFileInfo(req.params.fileId);
    
    if (!fileInfo) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.set('Content-Type', fileInfo.contentType);
    res.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year

    const downloadStream = getFileStream(req.params.fileId);
    downloadStream.pipe(res);

    downloadStream.on('error', (error) => {
      console.error('Error streaming file:', error);
      res.status(404).json({ message: 'Image not found' });
    });
  } catch (error) {
    console.error('Error retrieving image:', error);
    res.status(500).json({ message: 'Error retrieving image' });
  }
});

// All routes below are protected
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
