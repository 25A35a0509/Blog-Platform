const express = require('express');
const { getCommentsForPost, addComment, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');
const { commentValidation, validateRequest } = require('../middleware/validators');

const router = express.Router();

router.route('/:postId').get(getCommentsForPost).post(protect, commentValidation, validateRequest, addComment);

router.delete('/:commentId', protect, deleteComment);

module.exports = router;
