const asyncHandler = require('express-async-handler');

/**
 * @desc    Upload an image (post cover or avatar) to Cloudinary
 * @route   POST /api/upload
 * @access  Private
 * @note    Expects multipart/form-data with field name "image".
 *          The `upload` multer middleware (Cloudinary storage) populates req.file.
 */
const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No image file provided');
  }

  res.status(201).json({
    success: true,
    data: {
      url: req.file.path, // secure Cloudinary URL
      publicId: req.file.filename,
    },
  });
});

module.exports = { uploadImage };
