const express = require('express');
const { uploadImage } = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

const router = express.Router();

router.post('/', protect, upload.single('image'), uploadImage);

module.exports = router;
