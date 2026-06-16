const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

/**
 * @desc    Get all posts with pagination, search, category filter, and author filter
 * @route   GET /api/posts
 * @query   page, limit, search, category, author, tag, mine
 * @access  Public (optionalAuth so `mine=true` can resolve to req.user)
 */
const getPosts = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 6, 1), 50);
  const skip = (page - 1) * limit;

  const query = {};

  // Full-text search across title, content, and tags
  if (req.query.search) {
    query.$text = { $search: req.query.search };
  }

  // Filter by category (case-insensitive exact match)
  if (req.query.category) {
    query.category = new RegExp(`^${req.query.category}$`, 'i');
  }

  // Filter by tag
  if (req.query.tag) {
    query.tags = new RegExp(`^${req.query.tag}$`, 'i');
  }

  // Filter by author id or author name
  if (req.query.author) {
    if (mongoose.Types.ObjectId.isValid(req.query.author)) {
      query.author = req.query.author;
    } else {
      const User = require('../models/User');
      const authorDoc = await User.findOne({ name: new RegExp(`^${req.query.author}$`, 'i') });
      query.author = authorDoc ? authorDoc._id : null;
    }
  }

  // "My posts" — requires authentication
  if (req.query.mine === 'true') {
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized, no token provided');
    }
    query.author = req.user._id;
  }

  const sort = req.query.search ? { score: { $meta: 'textScore' } } : { createdAt: -1 };
  const projection = req.query.search ? { score: { $meta: 'textScore' } } : {};

  const [posts, total] = await Promise.all([
    Post.find(query, projection)
      .populate('author', 'name email avatar')
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Post.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: posts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },
  });
});

/**
 * @desc    Get a single post by ID or slug, and increment its view count
 * @route   GET /api/posts/:id
 * @access  Public
 */
const getPostById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const filter = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { slug: id };

  const post = await Post.findOneAndUpdate(filter, { $inc: { views: 1 } }, { new: true }).populate(
    'author',
    'name email avatar bio'
  );

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  res.json({ success: true, data: post });
});

/**
 * @desc    Create a new post
 * @route   POST /api/posts
 * @access  Private
 */
const createPost = asyncHandler(async (req, res) => {
  const { title, content, category, tags, coverImage } = req.body;

  const post = await Post.create({
    title,
    content,
    category: category || 'General',
    tags: Array.isArray(tags) ? tags : tags ? String(tags).split(',').map((t) => t.trim()).filter(Boolean) : [],
    coverImage: coverImage || '',
    author: req.user._id,
  });

  const populated = await post.populate('author', 'name email avatar');

  res.status(201).json({ success: true, data: populated });
});

/**
 * @desc    Update a post (owner only)
 * @route   PUT /api/posts/:id
 * @access  Private
 */
const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  if (post.author.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this post');
  }

  const { title, content, category, tags, coverImage } = req.body;

  if (title !== undefined) post.title = title;
  if (content !== undefined) post.content = content;
  if (category !== undefined) post.category = category;
  if (coverImage !== undefined) post.coverImage = coverImage;
  if (tags !== undefined) {
    post.tags = Array.isArray(tags) ? tags : String(tags).split(',').map((t) => t.trim()).filter(Boolean);
  }

  const updated = await post.save();
  const populated = await updated.populate('author', 'name email avatar');

  res.json({ success: true, data: populated });
});

/**
 * @desc    Delete a post (owner only) and cascade-delete its comments
 * @route   DELETE /api/posts/:id
 * @access  Private
 */
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  if (post.author.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this post');
  }

  await Comment.deleteMany({ post: post._id });
  await post.deleteOne();

  res.json({ success: true, data: { _id: req.params.id } });
});

/**
 * @desc    Toggle a like on a post for the logged-in user
 * @route   PUT /api/posts/:id/like
 * @access  Private
 */
const toggleLike = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  const userId = req.user._id.toString();
  const alreadyLiked = post.likes.some((id) => id.toString() === userId);

  if (alreadyLiked) {
    post.likes = post.likes.filter((id) => id.toString() !== userId);
  } else {
    post.likes.push(req.user._id);
  }

  await post.save();

  res.json({
    success: true,
    data: { _id: post._id, likes: post.likes, liked: !alreadyLiked, likeCount: post.likes.length },
  });
});

/**
 * @desc    Get distinct categories across all posts (for filter dropdowns)
 * @route   GET /api/posts/categories
 * @access  Public
 */
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Post.distinct('category');
  res.json({ success: true, data: categories.sort() });
});

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  getCategories,
};
