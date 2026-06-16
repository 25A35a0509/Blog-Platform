const express = require('express');
const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  getCategories,
} = require('../controllers/postController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const { postValidation, validateRequest } = require('../middleware/validators');

const router = express.Router();

router.get('/categories', getCategories);

router.route('/').get(optionalAuth, getPosts).post(protect, postValidation, validateRequest, createPost);

router
  .route('/:id')
  .get(getPostById)
  .put(protect, postValidation, validateRequest, updatePost)
  .delete(protect, deletePost);

router.put('/:id/like', protect, toggleLike);

module.exports = router;
