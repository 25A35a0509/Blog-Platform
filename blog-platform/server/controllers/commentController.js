const asyncHandler = require('express-async-handler');
const Comment = require('../models/Comment');
const Post = require('../models/Post');

/**
 * @desc    Get all comments for a given post
 * @route   GET /api/comments/:postId
 * @access  Public
 */
const getCommentsForPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  const comments = await Comment.find({ post: req.params.postId })
    .populate('author', 'name avatar')
    .sort({ createdAt: -1 });

  res.json({ success: true, count: comments.length, data: comments });
});

/**
 * @desc    Add a comment to a post
 * @route   POST /api/comments/:postId
 * @access  Private
 */
const addComment = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  const comment = await Comment.create({
    text: req.body.text,
    author: req.user._id,
    post: post._id,
  });

  const populated = await comment.populate('author', 'name avatar');

  res.status(201).json({ success: true, data: populated });
});

/**
 * @desc    Delete a comment (owner only)
 * @route   DELETE /api/comments/:commentId
 * @access  Private
 */
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  if (comment.author.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this comment');
  }

  await comment.deleteOne();

  res.json({ success: true, data: { _id: req.params.commentId } });
});

module.exports = { getCommentsForPost, addComment, deleteComment };
